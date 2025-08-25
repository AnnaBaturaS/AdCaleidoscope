#!/bin/bash

# Initialize LocalStack Resources for AdAlchemy Creative OS
set -e

LOCALSTACK_URL=${LOCALSTACK_URL:-"http://localhost:4566"}
AWS_REGION=${AWS_REGION:-"us-east-1"}

echo "Initializing LocalStack resources..."
echo "LocalStack URL: $LOCALSTACK_URL"
echo "AWS Region: $AWS_REGION"

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
until curl -s $LOCALSTACK_URL/health > /dev/null; do
  echo "Waiting for LocalStack..."
  sleep 2
done
echo "LocalStack is ready!"

# Create S3 Buckets
echo "Creating S3 buckets..."
awslocal s3 mb s3://creativeos-raw --region $AWS_REGION
awslocal s3 mb s3://creativeos-generated --region $AWS_REGION
awslocal s3 mb s3://creativeos-datalake --region $AWS_REGION

# Enable S3 CORS for all buckets
for bucket in creativeos-raw creativeos-generated creativeos-datalake; do
  echo "Setting CORS for bucket: $bucket"
  awslocal s3api put-bucket-cors --bucket $bucket --cors-configuration '{
    "CORSRules": [{
      "AllowedOrigins": ["http://localhost:3000"],
      "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag", "x-amz-request-id"],
      "MaxAgeSeconds": 3000
    }]
  }'
done

# Create DynamoDB Tables
echo "Creating DynamoDB tables..."

# Creatives table
awslocal dynamodb create-table \
  --table-name Creatives \
  --attribute-definitions \
    AttributeName=creativeId,AttributeType=S \
    AttributeName=version,AttributeType=N \
  --key-schema \
    AttributeName=creativeId,KeyType=HASH \
    AttributeName=version,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region $AWS_REGION

# Experiments table
awslocal dynamodb create-table \
  --table-name Experiments \
  --attribute-definitions \
    AttributeName=expId,AttributeType=S \
  --key-schema \
    AttributeName=expId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region $AWS_REGION

# Briefs table
awslocal dynamodb create-table \
  --table-name Briefs \
  --attribute-definitions \
    AttributeName=briefId,AttributeType=S \
  --key-schema \
    AttributeName=briefId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region $AWS_REGION

# Create SQS Queues
echo "Creating SQS queues..."
awslocal sqs create-queue \
  --queue-name generation-jobs \
  --region $AWS_REGION

# Create EventBridge Custom Bus
echo "Creating EventBridge custom bus..."
awslocal events create-event-bus \
  --name creativeos-bus \
  --region $AWS_REGION

# Create EventBridge Rule
awslocal events put-rule \
  --name generation-completed-rule \
  --event-pattern '{
    "source": ["creativeos.generation"],
    "detail-type": ["Generation Completed"]
  }' \
  --state ENABLED \
  --event-bus-name creativeos-bus \
  --region $AWS_REGION

# Create Step Functions State Machine
echo "Creating Step Functions state machine..."
cat > /tmp/generation-workflow.json << 'EOF'
{
  "Comment": "Creative Generation Workflow",
  "StartAt": "Generate",
  "States": {
    "Generate": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:000000000000:function:generate-creative",
        "Payload": {
          "type.$": "$.type",
          "prompt.$": "$.prompt",
          "parameters.$": "$.parameters",
          "jobId.$": "$.jobId"
        }
      },
      "Next": "Validate",
      "Catch": [{
        "ErrorEquals": ["States.TaskFailed"],
        "Next": "Failed",
        "ResultPath": "$.error"
      }]
    },
    "Validate": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:000000000000:function:validate-creative",
        "Payload": {
          "jobId.$": "$.jobId",
          "generatedAssets.$": "$.generatedAssets"
        }
      },
      "Next": "Publish",
      "Catch": [{
        "ErrorEquals": ["States.TaskFailed"],
        "Next": "Failed",
        "ResultPath": "$.error"
      }]
    },
    "Publish": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:000000000000:function:publish-creative",
        "Payload": {
          "jobId.$": "$.jobId",
          "validatedAssets.$": "$.validatedAssets"
        }
      },
      "End": true,
      "Catch": [{
        "ErrorEquals": ["States.TaskFailed"],
        "Next": "Failed",
        "ResultPath": "$.error"
      }]
    },
    "Failed": {
      "Type": "Fail",
      "Cause": "Creative generation workflow failed"
    }
  }
}
EOF

awslocal stepfunctions create-state-machine \
  --name GenerationWorkflow \
  --definition file:///tmp/generation-workflow.json \
  --role-arn "arn:aws:iam::000000000000:role/StepFunctionsRole" \
  --region $AWS_REGION

# Create mock Lambda functions (for LocalStack)
echo "Creating mock Lambda functions..."

# Generate Creative Function
cat > /tmp/generate-function.py << 'EOF'
import json
import boto3
import time
import random

def lambda_handler(event, context):
    """Mock function that simulates Bedrock generation"""
    print(f"Generating creative with payload: {json.dumps(event)}")
    
    job_id = event.get('jobId')
    prompt = event.get('prompt', '')
    creative_type = event.get('type', 'image')
    
    # Simulate processing time
    time.sleep(2)
    
    # Mock generated assets
    if creative_type == 'image':
        assets = [{
            'id': f'asset_{job_id}_{random.randint(1000, 9999)}',
            'type': 'image',
            'url': f'/generated/images/{job_id}.png',
            'metadata': {
                'width': 1024,
                'height': 1024,
                'format': 'png',
                'fileSize': 256000
            }
        }]
    elif creative_type == 'video':
        assets = [{
            'id': f'asset_{job_id}_{random.randint(1000, 9999)}',
            'type': 'video',
            'url': f'/generated/videos/{job_id}.mp4',
            'metadata': {
                'width': 1080,
                'height': 1920,
                'duration': 15,
                'format': 'mp4',
                'fileSize': 5120000
            }
        }]
    else:
        assets = []
    
    return {
        'statusCode': 200,
        'jobId': job_id,
        'status': 'completed',
        'generatedAssets': assets
    }
EOF

# Validate Creative Function
cat > /tmp/validate-function.py << 'EOF'
import json

def lambda_handler(event, context):
    """Mock function that validates generated creatives"""
    print(f"Validating creative with payload: {json.dumps(event)}")
    
    job_id = event.get('jobId')
    assets = event.get('generatedAssets', [])
    
    # Mock validation - always pass for demo
    validated_assets = []
    for asset in assets:
        validated_assets.append({
            **asset,
            'validation': {
                'passed': True,
                'checks': ['fileSize', 'dimensions', 'format', 'brandSafety'],
                'score': 0.95
            }
        })
    
    return {
        'statusCode': 200,
        'jobId': job_id,
        'status': 'validated',
        'validatedAssets': validated_assets
    }
EOF

# Publish Creative Function
cat > /tmp/publish-function.py << 'EOF'
import json
import boto3

def lambda_handler(event, context):
    """Mock function that publishes completed creatives"""
    print(f"Publishing creative with payload: {json.dumps(event)}")
    
    job_id = event.get('jobId')
    assets = event.get('validatedAssets', [])
    
    # Mock publishing to EventBridge
    eventbridge = boto3.client('events', endpoint_url='http://localhost:4566')
    
    try:
        eventbridge.put_events(
            Entries=[{
                'Source': 'creativeos.generation',
                'DetailType': 'Generation Completed',
                'Detail': json.dumps({
                    'jobId': job_id,
                    'status': 'completed',
                    'assets': assets,
                    'timestamp': context.aws_request_id if context else 'mock-time'
                }),
                'EventBusName': 'creativeos-bus'
            }]
        )
    except Exception as e:
        print(f"Error publishing event: {e}")
    
    return {
        'statusCode': 200,
        'jobId': job_id,
        'status': 'published',
        'publishedAssets': assets
    }
EOF

# Create Lambda function ZIP files and deploy
for func in generate validate publish; do
    echo "Creating ${func}-creative Lambda function..."
    cd /tmp
    zip ${func}-creative.zip ${func}-function.py
    
    awslocal lambda create-function \
        --function-name ${func}-creative \
        --runtime python3.9 \
        --role arn:aws:iam::000000000000:role/lambda-role \
        --handler ${func}-function.lambda_handler \
        --zip-file fileb://${func}-creative.zip \
        --region $AWS_REGION
done

echo "✅ LocalStack initialization completed!"
echo ""
echo "Resources created:"
echo "- S3 Buckets: creativeos-raw, creativeos-generated, creativeos-datalake"
echo "- DynamoDB Tables: Creatives, Experiments, Briefs"
echo "- SQS Queue: generation-jobs"
echo "- EventBridge Bus: creativeos-bus"
echo "- Step Functions: GenerationWorkflow"
echo "- Lambda Functions: generate-creative, validate-creative, publish-creative"
echo ""
echo "You can now run your Next.js application with LOCAL AWS services!"