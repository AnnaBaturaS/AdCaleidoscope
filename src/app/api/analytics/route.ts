import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/analytics/simple';

// GET endpoint for analytics data
export async function GET(request: NextRequest) {
  try {
    const analytics = getAnalytics();
    await analytics.initialize();

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const startDate = url.searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = url.searchParams.get('end') || new Date().toISOString().split('T')[0];
    const creativeId = url.searchParams.get('creativeId');
    const experimentId = url.searchParams.get('experimentId');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let result;

    switch (type) {
      case 'kpis':
        result = await analytics.getKPIs({ start: startDate, end: endDate });
        break;

      case 'top-creatives':
        result = await analytics.getTopPerformingCreatives(limit, { start: startDate, end: endDate });
        break;

      case 'performance-trends':
        if (!creativeId) {
          return NextResponse.json({
            success: false,
            error: 'creativeId parameter required for performance trends'
          }, { status: 400 });
        }
        result = await analytics.getPerformanceTrends(creativeId, 30);
        break;

      case 'experiment-results':
        if (!experimentId) {
          return NextResponse.json({
            success: false,
            error: 'experimentId parameter required for experiment results'
          }, { status: 400 });
        }
        result = await analytics.getExperimentResults(experimentId);
        break;

      case 'audience-insights':
        result = await analytics.getAudienceInsights({ start: startDate, end: endDate });
        break;

      case 'overview':
        // Get comprehensive dashboard data
        const [kpis, topCreatives, audienceInsights] = await Promise.all([
          analytics.getKPIs({ start: startDate, end: endDate }),
          analytics.getTopPerformingCreatives(5, { start: startDate, end: endDate }),
          analytics.getAudienceInsights({ start: startDate, end: endDate }),
        ]);

        result = {
          kpis,
          topCreatives,
          audienceInsights,
          dateRange: { start: startDate, end: endDate },
        };
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter. Supported types: kpis, top-creatives, performance-trends, experiment-results, audience-insights, overview'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        type,
        dateRange: { start: startDate, end: endDate },
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST endpoint for ingesting events and performance data
export async function POST(request: NextRequest) {
  try {
    const analytics = getAnalytics();
    await analytics.initialize();

    const data = await request.json();
    const { type, ...payload } = data;

    switch (type) {
      case 'event':
        const { event_id, event_type, creative_id, user_id, session_id, properties, device_info, geo_info } = payload;
        
        if (!event_id || !event_type) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields: event_id, event_type'
          }, { status: 400 });
        }

        await analytics.insertEvent({
          event_id,
          event_type,
          creative_id,
          user_id,
          session_id,
          timestamp: new Date().toISOString(),
          properties,
          device_info,
          geo_info,
        });
        break;

      case 'performance':
        const { creative_id: perf_creative_id, date: perf_date, metrics: perf_metrics } = payload;
        
        if (!perf_creative_id || !perf_date || !perf_metrics) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields: creative_id, date, metrics'
          }, { status: 400 });
        }

        await analytics.updatePerformanceData(perf_creative_id, perf_date, perf_metrics);
        break;

      case 'experiment':
        const { experiment_id, variant_id, creative_id: exp_creative_id, date: exp_date, metrics: exp_metrics } = payload;
        
        if (!experiment_id || !variant_id || !exp_creative_id || !exp_date || !exp_metrics) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields: experiment_id, variant_id, creative_id, date, metrics'
          }, { status: 400 });
        }

        await analytics.insertExperimentResult(experiment_id, variant_id, exp_creative_id, exp_date, exp_metrics);
        break;

      case 'generate-mock-data':
        // Data is already generated in initialize
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter. Supported types: event, performance, experiment, generate-mock-data'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `${type} data processed successfully`,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Analytics ingestion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process analytics data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT endpoint for bulk data import
export async function PUT(request: NextRequest) {
  try {
    const analytics = getAnalytics();
    await analytics.initialize();

    const { filePath, tableName, fileType = 'parquet' } = await request.json();

    if (!filePath || !tableName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: filePath, tableName'
      }, { status: 400 });
    }

    await analytics.importFromFile(tableName, filePath, fileType as 'parquet' | 'csv' | 'json');

    return NextResponse.json({
      success: true,
      message: `Data imported successfully from ${filePath} to ${tableName}`,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Analytics import error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to import analytics data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}