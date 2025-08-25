#!/bin/bash

# AWS CLI wrapper for AdAlchemy Creative OS
# Usage: ./aws-wrapper.sh [local|cloud] [aws command...]

if [ "$#" -lt 2 ]; then
    echo "Usage: $0 [local|cloud] [aws command...]"
    echo "Examples:"
    echo "  $0 local s3 ls"
    echo "  $0 cloud bedrock list-foundation-models"
    exit 1
fi

ENV=$1
shift
COMMAND="$@"

case $ENV in
    "local")
        echo "🏠 Using LocalStack..."
        aws --profile localstack --endpoint-url http://localhost:4566 $COMMAND
        ;;
    "cloud")
        echo "☁️ Using AWS Cloud..."
        aws $COMMAND
        ;;
    *)
        echo "❌ Invalid environment. Use 'local' or 'cloud'"
        exit 1
        ;;
esac