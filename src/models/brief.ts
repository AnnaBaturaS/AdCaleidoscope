export interface BriefTemplate {
  id: string;
  name: string;
  description: string;
  category: 'video' | 'banner' | 'playable' | 'universal';
  prompts: {
    visual: string;
    copy: string;
    audio?: string;
    interaction?: string;
  };
  variables: BriefVariable[];
  examples: string[];
}

export interface BriefVariable {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'color' | 'number' | 'boolean';
  options?: string[];
  defaultValue?: any;
  required: boolean;
  description?: string;
}

export interface Brief {
  id: string;
  name: string;
  templateId?: string;
  format: string[];
  brand: {
    name: string;
    colors: string[];
    fonts?: string[];
    logo?: string;
    guidelines?: string;
  };
  content: {
    visualPrompt: string;
    copyPrompt: string;
    audioPrompt?: string;
    interactionPrompt?: string;
    customInstructions?: string;
  };
  targeting: {
    audience: string;
    demographics?: {
      ageRange: string;
      gender: string;
      interests: string[];
    };
    painPoints: string[];
    benefits: string[];
  };
  constraints: {
    duration?: number;
    aspectRatio?: string;
    fileSize?: number;
    safeArea?: boolean;
    compliance?: string[];
  };
  references: {
    inspirations?: string[];
    competitorAds?: string[];
    assets?: string[];
  };
  status: 'draft' | 'approved' | 'in_production' | 'completed';
  createdAt: string;
  updatedAt: string;
  generatedCreatives?: string[];
}

export interface BriefGenerationRequest {
  briefId: string;
  format: string;
  variations?: number;
  provider: 'bedrock' | 'openai' | 'custom';
  parameters: {
    quality: 'draft' | 'standard' | 'premium';
    creativity: number;
    adherence: number;
    customParams?: Record<string, any>;
  };
}