#!/bin/bash

echo "🔍 Checking available Bedrock models..."
echo "========================================"

# Set credentials from .env.local
export AWS_ACCESS_KEY_ID=$(grep AWS_ACCESS_KEY_ID .env.local | cut -d '=' -f2)
export AWS_SECRET_ACCESS_KEY=$(grep AWS_SECRET_ACCESS_KEY .env.local | cut -d '=' -f2)
export AWS_SESSION_TOKEN=$(grep AWS_SESSION_TOKEN .env.local | cut -d '=' -f2)
export AWS_REGION=$(grep "^AWS_REGION" .env.local | cut -d '=' -f2)

echo "Region: $AWS_REGION"
echo ""

# Check available models
echo "📋 All available models:"
aws bedrock list-foundation-models --query 'modelSummaries[].{ID:modelId,Name:modelName,Provider:providerName}' --output table

echo ""
echo "🎨 Image generation models:"
aws bedrock list-foundation-models --query 'modelSummaries[?contains(modelId, `stability`) || contains(modelId, `nova-canvas`)].{ID:modelId,Name:modelName}' --output table

echo ""
echo "📝 Text generation models:"
aws bedrock list-foundation-models --query 'modelSummaries[?contains(modelId, `anthropic`) || contains(modelId, `nova-pro`)].{ID:modelId,Name:modelName}' --output table

echo ""
echo "🎬 Video generation models:"
aws bedrock list-foundation-models --query 'modelSummaries[?contains(modelId, `nova-reel`)].{ID:modelId,Name:modelName}' --output table