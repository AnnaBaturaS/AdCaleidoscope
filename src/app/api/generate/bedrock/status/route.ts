import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, GetAsyncInvokeCommand } from '@aws-sdk/client-bedrock-runtime';

// Initialize Bedrock client
const getBedrockClient = () => {
  const region = process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-east-1';
  
  return new BedrockRuntimeClient({ 
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      sessionToken: process.env.AWS_SESSION_TOKEN
    }
  });
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const client = getBedrockClient();
    

    const command = new GetAsyncInvokeCommand({
      invocationArn: jobId
    });

    const response = await client.send(command);
    

    // Process the response based on status
    if (response.status === 'Completed') {
      console.log('✅ Video generation completed, checking S3 output...');
      
      let videoData = null;
      let s3Uri = null;
      
      if (response.outputDataConfig?.s3OutputDataConfig?.s3Uri) {
        s3Uri = response.outputDataConfig.s3OutputDataConfig.s3Uri;
        console.log('📁 S3 output location:', s3Uri);
        
        try {
          const s3Client = new (await import('@aws-sdk/client-s3')).S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
              sessionToken: process.env.AWS_SESSION_TOKEN
            }
          });
          
          const bucketName = s3Uri.replace('s3://', '').split('/')[0];
          const prefix = s3Uri.replace(`s3://${bucketName}/`, '');
          
          // The actual video file is in output.mp4 in the specified folder
          const videoKey = prefix + '/output.mp4';
          
          console.log('📥 Downloading video from S3:', { bucketName, key: videoKey });
          
          // Download video from S3
          const getObjectResponse = await s3Client.send(
            new (await import('@aws-sdk/client-s3')).GetObjectCommand({
              Bucket: bucketName,
              Key: videoKey
            })
          );
          
          if (getObjectResponse.Body) {
            // Save to public folder
            const fs = await import('fs');
            const path = await import('path');
            
            const fileName = `video_${Date.now()}.mp4`;
            const publicPath = path.join(process.cwd(), 'public', 'videos');
            const filePath = path.join(publicPath, fileName);
            
            // Create directory if not exists
            if (!fs.existsSync(publicPath)) {
              fs.mkdirSync(publicPath, { recursive: true });
            }
            
            // Convert stream to buffer and save
            const chunks = [];
            const stream = getObjectResponse.Body as any;
            for await (const chunk of stream) {
              chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            
            fs.writeFileSync(filePath, buffer);
            console.log('💾 Video saved locally:', fileName);
            
            // Return local URL
            videoData = `/videos/${fileName}`;
          }
        } catch (s3Error) {
          console.error('❌ S3 download error:', s3Error);
        }
      }

      return NextResponse.json({
        success: true,
        status: 'completed',
        type: 'video',
        content: videoData,
        filename: `generated_video_${Date.now()}.mp4`,
        s3Uri,
        metadata: {
          model: 'amazon.nova-reel-v1:1',
          duration: 6,
          fps: 24,
          dimension: '1280x720'
        },
        submitTime: response.submitTime,
        endTime: response.endTime,
        timestamp: new Date().toISOString()
      });

    } else if (response.status === 'Failed') {
      // Job failed
      return NextResponse.json({
        success: false,
        status: 'failed',
        error: response.failureMessage || 'Video generation failed',
        submitTime: response.submitTime,
        endTime: response.endTime,
        timestamp: new Date().toISOString()
      });

    } else {
      // Job still in progress
      return NextResponse.json({
        success: true,
        status: 'processing',
        submitTime: response.submitTime,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Status check error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check job status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}