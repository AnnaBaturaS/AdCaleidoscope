export interface PlayableConfig {
  name: string;
  version: string;
  dimensions: {
    width: number;
    height: number;
  };
  orientation: 'portrait' | 'landscape' | 'square';
  assets: {
    images: string[];
    sounds?: string[];
    fonts?: string[];
  };
  gameplay: {
    type: 'puzzle' | 'arcade' | 'rpg' | 'strategy' | 'simulation' | 'casual';
    duration: number;
    difficulty: 'easy' | 'medium' | 'hard';
    tutorial: boolean;
  };
  ui: {
    showCloseButton: boolean;
    showSoundToggle: boolean;
    customClose?: boolean;
    safeArea: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  events: {
    required: PlayableEvent[];
    optional: PlayableEvent[];
  };
  store: {
    ios?: string;
    android?: string;
    fallback?: string;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    category: string;
  };
}

export interface PlayableEvent {
  name: string;
  trigger: 'manual' | 'timer' | 'interaction' | 'gamestate';
  parameters?: Record<string, any>;
  required: boolean;
  description: string;
}

export interface MRAIDEvent {
  type: string;
  timestamp: number;
  data?: any;
  source: 'playable' | 'mraid';
}

export interface PlayableSession {
  id: string;
  configId: string;
  startTime: number;
  endTime?: number;
  events: MRAIDEvent[];
  performance: {
    fps: number[];
    memoryUsage: number[];
    loadTime: number;
    errors: string[];
  };
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
}

export interface PlayableValidation {
  configId: string;
  passed: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number;
  checklist: {
    hasEndcard: boolean;
    hasStoreLink: boolean;
    eventsImplemented: string[];
    performanceOk: boolean;
    sizeOk: boolean;
  };
}

export interface ValidationError {
  code: string;
  message: string;
  severity: 'error' | 'warning';
  line?: number;
  file?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
}