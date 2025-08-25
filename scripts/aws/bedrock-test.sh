#!/bin/bash

# Test AWS Bedrock models (requires real AWS credentials)
echo "🤖 Testing AWS Bedrock models..."

REGION="us-east-1"

echo -e "\n📋 Available Bedrock models:"
aws bedrock list-foundation-models --region $REGION --output table

echo -e "\n🎨 Testing Nova Canvas (Image Generation):"
aws bedrock-runtime invoke-model \
    --region $REGION \
    --model-id amazon.nova-canvas-v1:0 \
    --content-type application/json \
    --accept application/json \
    --body '{
        "taskType": "TEXT_IMAGE",
        "textToImageParams": {
            "text": "A beautiful sunset over mountains"
        },
        "imageGenerationConfig": {
            "numberOfImages": 1,
            "width": 1024,
            "height": 1024,
            "cfgScale": 8.0,
            "seed": 0
        }
    }' \
    /tmp/nova-canvas-response.json

echo "✅ Nova Canvas response saved to /tmp/nova-canvas-response.json"

echo -e "\n🎬 Testing Nova Reel (Video Generation):"
aws bedrock-runtime invoke-model \
    --region $REGION \
    --model-id amazon.nova-reel-v1:0 \
    --content-type application/json \
    --accept application/json \
    --body '{
        "taskType": "TEXT_VIDEO",
        "textToVideoParams": {
            "text": "A timelapse of clouds moving over a city skyline"
        },
        "videoGenerationConfig": {
            "durationSeconds": 6,
            "fps": 24,
            "dimension": "1280x720",
            "seed": 0
        }
    }' \
    /tmp/nova-reel-response.json

echo "✅ Nova Reel response saved to /tmp/nova-reel-response.json"

echo -e "\n💬 Testing Nova Pro (Text Generation):"
aws bedrock-runtime invoke-model \
    --region $REGION \
    --model-id amazon.nova-pro-v1:0 \
    --content-type application/json \
    --accept application/json \
    --body '{
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "text": "Write a creative brief for a mobile game ad"
                    }
                ]
            }
        ],
        "inferenceConfig": {
            "max_new_tokens": 512,
            "temperature": 0.7
        }
    }' \
    /tmp/nova-pro-response.json

echo "✅ Nova Pro response saved to /tmp/nova-pro-response.json"

echo -e "\n📊 Response files summary:"
ls -la /tmp/nova-*.json