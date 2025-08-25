// Simple in-memory analytics for demo (replaces DuckDB)
interface AnalyticsData {
  events: any[];
  performance: Record<string, any>;
  experiments: Record<string, any>;
}

class SimpleAnalytics {
  private data: AnalyticsData = {
    events: [],
    performance: {},
    experiments: {}
  };

  async initialize() {
    // Generate some mock data
    this.generateMockData();
  }

  async insertEvent(event: any) {
    this.data.events.push({
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    });
  }

  async updatePerformanceData(creative_id: string, date: string, metrics: any) {
    const key = `${creative_id}-${date}`;
    if (!this.data.performance[key]) {
      this.data.performance[key] = { creative_id, date, ...metrics };
    } else {
      // Merge metrics
      Object.keys(metrics).forEach(k => {
        this.data.performance[key][k] = (this.data.performance[key][k] || 0) + metrics[k];
      });
    }
  }

  async getKPIs(dateRange: { start: string; end: string }) {
    const performances = Object.values(this.data.performance);
    
    const totals = performances.reduce((acc: any, perf: any) => ({
      total_impressions: (acc.total_impressions || 0) + (perf.impressions || 0),
      total_clicks: (acc.total_clicks || 0) + (perf.clicks || 0),
      total_installs: (acc.total_installs || 0) + (perf.installs || 0),
      total_spend: (acc.total_spend || 0) + (perf.spend || 0),
      total_revenue: (acc.total_revenue || 0) + (perf.revenue || 0),
    }), {});

    return {
      ...totals,
      ctr: totals.total_impressions > 0 ? ((totals.total_clicks / totals.total_impressions) * 100).toFixed(2) : 0,
      cvr: totals.total_clicks > 0 ? ((totals.total_installs / totals.total_clicks) * 100).toFixed(2) : 0,
      cpi: totals.total_installs > 0 ? (totals.total_spend / totals.total_installs).toFixed(2) : 0,
      roas: totals.total_spend > 0 ? (totals.total_revenue / totals.total_spend).toFixed(2) : 0,
    };
  }

  async getTopPerformingCreatives(limit = 10) {
    const creativeStats: Record<string, any> = {};
    
    Object.values(this.data.performance).forEach((perf: any) => {
      if (!creativeStats[perf.creative_id]) {
        creativeStats[perf.creative_id] = {
          creative_id: perf.creative_id,
          impressions: 0,
          clicks: 0,
          installs: 0,
          spend: 0
        };
      }
      
      const stats = creativeStats[perf.creative_id];
      stats.impressions += perf.impressions || 0;
      stats.clicks += perf.clicks || 0;
      stats.installs += perf.installs || 0;
      stats.spend += perf.spend || 0;
    });

    return Object.values(creativeStats)
      .map((stats: any) => ({
        ...stats,
        ctr: stats.impressions > 0 ? ((stats.clicks / stats.impressions) * 100).toFixed(2) : 0,
        cvr: stats.clicks > 0 ? ((stats.installs / stats.clicks) * 100).toFixed(2) : 0,
        cpi: stats.installs > 0 ? (stats.spend / stats.installs).toFixed(2) : 0,
      }))
      .sort((a, b) => b.installs - a.installs)
      .slice(0, limit);
  }

  async getAudienceInsights() {
    const insights: Record<string, any> = {};
    
    this.data.events.forEach(event => {
      if (event.device_info?.platform) {
        const key = event.device_info.platform;
        insights[key] = (insights[key] || 0) + 1;
      }
    });

    return Object.entries(insights).map(([platform, count]) => ({
      platform,
      country: 'US', // Mock
      event_count: count,
      unique_users: Math.floor(count as number * 0.7) // Mock
    }));
  }

  async getPerformanceTrends(creative_id: string) {
    return Object.values(this.data.performance)
      .filter((perf: any) => perf.creative_id === creative_id)
      .slice(0, 30);
  }

  private generateMockData() {
    const creativeIds = ['memory-match', 'endless-runner', 'puzzle-quest'];
    const today = new Date();

    // Generate performance data
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      creativeIds.forEach(creativeId => {
        const impressions = Math.floor(Math.random() * 10000) + 1000;
        const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.05));
        const installs = Math.floor(clicks * (0.05 + Math.random() * 0.15));
        const spend = parseFloat((impressions * 0.001 + Math.random() * 0.002).toFixed(2));
        const revenue = parseFloat((installs * 0.5 + Math.random() * 2).toFixed(2));

        this.updatePerformanceData(creativeId, dateStr, {
          impressions,
          clicks,
          installs,
          spend,
          revenue
        });
      });
    }

    // Generate events
    for (let i = 0; i < 1000; i++) {
      const eventTypes = ['impression', 'click', 'install'];
      const platforms = ['ios', 'android'];
      
      this.insertEvent({
        event_id: `event_${i}`,
        event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        creative_id: creativeIds[Math.floor(Math.random() * creativeIds.length)],
        user_id: `user_${Math.floor(Math.random() * 1000)}`,
        device_info: { 
          platform: platforms[Math.floor(Math.random() * platforms.length)] 
        }
      });
    }
  }
}

let analyticsInstance: SimpleAnalytics | null = null;

export function getAnalytics(): SimpleAnalytics {
  if (!analyticsInstance) {
    analyticsInstance = new SimpleAnalytics();
  }
  return analyticsInstance;
}