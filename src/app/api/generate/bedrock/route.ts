import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand, StartAsyncInvokeCommand, GetAsyncInvokeCommand } from '@aws-sdk/client-bedrock-runtime';

const getBedrockClient = () => {
  const region = process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-east-1';
  
  const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    sessionToken: process.env.AWS_SESSION_TOKEN
  };
  
  console.log('🔑 AWS Credentials Check:');
  console.log('Region:', region);
  console.log('AccessKeyId:', credentials.accessKeyId ? `${credentials.accessKeyId.substring(0, 8)}...` : 'MISSING');
  console.log('SecretAccessKey:', credentials.secretAccessKey ? `${credentials.secretAccessKey.substring(0, 8)}...` : 'MISSING');
  console.log('SessionToken:', credentials.sessionToken ? `${credentials.sessionToken.substring(0, 20)}...` : 'MISSING');
  
  return new BedrockRuntimeClient({ 
    region,
    credentials
  });
};

export async function POST(request: NextRequest) {
  try {
    const { prompt, type = 'text', model, settings = {} } = await request.json();
    
    console.log('📥 Request received:', { prompt: prompt?.substring(0, 50) + '...', type, model, settings });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const client = getBedrockClient();
    
    let modelId = model;
    if (!modelId) {
      switch(type) {
        case 'image':
          modelId = process.env.BEDROCK_MODEL_IMAGE || 'amazon.nova-canvas-v1:0';
          break;
        case 'video':
          modelId = process.env.BEDROCK_MODEL_VIDEO || 'amazon.nova-reel-v1:1';
          break;
        default:
          modelId = process.env.BEDROCK_MODEL_TEXT || 'amazon.nova-pro-v1:0';
      }
    }


    let requestBody;
    
    if (type === 'image') {
      if (modelId.includes('stability')) {
        requestBody = {
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          clip_guidance_preset: "FAST_BLUE",
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
          seed: Math.floor(Math.random() * 1000000)
        };
      } else {
        // Nova Canvas parameters
        const imageConfig = {
          quality: settings.quality || 'standard',
          width: settings.width || 1024,
          height: settings.height || 1024,
          ...(settings.seed ? { seed: settings.seed } : { seed: Math.floor(Math.random() * 858993459) })
        };
        
        // Nova Canvas uses taskType format, not messages
        if (settings.referenceImage) {
          // Remove data:image/xxx;base64, prefix if present
          const base64Image = settings.referenceImage.replace(/^data:image\/[a-z]+;base64,/, '');
          
          if (settings.includeLogo) {
            // Use OUTPAINTING for logo inclusion
            requestBody = {
              taskType: "OUTPAINTING",
              outPaintingParams: {
                text: prompt,
                image: base64Image,
                outPaintingMode: "PRECISE"
              },
              imageGenerationConfig: imageConfig
            };
          } else {
            // Use IMAGE_VARIATION for style reference
            requestBody = {
              taskType: "IMAGE_VARIATION",
              imageVariationParams: {
                text: prompt,
                images: [base64Image],
                similarityStrength: 0.7
              },
              imageGenerationConfig: imageConfig
            };
          }
        } else {
          requestBody = {
            taskType: "TEXT_IMAGE",
            textToImageParams: {
              text: prompt
            },
            imageGenerationConfig: imageConfig
          };
        }
      }
    } else if (type === 'video') {
      // Nova Reel parameters
      const videoConfig = {
        durationSeconds: settings.durationSeconds || 6,
        fps: 24, // Fixed for Nova Reel
        dimension: "1280x720", // Fixed for Nova Reel
        ...(settings.seed ? { seed: settings.seed } : { seed: Math.floor(Math.random() * 2147483646) })
      };
      
      // Choose task type based on mode
      if (settings.mode === 'multi' && settings.durationSeconds > 6) {
        requestBody = {
          taskType: "MULTI_SHOT_AUTOMATED",
          multiShotAutomatedParams: {
            text: prompt
          },
          videoGenerationConfig: videoConfig
        };
      } else {
        requestBody = {
          taskType: "TEXT_VIDEO",
          textToVideoParams: {
            text: prompt
          },
          videoGenerationConfig: videoConfig
        };
      }
    } else {
      // Nova Pro parameters
      if (modelId.includes('anthropic')) {
        requestBody = {
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: settings.maxTokens || 2048,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: settings.temperature || 0.7,
          top_p: settings.topP || 0.9
        };
      } else {
        requestBody = {
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: prompt
                }
              ]
            }
          ],
          inferenceConfig: {
            max_new_tokens: settings.maxTokens || 2048,
            temperature: settings.temperature || 0.7,
            top_p: settings.topP || 0.9
          }
        };
      }
    }

    let response, responseBody;

    if (type === 'video') {
      console.log('🎬 Video request to Bedrock:', { modelId, requestBody });
      
      const asyncCommand = new StartAsyncInvokeCommand({
        modelId,
        modelInput: requestBody,
        outputDataConfig: {
          s3OutputDataConfig: {
            s3Uri: `s3://adalchemy-generated/`
            //s3OutputFormat: 'JSONL'
          }
        }
      });

      console.log('📤 Sending async command to Bedrock...');
      const asyncResponse = await client.send(asyncCommand);
      
      console.log('📨 Bedrock async response:', asyncResponse);
      
      return NextResponse.json({
        success: true,
        type: 'video',
        status: 'processing',
        jobId: asyncResponse.invocationArn,
        message: 'Video generation started. Check status with jobId.',
        timestamp: new Date().toISOString()
      });
    } else {
      const command = new InvokeModelCommand({
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(requestBody)
      });

      response = await client.send(command);
      responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
    }

    let result;
    if (type === 'image') {
      let imageData;
      
      if (modelId.includes('stability') && responseBody.artifacts) {
        imageData = responseBody.artifacts[0].base64;
      } else if (responseBody.images) {
        imageData = responseBody.images[0];
      }
      
      if (imageData) {
        const timestamp = Date.now();
        const filename = `generated_image_${timestamp}.png`;
        
        result = {
          type: 'image',
          content: imageData,
          filename,
          metadata: {
            model: modelId,
            width: settings.width || 1024,
            height: settings.height || 1024,
            quality: settings.quality || 'standard',
            seed: settings.seed,
            prompt: prompt.substring(0, 100) + '...'
          }
        };
      } else {
        throw new Error('No image data in response');
      }
    } else if (type === 'video') {
      let videoData;
      
      if (responseBody.video) {
        videoData = responseBody.video;
      } else if (responseBody.videos && responseBody.videos.length > 0) {
        videoData = responseBody.videos[0];
      } else if (responseBody.result && responseBody.result.video) {
        videoData = responseBody.result.video;
      } else {
        throw new Error('Video generation failed - no video data in response');
      }
      
      const timestamp = Date.now();
      const filename = `generated_video_${timestamp}.mp4`;
      
      result = {
        type: 'video',
        content: videoData,
        filename,
        metadata: {
          model: modelId,
          mode: settings.mode || 'single',
          duration: settings.durationSeconds || 6,
          fps: 24,
          dimension: '1280x720',
          seed: settings.seed,
          prompt: prompt.substring(0, 100) + '...'
        }
      };
    } else if (responseBody.output?.message?.content) {
      const content = responseBody.output.message.content;
      const textContent = Array.isArray(content) ? content[0]?.text : content.text;
      
      result = {
        type: 'text',
        content: textContent,
        metadata: {
          model: modelId,
          usage: responseBody.usage,
          prompt: prompt.substring(0, 100) + '...'
        }
      };
    } else if (responseBody.content) {
      let textContent;
      
      if (modelId.includes('anthropic') && Array.isArray(responseBody.content)) {
        textContent = responseBody.content[0]?.text || responseBody.content;
      } else if (responseBody.content.length > 0) {
        textContent = responseBody.content[0].text;
      } else {
        textContent = responseBody.content;
      }
      
      result = {
        type: 'text',
        content: textContent,
        metadata: {
          model: modelId,
          usage: responseBody.usage,
          prompt: prompt.substring(0, 100) + '...'
        }
      };
    } else {
      result = {
        type: 'text',
        content: JSON.stringify(responseBody, null, 2),
        metadata: {
          model: modelId,
          prompt: prompt.substring(0, 100) + '...'
        }
      };
    }

    
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    
    if (error instanceof Error) {
      if (error.message.includes('credentials')) {
        return NextResponse.json(
          { 
            error: 'AWS credentials not configured',
            suggestion: 'Please run: npm run aws:setup',
            details: error.message 
          },
          { status: 401 }
        );
      }
      
      if (error.message.includes('AccessDenied') || error.message.includes('UnauthorizedOperation')) {
        return NextResponse.json(
          { 
            error: 'Access denied to Bedrock',
            suggestion: 'Check your AWS permissions for Bedrock service',
            details: error.message 
          },
          { status: 403 }
        );
      }
      
      if (error.message.includes('ModelNotFound')) {
        return NextResponse.json(
          { 
            error: 'Model not found',
            suggestion: 'Try a different model or region',
            details: error.message 
          },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}