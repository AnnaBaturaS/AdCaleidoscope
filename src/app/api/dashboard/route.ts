import { NextResponse } from 'next/server';

const mockDashboardData = {
  kpis: {
    cpi: {
      current: 2.34,
      previous: 2.67,
      change: -12.4,
      target: 2.50,
      trend: 'improving'
    },
    ipm: {
      current: 45.2,
      previous: 41.7,
      change: 8.4,
      target: 42.0,
      trend: 'improving'
    },
    ctr: {
      current: 3.8,
      previous: 3.9,
      change: -2.6,
      target: 4.0,
      trend: 'declining'
    },
    spend: {
      current: 12547,
      previous: 10234,
      change: 22.6,
      budget: 15000,
      trend: 'increasing'
    }
  },
  
  topCreatives: [
    {
      id: '1',
      name: 'Adventure Quest - Hero Intro',
      format: 'video',
      metrics: {
        cpi: 1.89,
        ipm: 67.3,
        ctr: 4.2,
        spend: 1250
      },
      status: 'active',
      trend: 'up',
      changePercent: 15.3
    },
    {
      id: '2',
      name: 'Mystery Castle - Puzzle Game',
      format: 'playable',
      metrics: {
        cpi: 2.12,
        ipm: 52.8,
        ctr: 3.9,
        spend: 890
      },
      status: 'testing',
      trend: 'up',
      changePercent: 8.7
    },
    {
      id: '3',
      name: 'Dragon Wars - Epic Battle',
      format: 'video',
      metrics: {
        cpi: 2.34,
        ipm: 48.6,
        ctr: 3.6,
        spend: 1100
      },
      status: 'active',
      trend: 'stable',
      changePercent: -1.2
    },
    {
      id: '4',
      name: 'Magic Spells - RPG Banner',
      format: 'banner',
      metrics: {
        cpi: 3.45,
        ipm: 34.1,
        ctr: 2.1,
        spend: 450
      },
      status: 'paused',
      trend: 'down',
      changePercent: -18.5
    }
  ],

  alerts: [
    {
      id: '1',
      type: 'kill',
      severity: 'high',
      title: 'High CPI Alert',
      message: 'Creative "Magic Castle RPG" exceeded CPI threshold ($5.00)',
      creativeId: 'creative-123',
      creativeName: 'Magic Castle RPG - Video 30s',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      actionTaken: 'Campaign paused automatically',
      isRead: false
    },
    {
      id: '2',
      type: 'scale',
      severity: 'medium',
      title: 'Scale Opportunity',
      message: 'Creative "Adventure Quest" showing strong performance - consider scaling',
      creativeId: 'creative-456',
      creativeName: 'Adventure Quest - Playable',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      actionTaken: null,
      isRead: false
    },
    {
      id: '3',
      type: 'budget',
      severity: 'low',
      title: 'Budget Alert',
      message: 'Daily budget 85% spent for "Mystery Games" campaign',
      creativeId: null,
      creativeName: null,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      actionTaken: null,
      isRead: true
    },
    {
      id: '4',
      type: 'performance',
      severity: 'medium',
      title: 'Performance Drop',
      message: 'CTR declined 15% for video creatives in last 24h',
      creativeId: null,
      creativeName: null,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      actionTaken: 'Investigation started',
      isRead: false
    }
  ],

  topPatterns: [
    {
      id: 'closeup-face',
      name: 'Close-up Face Hook',
      impact: '+23% CTR',
      confidence: 94,
      category: 'visual',
      trendings: 'up',
      usage: 67
    },
    {
      id: 'countdown-timer',
      name: 'Countdown Timer',
      impact: '+18% IPM',
      confidence: 87,
      category: 'interaction',
      trendings: 'up',
      usage: 43
    },
    {
      id: 'bright-colors',
      name: 'Bright Color Palette',
      impact: '+12% Retention',
      confidence: 78,
      category: 'visual',
      trendings: 'stable',
      usage: 89
    },
    {
      id: 'gameplay-footage',
      name: 'Actual Gameplay',
      impact: '+25% D7 Retention',
      confidence: 91,
      category: 'visual',
      trendings: 'up',
      usage: 34
    }
  ],

  recentActivity: [
    {
      id: '1',
      type: 'creative_generated',
      message: 'New creative "Space Warriors" generated from brief',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      metadata: {
        creativeId: 'creative-789',
        briefId: 'brief-45'
      }
    },
    {
      id: '2',
      type: 'campaign_scaled',
      message: 'Campaign budget increased for "Adventure Quest"',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      metadata: {
        campaignId: 'campaign-123',
        oldBudget: 1000,
        newBudget: 1500
      }
    },
    {
      id: '3',
      type: 'creative_paused',
      message: 'Creative "Magic Spells" paused due to high CPI',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      metadata: {
        creativeId: 'creative-456',
        reason: 'cpi_threshold_exceeded',
        threshold: 5.0,
        actual: 5.23
      }
    }
  ],

  summary: {
    totalCreatives: 1247,
    activeCreatives: 89,
    totalSpend: 125470,
    totalInstalls: 45678,
    avgCPI: 2.34,
    avgCTR: 3.8,
    lastUpdated: new Date().toISOString()
  }
};

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json({
    success: true,
    data: mockDashboardData
  });
}