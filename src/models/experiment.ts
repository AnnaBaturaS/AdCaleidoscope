export interface ExperimentConfig {
  id: string;
  name: string;
  description: string;
  creativeIds: string[];
  networks: string[];
  budget: {
    total: number;
    daily: number;
    perCreative?: number;
  };
  targeting: {
    geos: string[];
    demographics?: {
      ageMin?: number;
      ageMax?: number;
      gender?: 'male' | 'female' | 'all';
    };
    interests?: string[];
    custom?: Record<string, any>;
  };
  rules: ExperimentRule[];
  duration: {
    startDate: string;
    endDate?: string;
    maxDays?: number;
  };
  status: 'draft' | 'active' | 'paused' | 'completed' | 'killed';
  createdAt: string;
}

export interface ExperimentRule {
  id: string;
  type: 'kill' | 'scale' | 'pause' | 'optimize';
  condition: {
    metric: string;
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    value: number;
    minSample?: number;
    confidence?: number;
  };
  action: {
    type: string;
    params: Record<string, any>;
  };
  priority: number;
  isActive: boolean;
}

export interface ExperimentResult {
  experimentId: string;
  creativeId: string;
  metrics: {
    impressions: number;
    clicks: number;
    installs: number;
    spend: number;
    ctr: number;
    ipm: number;
    cpi: number;
  };
  status: 'running' | 'killed' | 'scaled' | 'paused';
  triggeredRules: string[];
  lastUpdated: string;
}

export interface ExperimentAlert {
  id: string;
  experimentId: string;
  creativeId?: string;
  type: 'kill' | 'scale' | 'budget_exceeded' | 'performance_alert';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  isRead: boolean;
  actionTaken?: string;
}