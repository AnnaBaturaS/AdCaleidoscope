import { S3Client, PutObjectCommand, GetObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { SQSClient, SendMessageCommand, CreateQueueCommand, GetQueueUrlCommand } from '@aws-sdk/client-sqs';
import { EventBridgeClient, PutEventsCommand, CreateEventBusCommand } from '@aws-sdk/client-eventbridge';
import { SFNClient, StartExecutionCommand, CreateStateMachineCommand } from '@aws-sdk/client-sfn';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// AWS Configuration
const AWS_CONFIG = {
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  useLocal: process.env.USE_LOCAL_AWS === 'true',
  localstackUrl: process.env.LOCALSTACK_URL || 'http://localhost:4566',
  buckets: {
    raw: process.env.S3_BUCKET_RAW || 'adcaleidoscope-raw',
    generated: process.env.S3_BUCKET_GENERATED || 'adcaleidoscope-generated',
    datalake: process.env.S3_BUCKET_DATALAKE || 'adcaleidoscope-datalake',
  },
  tables: {
    creatives: process.env.DYNAMODB_CREATIVES_TABLE || 'Creatives',
    experiments: process.env.DYNAMODB_EXPERIMENTS_TABLE || 'Experiments',
    briefs: process.env.DYNAMODB_BRIEFS_TABLE || 'Briefs',
  },
  queues: {
    generationJobs: process.env.SQS_GENERATION_JOBS_QUEUE || 'generation-jobs',
  },
  eventBridge: {
    busName: process.env.EVENTBRIDGE_BUS_NAME || 'adcaleidoscope-bus',
  },
  stepFunctions: {
    generationArn: process.env.STEPFUNCTIONS_GENERATION_ARN || 'arn:aws:states:us-east-1:000000000000:stateMachine:GenerationWorkflow',
  },
  bedrock: {
    models: {
      text: process.env.BEDROCK_MODEL_TEXT || 'amazon.nova-pro-v1:0',
      image: process.env.BEDROCK_MODEL_IMAGE || 'amazon.nova-canvas-v1:0',
      video: process.env.BEDROCK_MODEL_VIDEO || 'amazon.nova-reel-v1:0',
    },
  },
};

// Base credentials
const baseCredentials = AWS_CONFIG.accessKeyId && AWS_CONFIG.secretAccessKey ? {
  accessKeyId: AWS_CONFIG.accessKeyId,
  secretAccessKey: AWS_CONFIG.secretAccessKey,
} : undefined;

// Local AWS clients configuration
const localConfig = {
  region: AWS_CONFIG.region,
  credentials: baseCredentials,
  endpoint: AWS_CONFIG.localstackUrl,
  forcePathStyle: true, // Required for LocalStack S3
};

// Cloud AWS clients configuration
const cloudConfig = {
  region: AWS_CONFIG.region,
  credentials: baseCredentials,
};

// Initialize AWS Clients with environment-based switching
const clientConfig = AWS_CONFIG.useLocal ? localConfig : cloudConfig;

// S3 Client
export const s3Client = new S3Client(clientConfig);

// DynamoDB Client
const dynamoClient = new DynamoDBClient(clientConfig);
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

// SQS Client
export const sqsClient = new SQSClient(clientConfig);

// EventBridge Client
export const eventBridgeClient = new EventBridgeClient(clientConfig);

// Step Functions Client
export const stepFunctionsClient = new SFNClient(clientConfig);

// Bedrock Client (ALWAYS uses real AWS)
export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || AWS_CONFIG.region,
  credentials: baseCredentials,
});

// Storage Interface for local/S3 switching
export interface Storage {
  uploadFile(file: Buffer, key: string, contentType: string): Promise<string>;
  getFileUrl(key: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
}

// Local Storage Implementation
export class LocalStorage implements Storage {
  private basePath = process.env.PUBLIC_ASSETS_PATH || '/public';

  async uploadFile(file: Buffer, key: string, contentType: string): Promise<string> {
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    
    const filePath = path.join(process.cwd(), this.basePath, key);
    const dir = path.dirname(filePath);
    
    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, file);
    
    // Return public URL
    return `${key}`;
  }

  async getFileUrl(key: string): Promise<string> {
    return `${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    
    const filePath = path.join(process.cwd(), this.basePath, key);
    await fs.unlink(filePath);
  }
}

// S3 Storage Implementation
export class S3Storage implements Storage {
  constructor(private bucket: string) {}

  async uploadFile(file: Buffer, key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await s3Client.send(command);
    
    if (AWS_CONFIG.useLocal) {
      return `${AWS_CONFIG.localstackUrl}/${this.bucket}/${key}`;
    }
    
    return `https://${this.bucket}.s3.${AWS_CONFIG.region}.amazonaws.com/${key}`;
  }

  async getFileUrl(key: string): Promise<string> {
    if (AWS_CONFIG.useLocal) {
      return `${AWS_CONFIG.localstackUrl}/${this.bucket}/${key}`;
    }
    
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  async deleteFile(key: string): Promise<void> {
    // Implementation would go here
  }
}

// Storage Factory
export function createStorage(type: 'local' | 's3' = 'local', bucket?: string): Storage {
  if (type === 's3' && bucket) {
    return new S3Storage(bucket);
  }
  return new LocalStorage();
}

// AWS Service Utilities
export const AWSServices = {
  // S3 Operations
  s3: {
    async createBucket(bucketName: string) {
      try {
        await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      } catch (error: any) {
        if (error.name !== 'BucketAlreadyExists' && error.name !== 'BucketAlreadyOwnedByYou') {
          throw error;
        }
      }
    },

    async uploadObject(bucket: string, key: string, body: Buffer | Uint8Array, contentType: string) {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      });
      return await s3Client.send(command);
    },
  },

  // DynamoDB Operations
  dynamodb: {
    async putItem(tableName: string, item: Record<string, any>) {
      const command = new PutCommand({
        TableName: tableName,
        Item: item,
      });
      return await dynamoDocClient.send(command);
    },

    async getItem(tableName: string, key: Record<string, any>) {
      const command = new GetCommand({
        TableName: tableName,
        Key: key,
      });
      return await dynamoDocClient.send(command);
    },

    async scanTable(tableName: string, filter?: any) {
      const command = new ScanCommand({
        TableName: tableName,
        FilterExpression: filter?.expression,
        ExpressionAttributeValues: filter?.values,
      });
      return await dynamoDocClient.send(command);
    },

    async updateItem(tableName: string, key: Record<string, any>, updates: Record<string, any>) {
      const updateExpression = Object.keys(updates).map(k => `#${k} = :${k}`).join(', ');
      const expressionAttributeNames = Object.keys(updates).reduce((acc, k) => ({ ...acc, [`#${k}`]: k }), {});
      const expressionAttributeValues = Object.keys(updates).reduce((acc, k) => ({ ...acc, [`:${k}`]: updates[k] }), {});

      const command = new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      });
      return await dynamoDocClient.send(command);
    },
  },

  // SQS Operations
  sqs: {
    async sendMessage(queueUrl: string, message: any) {
      const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message),
      });
      return await sqsClient.send(command);
    },

    async createQueue(queueName: string) {
      try {
        const command = new CreateQueueCommand({
          QueueName: queueName,
        });
        const result = await sqsClient.send(command);
        return result.QueueUrl;
      } catch (error: any) {
        if (error.name !== 'QueueAlreadyExists') {
          throw error;
        }
        // Get existing queue URL
        const getUrlCommand = new GetQueueUrlCommand({ QueueName: queueName });
        const result = await sqsClient.send(getUrlCommand);
        return result.QueueUrl;
      }
    },
  },

  // EventBridge Operations
  eventBridge: {
    async putEvent(source: string, detailType: string, detail: any, eventBusName?: string) {
      const command = new PutEventsCommand({
        Entries: [{
          Source: source,
          DetailType: detailType,
          Detail: JSON.stringify(detail),
          EventBusName: eventBusName || 'default',
        }],
      });
      return await eventBridgeClient.send(command);
    },

    async createEventBus(busName: string) {
      try {
        await eventBridgeClient.send(new CreateEventBusCommand({ Name: busName }));
      } catch (error: any) {
        if (error.name !== 'ResourceAlreadyExistsException') {
          throw error;
        }
      }
    },
  },

  // Step Functions Operations
  stepFunctions: {
    async startExecution(stateMachineArn: string, input: any, name?: string) {
      const command = new StartExecutionCommand({
        stateMachineArn,
        input: JSON.stringify(input),
        name: name || `execution-${Date.now()}`,
      });
      return await stepFunctionsClient.send(command);
    },
  },

  // Bedrock Operations
  bedrock: {
    async invokeModel(modelId: string, prompt: string, parameters: any = {}) {
      const payload = {
        messages: [{
          role: 'user',
          content: [{ type: 'text', text: prompt }],
        }],
        max_tokens: parameters.maxTokens || 1000,
        temperature: parameters.temperature || 0.7,
        ...parameters,
      };

      const command = new InvokeModelCommand({
        modelId,
        body: JSON.stringify(payload),
        contentType: 'application/json',
      });

      const response = await bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      return responseBody;
    },

    async generateImage(prompt: string, parameters: any = {}) {
      const payload = {
        taskType: 'TEXT_IMAGE',
        textToImageParams: {
          text: prompt,
          negativeText: parameters.negativePrompt,
        },
        imageGenerationConfig: {
          numberOfImages: parameters.numberOfImages || 1,
          quality: parameters.quality || 'standard',
          cfgScale: parameters.cfgScale || 8.0,
          height: parameters.height || 1024,
          width: parameters.width || 1024,
          seed: parameters.seed,
        },
      };

      const command = new InvokeModelCommand({
        modelId: AWS_CONFIG.bedrock.models.image,
        body: JSON.stringify(payload),
        contentType: 'application/json',
      });

      const response = await bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      return responseBody;
    },

    async generateVideo(prompt: string, parameters: any = {}) {
      const payload = {
        taskType: 'TEXT_VIDEO',
        textToVideoParams: {
          text: prompt,
        },
        videoGenerationConfig: {
          durationSeconds: parameters.duration || 6,
          fps: parameters.fps || 24,
          dimension: parameters.dimension || '1280x720',
          seed: parameters.seed,
        },
      };

      const command = new InvokeModelCommand({
        modelId: AWS_CONFIG.bedrock.models.video,
        body: JSON.stringify(payload),
        contentType: 'application/json',
      });

      const response = await bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      return responseBody;
    },
  },
};

// Configuration export
export { AWS_CONFIG };