import { Database } from 'duckdb';
import path from 'path';
import fs from 'fs/promises';

// DuckDB Analytics Service for local data processing
export class DuckDBAnalytics {
  private db: Database;
  private dbPath: string;
  private initialized = false;

  constructor(dbPath?: string) {
    this.dbPath = dbPath || process.env.DUCKDB_PATH || './data/analytics.duckdb';
    this.db = new Database(this.dbPath);
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Ensure data directory exists
      const dir = path.dirname(this.dbPath);
      await fs.mkdir(dir, { recursive: true });

      // Create tables
      await this.createTables();
      
      this.initialized = true;
      console.log('DuckDB Analytics initialized');
    } catch (error) {
      console.error('Failed to initialize DuckDB Analytics:', error);
      throw error;
    }
  }

  private async createTables() {
    const queries = [
      // Events table for tracking user interactions
      `
      CREATE TABLE IF NOT EXISTS events (
        event_id VARCHAR PRIMARY KEY,
        event_type VARCHAR NOT NULL,
        creative_id VARCHAR,
        user_id VARCHAR,
        session_id VARCHAR,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        properties JSON,
        device_info JSON,
        geo_info JSON
      );
      `,
      
      // Creatives performance table
      `
      CREATE TABLE IF NOT EXISTS creative_performance (
        creative_id VARCHAR NOT NULL,
        date DATE NOT NULL,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        installs INTEGER DEFAULT 0,
        spend DECIMAL(10,2) DEFAULT 0,
        revenue DECIMAL(10,2) DEFAULT 0,
        PRIMARY KEY (creative_id, date)
      );
      `,
      
      // Experiments table for A/B testing results
      `
      CREATE TABLE IF NOT EXISTS experiment_results (
        experiment_id VARCHAR NOT NULL,
        variant_id VARCHAR NOT NULL,
        creative_id VARCHAR NOT NULL,
        date DATE NOT NULL,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        PRIMARY KEY (experiment_id, variant_id, creative_id, date)
      );
      `,
      
      // Campaigns summary table
      `
      CREATE TABLE IF NOT EXISTS campaigns (
        campaign_id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        status VARCHAR DEFAULT 'active',
        start_date DATE,
        end_date DATE,
        budget DECIMAL(10,2),
        spent DECIMAL(10,2) DEFAULT 0,
        target_audience JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `,
    ];

    for (const query of queries) {
      await this.query(query);
    }
  }

  async query(sql: string, params?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params || [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Analytics Methods
  async getKPIs(dateRange: { start: string; end: string }) {
    const sql = `
      SELECT 
        SUM(impressions) as total_impressions,
        SUM(clicks) as total_clicks,
        SUM(installs) as total_installs,
        SUM(spend) as total_spend,
        SUM(revenue) as total_revenue,
        ROUND(SUM(clicks) * 100.0 / NULLIF(SUM(impressions), 0), 2) as ctr,
        ROUND(SUM(installs) * 100.0 / NULLIF(SUM(clicks), 0), 2) as cvr,
        ROUND(SUM(spend) / NULLIF(SUM(installs), 0), 2) as cpi,
        ROUND(SUM(revenue) / NULLIF(SUM(spend), 0), 2) as roas
      FROM creative_performance 
      WHERE date BETWEEN ? AND ?
    `;
    
    const result = await this.query(sql, [dateRange.start, dateRange.end]);
    return result[0] || {};
  }

  async getTopPerformingCreatives(limit = 10, dateRange?: { start: string; end: string }) {
    let sql = `
      SELECT 
        creative_id,
        SUM(impressions) as impressions,
        SUM(clicks) as clicks,
        SUM(installs) as installs,
        SUM(spend) as spend,
        ROUND(SUM(clicks) * 100.0 / NULLIF(SUM(impressions), 0), 2) as ctr,
        ROUND(SUM(installs) * 100.0 / NULLIF(SUM(clicks), 0), 2) as cvr,
        ROUND(SUM(spend) / NULLIF(SUM(installs), 0), 2) as cpi
      FROM creative_performance
    `;
    
    const params = [];
    if (dateRange) {
      sql += ' WHERE date BETWEEN ? AND ?';
      params.push(dateRange.start, dateRange.end);
    }
    
    sql += `
      GROUP BY creative_id
      ORDER BY installs DESC
      LIMIT ?
    `;
    params.push(limit);
    
    return await this.query(sql, params);
  }

  async getPerformanceTrends(creative_id: string, days = 30) {
    const sql = `
      SELECT 
        date,
        impressions,
        clicks,
        installs,
        spend,
        ROUND(clicks * 100.0 / NULLIF(impressions, 0), 2) as ctr,
        ROUND(installs * 100.0 / NULLIF(clicks, 0), 2) as cvr
      FROM creative_performance
      WHERE creative_id = ? 
        AND date >= CURRENT_DATE - INTERVAL ? DAYS
      ORDER BY date DESC
    `;
    
    return await this.query(sql, [creative_id, days]);
  }

  async getExperimentResults(experiment_id: string) {
    const sql = `
      SELECT 
        variant_id,
        SUM(impressions) as impressions,
        SUM(clicks) as clicks,
        SUM(conversions) as conversions,
        ROUND(SUM(clicks) * 100.0 / NULLIF(SUM(impressions), 0), 2) as ctr,
        ROUND(SUM(conversions) * 100.0 / NULLIF(SUM(clicks), 0), 2) as cvr
      FROM experiment_results
      WHERE experiment_id = ?
      GROUP BY variant_id
      ORDER BY conversions DESC
    `;
    
    return await this.query(sql, [experiment_id]);
  }

  async getAudienceInsights(dateRange: { start: string; end: string }) {
    const sql = `
      SELECT 
        JSON_EXTRACT(device_info, '$.platform') as platform,
        JSON_EXTRACT(geo_info, '$.country') as country,
        COUNT(*) as event_count,
        COUNT(DISTINCT user_id) as unique_users
      FROM events
      WHERE timestamp BETWEEN ? AND ?
        AND event_type IN ('impression', 'click', 'install')
      GROUP BY platform, country
      ORDER BY event_count DESC
      LIMIT 20
    `;
    
    return await this.query(sql, [dateRange.start, dateRange.end]);
  }

  // Data ingestion methods
  async insertEvent(event: {
    event_id: string;
    event_type: string;
    creative_id?: string;
    user_id?: string;
    session_id?: string;
    timestamp?: string;
    properties?: any;
    device_info?: any;
    geo_info?: any;
  }) {
    const sql = `
      INSERT INTO events (
        event_id, event_type, creative_id, user_id, session_id,
        timestamp, properties, device_info, geo_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      event.event_id,
      event.event_type,
      event.creative_id,
      event.user_id,
      event.session_id,
      event.timestamp || new Date().toISOString(),
      JSON.stringify(event.properties || {}),
      JSON.stringify(event.device_info || {}),
      JSON.stringify(event.geo_info || {}),
    ];
    
    return await this.query(sql, params);
  }

  async updatePerformanceData(creative_id: string, date: string, metrics: {
    impressions?: number;
    clicks?: number;
    installs?: number;
    spend?: number;
    revenue?: number;
  }) {
    const sql = `
      INSERT INTO creative_performance (creative_id, date, impressions, clicks, installs, spend, revenue)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (creative_id, date) DO UPDATE SET
        impressions = creative_performance.impressions + EXCLUDED.impressions,
        clicks = creative_performance.clicks + EXCLUDED.clicks,
        installs = creative_performance.installs + EXCLUDED.installs,
        spend = creative_performance.spend + EXCLUDED.spend,
        revenue = creative_performance.revenue + EXCLUDED.revenue
    `;
    
    const params = [
      creative_id,
      date,
      metrics.impressions || 0,
      metrics.clicks || 0,
      metrics.installs || 0,
      metrics.spend || 0,
      metrics.revenue || 0,
    ];
    
    return await this.query(sql, params);
  }

  async insertExperimentResult(experiment_id: string, variant_id: string, creative_id: string, date: string, metrics: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
  }) {
    const sql = `
      INSERT INTO experiment_results (experiment_id, variant_id, creative_id, date, impressions, clicks, conversions)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (experiment_id, variant_id, creative_id, date) DO UPDATE SET
        impressions = experiment_results.impressions + EXCLUDED.impressions,
        clicks = experiment_results.clicks + EXCLUDED.clicks,
        conversions = experiment_results.conversions + EXCLUDED.conversions
    `;
    
    const params = [
      experiment_id,
      variant_id,
      creative_id,
      date,
      metrics.impressions || 0,
      metrics.clicks || 0,
      metrics.conversions || 0,
    ];
    
    return await this.query(sql, params);
  }

  // Import data from files (Parquet, CSV, JSON)
  async importFromFile(tableName: string, filePath: string, fileType: 'parquet' | 'csv' | 'json' = 'parquet') {
    let sql;
    
    switch (fileType) {
      case 'parquet':
        sql = `INSERT INTO ${tableName} SELECT * FROM read_parquet('${filePath}')`;
        break;
      case 'csv':
        sql = `INSERT INTO ${tableName} SELECT * FROM read_csv_auto('${filePath}')`;
        break;
      case 'json':
        sql = `INSERT INTO ${tableName} SELECT * FROM read_json_auto('${filePath}')`;
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    return await this.query(sql);
  }

  // Export data to files
  async exportToFile(sql: string, filePath: string, fileType: 'parquet' | 'csv' | 'json' = 'parquet') {
    let exportSql;
    
    switch (fileType) {
      case 'parquet':
        exportSql = `COPY (${sql}) TO '${filePath}' (FORMAT PARQUET)`;
        break;
      case 'csv':
        exportSql = `COPY (${sql}) TO '${filePath}' (FORMAT CSV, HEADER)`;
        break;
      case 'json':
        exportSql = `COPY (${sql}) TO '${filePath}' (FORMAT JSON)`;
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    return await this.query(exportSql);
  }

  async close() {
    return new Promise<void>((resolve) => {
      this.db.close((err) => {
        if (err) console.error('Error closing DuckDB:', err);
        resolve();
      });
    });
  }
}

// Singleton instance
let analyticsInstance: DuckDBAnalytics | null = null;

export function getAnalytics(): DuckDBAnalytics {
  if (!analyticsInstance) {
    analyticsInstance = new DuckDBAnalytics();
  }
  return analyticsInstance;
}

// Mock data generator for demo purposes
export async function generateMockData(analytics: DuckDBAnalytics) {
  console.log('Generating mock analytics data...');
  
  const creativeIds = ['img_001', 'video_001', 'playable_001', 'banner_001', 'interstitial_001'];
  const platforms = ['ios', 'android'];
  const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'KR'];
  
  // Generate performance data for last 30 days
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    for (const creativeId of creativeIds) {
      const impressions = Math.floor(Math.random() * 10000) + 1000;
      const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.05));
      const installs = Math.floor(clicks * (0.05 + Math.random() * 0.15));
      const spend = parseFloat((impressions * 0.001 + Math.random() * 0.002).toFixed(2));
      const revenue = parseFloat((installs * 0.5 + Math.random() * 2).toFixed(2));
      
      await analytics.updatePerformanceData(creativeId, dateStr, {
        impressions,
        clicks,
        installs,
        spend,
        revenue,
      });
    }
  }
  
  // Generate events
  for (let i = 0; i < 1000; i++) {
    const eventTypes = ['impression', 'click', 'install'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const creativeId = creativeIds[Math.floor(Math.random() * creativeIds.length)];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    
    const timestamp = new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    await analytics.insertEvent({
      event_id: `event_${i}_${Date.now()}`,
      event_type: eventType,
      creative_id: creativeId,
      user_id: `user_${Math.floor(Math.random() * 1000)}`,
      session_id: `session_${Math.floor(Math.random() * 500)}`,
      timestamp: timestamp.toISOString(),
      device_info: { platform },
      geo_info: { country },
    });
  }
  
  console.log('Mock data generation completed');
}