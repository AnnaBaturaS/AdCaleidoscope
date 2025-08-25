export interface PatternFactor {
  id: string;
  name: string;
  category: 'visual' | 'audio' | 'copy' | 'interaction' | 'timing';
  description: string;
  impact: {
    ctr?: number;
    ipm?: number;
    cpi?: number;
    retention?: number;
  };
  confidence: number;
  samples: number;
}

export interface PatternRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  factors: PatternFactor[];
  expectedLift: {
    metric: string;
    value: number;
    confidence: number;
  };
  applicableFormats: string[];
  tags: string[];
}

export interface AntiPattern {
  id: string;
  name: string;
  description: string;
  warning: string;
  impact: {
    metric: string;
    negativeEffect: number;
  };
  avoidanceStrategy: string;
  examples: string[];
}

export interface PatternAnalysis {
  creativeId: string;
  factors: {
    factorId: string;
    presence: boolean;
    strength: number;
    contribution: number;
  }[];
  predictedPerformance: {
    ctr: number;
    ipm: number;
    cpi: number;
    confidence: number;
  };
  recommendations: string[];
  warnings: string[];
}