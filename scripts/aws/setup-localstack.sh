#!/bin/bash

# Setup LocalStack resources for AdAlchemy Creative OS
echo "🚀 Setting up LocalStack resources for AdAlchemy Creative OS..."

# Use LocalStack profile
PROFILE="localstack"
ENDPOINT="--endpoint-url=http://localhost:4566"

echo "📦 Creating S3 buckets..."
aws s3 mb s3://creativeos-raw $ENDPOINT --profile $PROFILE
aws s3 mb s3://creativeos-generated $ENDPOINT --profile $PROFILE
aws s3 mb s3://creativeos-datalake $ENDPOINT --profile $PROFILE

echo "🗃️ Creating DynamoDB tables..."
# Creatives table
aws dynamodb create-table \
    --table-name Creatives \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    $ENDPOINT --profile $PROFILE

# Experiments table
aws dynamodb create-table \
    --table-name Experiments \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    $ENDPOINT --profile $PROFILE

# Briefs table
aws dynamodb create-table \
    --table-name Briefs \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    $ENDPOINT --profile $PROFILE

echo "📬 Creating SQS queues..."
aws sqs create-queue \
    --queue-name generation-jobs \
    $ENDPOINT --profile $PROFILE

echo "🚌 Creating EventBridge custom bus..."
aws events create-event-bus \
    --name creativeos-bus \
    $ENDPOINT --profile $PROFILE

echo "⚡ Creating Step Functions state machine..."
# Create IAM role for Step Functions (LocalStack)
aws iam create-role \
    --role-name StepFunctionsRole \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "states.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }' \
    $ENDPOINT --profile $PROFILE

# Attach basic execution policy
aws iam attach-role-policy \
    --role-name StepFunctionsRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaRole \
    $ENDPOINT --profile $PROFILE

# Create Step Functions state machine
aws stepfunctions create-state-machine \
    --name GenerationWorkflow \
    --definition '{
        "Comment": "Creative Generation Workflow",
        "StartAt": "Generate",
        "States": {
            "Generate": {
                "Type": "Task",
                "Resource": "arn:aws:states:::lambda:invoke",
                "Parameters": {
                    "FunctionName": "generate-creative",
                    "Payload.$": "$"
                },
                "Next": "Validate"
            },
            "Validate": {
                "Type": "Task",
                "Resource": "arn:aws:states:::lambda:invoke",
                "Parameters": {
                    "FunctionName": "validate-creative",
                    "Payload.$": "$"
                },
                "Next": "Publish"
            },
            "Publish": {
                "Type": "Task",
                "Resource": "arn:aws:states:::lambda:invoke",
                "Parameters": {
                    "FunctionName": "publish-creative",
                    "Payload.$": "$"
                },
                "End": true
            }
        }
    }' \
    --role-arn arn:aws:iam::000000000000:role/StepFunctionsRole \
    $ENDPOINT --profile $PROFILE

echo "✅ LocalStack setup complete!"
echo "🔍 You can view resources at: http://localhost:4566"