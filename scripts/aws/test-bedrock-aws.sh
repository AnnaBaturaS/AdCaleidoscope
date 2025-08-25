#!/bin/bash

echo "🤖 Testing AWS Bedrock Models"
echo "=============================="
echo ""

# Use aws profile
export AWS_PROFILE=aws

# Function to test a region
test_region() {
    local REGION=$1
    echo "📍 Testing region: $REGION"
    echo "--------------------------------"
    
    # List available models
    echo "📋 Available Bedrock models in $REGION:"
    aws bedrock list-foundation-models \
        --region $REGION \
        --query 'modelSummaries[?contains(modelId, `nova`) || contains(modelId, `claude`)].{ID:modelId,Name:modelName,Provider:providerName}' \
        --output table 2>/dev/null || echo "⚠️  Could not list models in $REGION"
    
    echo ""
}

# Test both regions
test_region "us-east-1"
test_region "us-west-2"

echo "🧪 Testing Nova Pro (Text Generation) in us-east-1..."
echo "------------------------------------------------------"

# Create a safe test prompt
cat > /tmp/bedrock-test-prompt.json << 'EOF'
{
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "text": "Create a creative brief for a mobile game ad. Include target audience, key message, and call to action. Keep it under 200 words."
                }
            ]
        }
    ],
    "inferenceConfig": {
        "max_new_tokens": 300,
        "temperature": 0.7,
        "top_p": 0.9
    }
}
EOF

# Test Nova Pro
echo "Sending request to Nova Pro..."
aws bedrock-runtime invoke-model \
    --region us-east-1 \
    --model-id amazon.nova-pro-v1:0 \
    --content-type application/json \
    --accept application/json \
    --body file:///tmp/bedrock-test-prompt.json \
    /tmp/nova-pro-response.json 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Nova Pro responded successfully!"
    echo ""
    echo "📝 Response preview:"
    cat /tmp/nova-pro-response.json | python3 -m json.tool | head -20
    echo "..."
    echo ""
    echo "Full response saved to: /tmp/nova-pro-response.json"
else
    echo "❌ Failed to invoke Nova Pro. Checking permissions..."
    aws bedrock-runtime invoke-model \
        --region us-west-2 \
        --model-id amazon.nova-pro-v1:0 \
        --content-type application/json \
        --accept application/json \
        --body file:///tmp/bedrock-test-prompt.json \
        /tmp/nova-pro-response.json
fi

echo ""
echo "🧪 Testing Claude 3 Haiku in us-east-1..."
echo "----------------------------------------"

# Create Claude test prompt
cat > /tmp/claude-test-prompt.json << 'EOF'
{
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 300,
    "messages": [
        {
            "role": "user",
            "content": "Write a brief tagline for a mobile RPG game. Make it exciting and under 10 words."
        }
    ],
    "temperature": 0.7
}
EOF

# Test Claude 3 Haiku
echo "Sending request to Claude 3 Haiku..."
aws bedrock-runtime invoke-model \
    --region us-east-1 \
    --model-id anthropic.claude-3-haiku-20240307-v1:0 \
    --content-type application/json \
    --accept application/json \
    --body file:///tmp/claude-test-prompt.json \
    /tmp/claude-response.json 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Claude 3 Haiku responded successfully!"
    echo ""
    echo "📝 Response:"
    cat /tmp/claude-response.json | python3 -m json.tool
else
    echo "⚠️  Claude 3 Haiku not available or no permissions"
fi

echo ""
echo "🎨 Testing Nova Canvas (Image Generation)..."
echo "--------------------------------------------"

# Create image generation prompt
cat > /tmp/nova-canvas-prompt.json << 'EOF'
{
    "taskType": "TEXT_IMAGE",
    "textToImageParams": {
        "text": "A colorful mobile game icon featuring a fantasy dragon, cartoon style, vibrant colors, app store ready"
    },
    "imageGenerationConfig": {
        "numberOfImages": 1,
        "width": 512,
        "height": 512,
        "cfgScale": 7.0,
        "seed": 42
    }
}
EOF

# Test Nova Canvas
echo "Testing Nova Canvas API..."
aws bedrock-runtime invoke-model \
    --region us-east-1 \
    --model-id amazon.nova-canvas-v1:0 \
    --content-type application/json \
    --accept application/json \
    --body file:///tmp/nova-canvas-prompt.json \
    /tmp/nova-canvas-response.json 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Nova Canvas API call successful!"
    echo "📊 Response structure (image data not shown):"
    cat /tmp/nova-canvas-response.json | python3 -c "import json, sys; d=json.load(sys.stdin); print(json.dumps({k:v if k!='images' else '[BASE64_IMAGE_DATA]' for k,v in d.items()}, indent=2))" 2>/dev/null || echo "Response saved to /tmp/nova-canvas-response.json"
else
    echo "⚠️  Nova Canvas not available or no permissions"
fi

echo ""
echo "=============================="
echo "✅ Bedrock testing complete!"
echo ""
echo "📁 Response files:"
ls -la /tmp/*.json 2>/dev/null | grep -E "(nova|claude|bedrock)" || echo "No response files found"
echo ""
echo "💡 Tips:"
echo "  - Use 'export AWS_PROFILE=aws' in your terminal"
echo "  - Responses are saved locally in /tmp/"
echo "  - Use these models in your application via AWS SDK"