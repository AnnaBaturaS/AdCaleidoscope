export type CreativeFormat = 'video' | 'banner' | 'playable';

export type Hook = 
  | 'closeup_face' 
  | 'countdown' 
  | 'price_flash' 
  | 'ugc' 
  | 'gameplay' 
  | 'meme'
  | 'unboxing'
  | 'tutorial'
  | 'social_proof';

export type CreativeStyle = 
  | 'minimalist' 
  | 'bold' 
  | 'organic' 
  | 'premium' 
  | 'playful' 
  | 'dark' 
  | 'bright';

export type CTAType = 
  | 'install_now' 
  | 'play_now' 
  | 'download' 
  | 'get_it' 
  | 'try_free' 
  | 'learn_more';

export interface Metrics {
  impressions: number;
  clicks: number;
  installs: number;
  ctr: number;
  ipm: number;
  cpi: number;
  spend: number;
  cvr?: number;
  retention_d1?: number;
  retention_d7?: number;
}

export interface CreativeTags {
  hook?: Hook;
  style?: CreativeStyle;
  cta?: CTAType;
  color?: string;
  intro_pace?: 'fast' | 'medium' | 'slow';
  lang?: string;
  duration?: number;
  has_voiceover?: boolean;
  has_text_overlay?: boolean;
  brand_visibility?: 'high' | 'medium' | 'low';
}

export interface CreativeURLs {
  preview: string;
  source?: string;
  thumbnail?: string;
  original?: string;
}

export interface Creative {
  id: string;
  format: CreativeFormat;
  name: string;
  urls: CreativeURLs;
  tags: CreativeTags;
  version: number;
  network?: string[];
  status: 'active' | 'paused' | 'testing' | 'archived';
  createdAt: string;
  updatedAt: string;
  metrics?: Metrics;
  parentId?: string;
  generatedFrom?: string;
  isVariation?: boolean;
}

export interface CreativeFilter {
  format?: CreativeFormat[];
  hook?: Hook[];
  style?: CreativeStyle[];
  network?: string[];
  status?: Creative['status'][];
  dateRange?: {
    from: string;
    to: string;
  };
  performanceThreshold?: {
    metric: keyof Metrics;
    operator: 'gt' | 'lt' | 'eq';
    value: number;
  };
}

export interface CreativeVariationRequest {
  baseCreativeId: string;
  variations: {
    hook?: Hook;
    style?: CreativeStyle;
    cta?: CTAType;
    color?: string;
    customPrompt?: string;
  }[];
  count?: number;
}