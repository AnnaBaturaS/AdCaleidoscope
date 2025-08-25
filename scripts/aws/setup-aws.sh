#!/bin/bash

echo "🚀 AdAlchemy Creative OS - AWS Setup"
echo "====================================="
echo ""
echo "This script will help you configure AWS credentials."
echo "Your credentials will be stored in ~/.aws/credentials"
echo ""

read -p "Enter your AWS Access Key ID: " ACCESS_KEY
read -s -p "Enter your AWS Secret Access Key: " SECRET_KEY
echo ""
read -p "Enter your AWS Session Token (if provided): " SESSION_TOKEN

# Configure aws profile
aws configure set aws_access_key_id "$ACCESS_KEY" --profile aws
aws configure set aws_secret_access_key "$SECRET_KEY" --profile aws

if [ ! -z "$SESSION_TOKEN" ]; then
    aws configure set aws_session_token "$SESSION_TOKEN" --profile aws
fi

# Set default regions
aws configure set region us-east-1 --profile aws

echo ""
echo "✅ AWS profile configured!"
echo ""
echo "Testing access to both regions..."
echo ""

echo "🔍 Testing us-east-1..."
AWS_PROFILE=aws aws sts get-caller-identity --region us-east-1

echo ""
echo "🔍 Testing us-west-2..."
AWS_PROFILE=aws aws sts get-caller-identity --region us-west-2

echo ""
echo "✅ Setup complete! Use 'export AWS_PROFILE=aws' to use this profile"
echo ""
echo "Available commands:"
echo "  ./scripts/aws/test-bedrock-aws.sh    # Test Bedrock models"
echo "  npm run bedrock:test                       # Test via npm"