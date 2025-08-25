#!/bin/bash

# Check LocalStack resources for AdAlchemy Creative OS
echo "🔍 Checking LocalStack resources..."

PROFILE="localstack"
ENDPOINT="--endpoint-url=http://localhost:4566"

echo -e "\n📦 S3 Buckets:"
aws s3 ls $ENDPOINT --profile $PROFILE

echo -e "\n🗃️ DynamoDB Tables:"
aws dynamodb list-tables $ENDPOINT --profile $PROFILE --output table

echo -e "\n📬 SQS Queues:"
aws sqs list-queues $ENDPOINT --profile $PROFILE --output table

echo -e "\n🚌 EventBridge Buses:"
aws events list-event-buses $ENDPOINT --profile $PROFILE --output table

echo -e "\n⚡ Step Functions State Machines:"
aws stepfunctions list-state-machines $ENDPOINT --profile $PROFILE --output table

echo -e "\n🏠 LocalStack Health:"
curl -s http://localhost:4566/_localstack/health | jq '.'