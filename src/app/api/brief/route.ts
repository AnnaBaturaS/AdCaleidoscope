import { NextRequest, NextResponse } from 'next/server';
import { AWSServices, AWS_CONFIG } from '@/lib/aws';

interface BriefRequest {
  productName: string;
  targetAudience: string;
  objectives: string[];
  constraints: {
    budget?: string;
    timeline?: string;
    brandGuidelines?: string;
  };
  additionalContext?: string;
}

export async function POST(request: NextRequest) {
  try {
    const briefData: BriefRequest = await request.json();

    // Validate required fields
    if (!briefData.productName || !briefData.targetAudience || !briefData.objectives?.length) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: productName, targetAudience, objectives'
      }, { status: 400 });
    }

    // Generate brief using Nova Pro
    const prompt = `
Generate a comprehensive creative brief for the following mobile app advertising campaign:

Product: ${briefData.productName}
Target Audience: ${briefData.targetAudience}
Objectives: ${briefData.objectives.join(', ')}

${briefData.constraints.budget ? `Budget: ${briefData.constraints.budget}` : ''}
${briefData.constraints.timeline ? `Timeline: ${briefData.constraints.timeline}` : ''}
${briefData.constraints.brandGuidelines ? `Brand Guidelines: ${briefData.constraints.brandGuidelines}` : ''}
${briefData.additionalContext ? `Additional Context: ${briefData.additionalContext}` : ''}

Please provide a detailed creative brief that includes:
1. Executive Summary
2. Campaign Goals and KPIs
3. Target Audience Analysis
4. Key Messages and Value Propositions
5. Creative Strategy and Concepts
6. Visual Style and Brand Guidelines
7. Ad Format Recommendations (banner, interstitial, playable, video)
8. Call-to-Action Suggestions
9. Success Metrics and Testing Plan
10. Risk Assessment and Mitigation

Format the response as a structured, professional creative brief document.
    `;

    console.log('Generating brief with Nova Pro...');
    
    // Call Nova Pro for brief generation
    const bedrockResponse = await AWSServices.bedrock.invokeModel(
      AWS_CONFIG.bedrock.models.text,
      prompt,
      {
        maxTokens: 4000,
        temperature: 0.7,
      }
    );

    // Extract generated content
    const generatedBrief = bedrockResponse.content?.[0]?.text || bedrockResponse.output?.text || 'Brief generation failed';

    // Create brief record
    const briefId = `brief_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const briefRecord = {
      briefId,
      productName: briefData.productName,
      targetAudience: briefData.targetAudience,
      objectives: briefData.objectives,
      constraints: briefData.constraints,
      additionalContext: briefData.additionalContext,
      generatedBrief,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to DynamoDB
    try {
      await AWSServices.dynamodb.putItem(AWS_CONFIG.tables.briefs, briefRecord);
      console.log(`Brief saved to DynamoDB: ${briefId}`);
    } catch (dbError) {
      console.error('Failed to save brief to DynamoDB:', dbError);
      // Continue - we still have the generated brief
    }

    // Send message to SQS for potential further processing
    try {
      const queueUrl = `${AWS_CONFIG.localstackUrl}/000000000000/${AWS_CONFIG.queues.generationJobs}`;
      await AWSServices.sqs.sendMessage(queueUrl, {
        type: 'brief_generated',
        briefId,
        productName: briefData.productName,
        timestamp: new Date().toISOString(),
      });
    } catch (sqsError) {
      console.error('Failed to send SQS message:', sqsError);
      // Continue - not critical for brief generation
    }

    // Return the generated brief
    return NextResponse.json({
      success: true,
      briefId,
      brief: {
        id: briefId,
        productName: briefData.productName,
        targetAudience: briefData.targetAudience,
        objectives: briefData.objectives,
        content: generatedBrief,
        status: 'completed',
        createdAt: briefRecord.createdAt,
      }
    });

  } catch (error) {
    console.error('Brief generation error:', error);
    
    // Check if it's a Bedrock-specific error
    if (error instanceof Error) {
      if (error.message.includes('bedrock') || error.message.includes('model')) {
        return NextResponse.json({
          success: false,
          error: 'AI model unavailable. Please check your Bedrock configuration.',
          details: error.message
        }, { status: 503 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to generate creative brief',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to retrieve briefs
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const briefId = url.searchParams.get('briefId');

    if (briefId) {
      // Get specific brief
      const result = await AWSServices.dynamodb.getItem(
        AWS_CONFIG.tables.briefs,
        { briefId }
      );

      if (!result.Item) {
        return NextResponse.json({
          success: false,
          error: 'Brief not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        brief: result.Item
      });
    } else {
      // Get all briefs
      const result = await AWSServices.dynamodb.scanTable(AWS_CONFIG.tables.briefs);

      return NextResponse.json({
        success: true,
        briefs: result.Items || []
      });
    }

  } catch (error) {
    console.error('Brief retrieval error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve briefs'
    }, { status: 500 });
  }
}