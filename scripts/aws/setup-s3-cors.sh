#!/bin/bash

# S3 CORS Configuration Script
BUCKET_NAME="adalchemy-generated"
REGION="us-east-1"

# CORS configuration
CORS_CONFIG='{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["Content-Length", "Content-Type", "ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}'

echo "🔧 Setting CORS configuration for bucket: $BUCKET_NAME"

# Apply CORS configuration
aws s3api put-bucket-cors \
  --bucket $BUCKET_NAME \
  --cors-configuration "$CORS_CONFIG" \
  --region $REGION

if [ $? -eq 0 ]; then
  echo "✅ CORS configuration applied successfully!"
  
  # Verify CORS configuration
  echo "📋 Current CORS configuration:"
  aws s3api get-bucket-cors --bucket $BUCKET_NAME --region $REGION
else
  echo "❌ Failed to apply CORS configuration"
  exit 1
fi

echo ""
echo "🎥 Testing video accessibility..."
echo "You can now test video playback in your browser!"