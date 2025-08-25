import { NextRequest, NextResponse } from 'next/server';
import { AWSServices, AWS_CONFIG, createStorage } from '@/lib/aws';

interface GenerationRequest {
  type: 'image' | 'video' | 'playable';
  prompt: string;
  parameters?: {
    width?: number;
    height?: number;
    duration?: number;
    quality?: 'standard' | 'premium';
    style?: string;
    negativePrompt?: string;
    seed?: number;
    cfgScale?: number;
    numberOfImages?: number;
    fps?: number;
  };
  briefId?: string;
  metadata?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const generationData: GenerationRequest = await request.json();

    if (!generationData.type || !generationData.prompt) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: type, prompt'
      }, { status: 400 });
    }

    const jobId = `job_${generationData.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`Starting generation job ${jobId} for type: ${generationData.type}`);

    try {
      const workflowInput = {
        jobId,
        type: generationData.type,
        prompt: generationData.prompt,
        parameters: generationData.parameters || {},
        briefId: generationData.briefId,
        metadata: generationData.metadata,
        timestamp: new Date().toISOString(),
      };

      const execution = await AWSServices.stepFunctions.startExecution(
        AWS_CONFIG.stepFunctions.generationArn,
        workflowInput,
        `execution-${jobId}`
      );

      console.log(`Started Step Functions execution: ${execution.executionArn}`);

      const creativeRecord = {
        creativeId: jobId,
        version: 1,
        type: generationData.type,
        prompt: generationData.prompt,
        parameters: generationData.parameters,
        briefId: generationData.briefId,
        status: 'processing',
        executionArn: execution.executionArn,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: generationData.metadata || {},
      };

      await AWSServices.dynamodb.putItem(AWS_CONFIG.tables.creatives, creativeRecord);

      // Send message to SQS queue for tracking
      const queueUrl = `${AWS_CONFIG.localstackUrl}/000000000000/${AWS_CONFIG.queues.generationJobs}`;
      await AWSServices.sqs.sendMessage(queueUrl, {
        jobId,
        type: generationData.type,
        status: 'started',
        executionArn: execution.executionArn,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        jobId,
        executionArn: execution.executionArn,
        status: 'processing',
        estimatedTime: getEstimatedTime(generationData.type),
        message: `Generation job ${jobId} started successfully`
      });

    } catch (workflowError) {
      console.error('Step Functions workflow error:', workflowError);
      
      console.log('Falling back to direct generation...');
      
      let result;
      if (generationData.type === 'image') {
        result = await generateImageDirect(jobId, generationData.prompt, generationData.parameters || {});
      } else if (generationData.type === 'video') {
        result = await generateVideoDirect(jobId, generationData.prompt, generationData.parameters || {});
      } else {
        throw new Error(`Unsupported generation type: ${generationData.type}`);
      }

      return NextResponse.json(result);
    }

  } catch (error) {
    console.error('Generation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to start generation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function generateImageDirect(jobId: string, prompt: string, parameters: any) {
  try {
    console.log(`Direct image generation for job ${jobId}`);
    
    const bedrockResponse = await AWSServices.bedrock.generateImage(prompt, {
      width: parameters.width || 1024,
      height: parameters.height || 1024,
      quality: parameters.quality || 'standard',
      cfgScale: parameters.cfgScale || 8.0,
      seed: parameters.seed,
      numberOfImages: parameters.numberOfImages || 1,
      negativePrompt: parameters.negativePrompt,
    });

    console.log('Bedrock image response:', JSON.stringify(bedrockResponse, null, 2));

    const assets = [];
    if (bedrockResponse.images) {
      for (let i = 0; i < bedrockResponse.images.length; i++) {
        const imageData = bedrockResponse.images[i];
        const assetId = `${jobId}_image_${i + 1}`;
        
        const imageBuffer = Buffer.from(imageData, 'base64');
        
        const storage = createStorage(process.env.STORAGE_TYPE as 'local' | 's3', AWS_CONFIG.buckets.generated);
        const imageKey = `images/${jobId}/${assetId}.png`;
        const imageUrl = await storage.uploadFile(imageBuffer, imageKey, 'image/png');
        
        assets.push({
          id: assetId,
          type: 'image',
          url: imageUrl,
          metadata: {
            width: parameters.width || 1024,
            height: parameters.height || 1024,
            format: 'png',
            fileSize: imageBuffer.length,
            prompt,
          }
        });
      }
    }

    await AWSServices.dynamodb.updateItem(
      AWS_CONFIG.tables.creatives,
      { creativeId: jobId, version: 1 },
      {
        status: 'completed',
        assets,
        updatedAt: new Date().toISOString(),
      }
    );

    await AWSServices.eventBridge.putEvent(
      'creativeos.generation',
      'Generation Completed',
      {
        jobId,
        type: 'image',
        status: 'completed',
        assets,
      },
      AWS_CONFIG.eventBridge.busName
    );

    return {
      success: true,
      jobId,
      status: 'completed',
      assets,
    };

  } catch (error) {
    console.error('Direct image generation error:', error);
    throw error;
  }
}

async function generateVideoDirect(jobId: string, prompt: string, parameters: any) {
  try {
    console.log(`Direct video generation for job ${jobId}`);
    
    const bedrockResponse = await AWSServices.bedrock.generateVideo(prompt, {
      duration: parameters.duration || 6,
      fps: parameters.fps || 24,
      dimension: `${parameters.width || 1280}x${parameters.height || 720}`,
      seed: parameters.seed,
    });

    console.log('Bedrock video response:', JSON.stringify(bedrockResponse, null, 2));

    const assets = [];
    if (bedrockResponse.video) {
      const assetId = `${jobId}_video_1`;
      
      const videoBuffer = Buffer.from(bedrockResponse.video, 'base64');
      
      const storage = createStorage(process.env.STORAGE_TYPE as 'local' | 's3', AWS_CONFIG.buckets.generated);
      const videoKey = `videos/${jobId}/${assetId}.mp4`;
      const videoUrl = await storage.uploadFile(videoBuffer, videoKey, 'video/mp4');
      
      assets.push({
        id: assetId,
        type: 'video',
        url: videoUrl,
        metadata: {
          width: parameters.width || 1280,
          height: parameters.height || 720,
          duration: parameters.duration || 6,
          format: 'mp4',
          fileSize: videoBuffer.length,
          prompt,
        }
      });
    }

    // Update creative record
    await AWSServices.dynamodb.updateItem(
      AWS_CONFIG.tables.creatives,
      { creativeId: jobId, version: 1 },
      {
        status: 'completed',
        assets,
        updatedAt: new Date().toISOString(),
      }
    );

    // Publish completion event
    await AWSServices.eventBridge.putEvent(
      'creativeos.generation',
      'Generation Completed',
      {
        jobId,
        type: 'video',
        status: 'completed',
        assets,
      },
      AWS_CONFIG.eventBridge.busName
    );

    return {
      success: true,
      jobId,
      status: 'completed',
      assets,
    };

  } catch (error) {
    console.error('Direct video generation error:', error);
    throw error;
  }
}

// GET endpoint to check job status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const jobId = url.searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({
        success: false,
        error: 'Missing jobId parameter'
      }, { status: 400 });
    }

    // Get job status from DynamoDB
    const result = await AWSServices.dynamodb.getItem(
      AWS_CONFIG.tables.creatives,
      { creativeId: jobId, version: 1 }
    );

    if (!result.Item) {
      return NextResponse.json({
        success: false,
        error: 'Job not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      job: result.Item
    });

  } catch (error) {
    console.error('Job status retrieval error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve job status'
    }, { status: 500 });
  }
}

function getEstimatedTime(type: string): number {
  switch (type) {
    case 'image':
      return 30; // 30 seconds
    case 'video':
      return 120; // 2 minutes
    case 'playable':
      return 300; // 5 minutes
    default:
      return 60; // 1 minute
  }
}