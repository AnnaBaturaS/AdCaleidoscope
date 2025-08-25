// Prompt templates for different creative types and use cases

export interface PromptTemplate {
  id: string;
  name: string;
  category: 'video' | 'banner' | 'playable' | 'universal';
  description: string;
  template: string;
  variables: TemplateVariable[];
  examples: string[];
  tags: string[];
  usageCount?: number;
  avgPerformance?: {
    ctr: number;
    ipm: number;
    cpi: number;
  };
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'color' | 'number' | 'boolean';
  options?: string[];
  defaultValue?: any;
  required: boolean;
  description?: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'mobile-rpg-video',
    name: 'Mobile RPG - Hero Journey',
    category: 'video',
    description: 'Epic fantasy RPG template focusing on character progression and adventure',
    template: `# {{creative_type}} Creative Brief: {{game_title}}

## Visual Direction
Create a {{duration}}-second {{format}} creative showcasing an epic fantasy RPG adventure:

**Opening Hook (0-3s):**
- Start with {{hook_type}} featuring {{main_character}}
- Use {{color_palette}} color scheme with {{lighting_style}} lighting
- Show {{opening_action}} to immediately capture attention

**Gameplay Showcase (3-{{middle_point}}s):**
- Demonstrate core mechanics: {{gameplay_mechanics}}
- Feature {{character_progression}} elements
- Show {{combat_system}} in action
- Highlight {{unique_features}}

**Character & World ({{middle_point}}-{{end_point}}s):**
- Showcase {{world_setting}} environment
- Display character customization: {{customization_options}}
- Feature {{special_abilities}} and magic systems
- Show {{loot_rewards}} and progression rewards

**Call-to-Action ({{end_point}}-{{duration}}s):**
- {{cta_style}} call-to-action: "{{cta_text}}"
- Show app icon and {{store_rating}} rating
- Include {{download_incentive}} if applicable

## Technical Specifications
- Aspect Ratio: {{aspect_ratio}}
- Resolution: {{resolution}}
- Frame Rate: {{fps}} FPS
- Safe Area: {{safe_area_margin}} pixels from edges
- Brand Logo: Position {{logo_position}}, size {{logo_size}}

## Audio Direction
- {{music_style}} background music
- {{sound_effects}} for actions and UI
- {{voiceover}} narration style
- Audio peaks at {{audio_levels}} to comply with platform requirements

## Targeting & Messaging
- Primary audience: {{target_audience}}
- Key pain point addressed: {{pain_point}}
- Main benefit highlighted: {{main_benefit}}
- Emotional tone: {{emotional_tone}}

## Brand Guidelines
- Colors: {{brand_colors}}
- Fonts: {{brand_fonts}}
- Logo treatment: {{logo_treatment}}
- Compliance: {{compliance_requirements}}

## Performance Optimization
- Optimize for {{primary_platform}} performance
- Target {{target_cpi}} CPI with {{target_ctr}}% CTR
- A/B test variations: {{ab_variations}}

Generated with AdCaleidoscope Creative OS`,
    variables: [
      { key: 'game_title', label: 'Game Title', type: 'text', required: true },
      { key: 'creative_type', label: 'Creative Type', type: 'select', options: ['Video Ad', 'Playable Ad', 'Banner Ad'], required: true },
      { key: 'duration', label: 'Duration (seconds)', type: 'number', defaultValue: 30, required: true },
      { key: 'format', label: 'Format', type: 'select', options: ['video', 'playable', 'banner'], required: true },
      { key: 'hook_type', label: 'Opening Hook', type: 'select', options: ['close-up character face', 'epic battle scene', 'magic spell casting', 'treasure discovery', 'character transformation'], required: true },
      { key: 'main_character', label: 'Main Character', type: 'text', defaultValue: 'heroic warrior', required: false },
      { key: 'color_palette', label: 'Color Palette', type: 'select', options: ['warm fantasy (gold/orange)', 'cool mystic (blue/purple)', 'dark epic (black/red)', 'bright magical (rainbow)', 'earth tones (brown/green)'], required: true },
      { key: 'lighting_style', label: 'Lighting Style', type: 'select', options: ['dramatic cinematic', 'warm magical', 'cool mystical', 'bright heroic', 'dark atmospheric'], required: false },
      { key: 'gameplay_mechanics', label: 'Gameplay Mechanics', type: 'multiselect', options: ['turn-based combat', 'real-time battles', 'spell crafting', 'character progression', 'guild system', 'PvP arena', 'dungeon exploration'], required: true },
      { key: 'cta_text', label: 'Call-to-Action Text', type: 'text', defaultValue: 'Start Your Epic Journey!', required: true },
      { key: 'target_audience', label: 'Target Audience', type: 'text', defaultValue: 'RPG enthusiasts, 18-35 years old', required: true }
    ],
    examples: [
      'Epic fantasy RPG with dragon battles and magic spells',
      'Medieval adventure with character customization and guild wars',
      'Anime-style RPG with turn-based combat and story progression'
    ],
    tags: ['RPG', 'Fantasy', 'Character-driven', 'Epic', 'Adventure'],
    usageCount: 127,
    avgPerformance: { ctr: 4.2, ipm: 67.3, cpi: 2.34 }
  },

  {
    id: 'casual-puzzle-ugc',
    name: 'Casual Puzzle - UGC Style',
    category: 'video',
    description: 'User-generated content style template for casual puzzle games',
    template: `# {{creative_type}} Creative: {{game_title}} - UGC Style

## Authentic UGC Direction
Create a {{duration}}-second {{format}} that feels like genuine user-generated content:

**Opening (0-3s):**
- {{opening_style}} with {{person_type}}
- Natural {{camera_angle}} camera angle
- Authentic reaction: {{initial_reaction}}
- Show phone/device screen clearly

**Gameplay Demo (3-{{puzzle_showcase_end}}s):**
- Demonstrate {{puzzle_type}} mechanics
- Show {{difficulty_progression}} 
- Capture genuine {{emotional_reactions}}
- Highlight {{satisfying_moments}}

**Social Proof ({{puzzle_showcase_end}}-{{social_end}}s):**
- Show {{progress_indicators}}
- Mention {{social_elements}}
- Display {{achievements_unlocked}}
- {{competitive_element}} if applicable

**Call-to-Action ({{social_end}}-{{duration}}s):**
- Natural recommendation: "{{ugc_cta}}"
- Show app download process
- {{urgency_element}} to drive action

## UGC Authenticity Guidelines
- Camera: {{camera_quality}} quality, slight {{camera_movement}}
- Lighting: {{lighting_type}} lighting
- Audio: {{audio_style}} with {{background_noise}}
- Editing: {{editing_style}} with {{transition_type}} transitions
- Text Overlays: {{text_style}} style, {{text_frequency}}

## Performance Psychology
- Puzzle satisfaction: {{satisfaction_triggers}}
- Progress validation: {{progress_rewards}}
- Social connection: {{social_triggers}}
- FOMO activation: {{urgency_triggers}}

## Technical Specs
- Format: {{technical_format}}
- Aspect Ratio: {{ugc_aspect_ratio}}
- Resolution: {{ugc_resolution}} (authentic mobile quality)
- Audio: {{audio_specs}}

## Targeting
- Audience: {{casual_audience}}
- Platforms: {{ugc_platforms}}
- Placement: {{ad_placement}}
- Time of day: {{optimal_timing}}

Generated with AdCaleidoscope Creative OS`,
    variables: [
      { key: 'game_title', label: 'Game Title', type: 'text', required: true },
      { key: 'duration', label: 'Duration (seconds)', type: 'number', defaultValue: 15, required: true },
      { key: 'person_type', label: 'Person Type', type: 'select', options: ['young woman', 'college student', 'working professional', 'casual gamer', 'friend group'], required: true },
      { key: 'puzzle_type', label: 'Puzzle Type', type: 'select', options: ['match-3', 'word puzzle', 'number puzzle', 'logic puzzle', 'physics puzzle'], required: true },
      { key: 'opening_style', label: 'Opening Style', type: 'select', options: ['selfie-style recording', 'over-the-shoulder view', 'screen recording', 'reaction video'], required: true },
      { key: 'emotional_reactions', label: 'Emotional Reactions', type: 'multiselect', options: ['excitement', 'concentration', 'satisfaction', 'surprise', 'competitive drive'], required: true },
      { key: 'ugc_cta', label: 'UGC-style CTA', type: 'text', defaultValue: 'You guys have to try this game!', required: true },
      { key: 'casual_audience', label: 'Target Audience', type: 'text', defaultValue: 'Casual mobile gamers, 25-45 years old', required: true }
    ],
    examples: [
      'Friend showing addictive match-3 game during lunch break',
      'Student discovering word puzzle app while studying',
      'Person playing brain training game on commute'
    ],
    tags: ['Casual', 'UGC', 'Authentic', 'Puzzle', 'Social'],
    usageCount: 89,
    avgPerformance: { ctr: 5.1, ipm: 42.8, cpi: 1.89 }
  },

  {
    id: 'strategy-premium',
    name: 'Strategy Game - Premium Showcase',
    category: 'video',
    description: 'High-end strategy game template for core strategy enthusiasts',
    template: `# {{creative_type}} Creative: {{game_title}} - Premium Strategy

## Epic Strategy Showcase
Create a {{duration}}-second {{format}} targeting hardcore strategy gamers:

**Cinematic Opening (0-4s):**
- {{cinematic_opening}} with {{epic_music}}
- Establish {{world_setting}} and {{conflict_scale}}
- Use {{visual_effects}} and {{camera_movements}}
- Set tone with {{narrative_voice}}

**Strategic Depth Demo (4-{{strategy_end}}s):**
- Showcase {{strategy_mechanics}}
- Demonstrate {{resource_management}}
- Show {{tactical_decisions}} and consequences
- Highlight {{complexity_features}}

**Competitive Elements ({{strategy_end}}-{{competitive_end}}s):**
- Display {{multiplayer_features}}
- Show {{alliance_systems}}
- Demonstrate {{pvp_mechanics}}
- Highlight {{leaderboards_rankings}}

**Premium Positioning ({{competitive_end}}-{{duration}}s):**
- Emphasize {{premium_features}}
- Show {{advanced_graphics}}
- Mention {{strategy_depth}}
- CTA: "{{premium_cta}}"

## Visual Excellence
- Graphics: {{graphics_quality}} with {{rendering_style}}
- UI Design: {{ui_complexity}} interface
- Animations: {{animation_style}}
- Effects: {{particle_effects}} and {{lighting_effects}}

## Strategic Messaging
- Complexity: {{complexity_messaging}}
- Skill requirement: {{skill_positioning}}
- Time investment: {{time_commitment}}
- Competitive edge: {{competitive_advantage}}

## Technical Excellence
- Resolution: {{premium_resolution}}
- Frame Rate: {{premium_fps}} FPS
- Audio: {{premium_audio}} with {{orchestral_music}}
- Platform: Optimized for {{premium_platforms}}

## Hardcore Audience
- Target: {{strategy_audience}}
- Pain Points: {{strategy_pain_points}}
- Motivations: {{strategy_motivations}}
- Expertise Level: {{expertise_level}}

Generated with AdCaleidoscope Creative OS`,
    variables: [
      { key: 'game_title', label: 'Game Title', type: 'text', required: true },
      { key: 'duration', label: 'Duration (seconds)', type: 'number', defaultValue: 60, required: true },
      { key: 'world_setting', label: 'World Setting', type: 'select', options: ['medieval kingdoms', 'futuristic empires', 'ancient civilizations', 'modern warfare', 'space colonies'], required: true },
      { key: 'strategy_mechanics', label: 'Strategy Mechanics', type: 'multiselect', options: ['resource management', 'city building', 'army tactics', 'diplomacy', 'research trees', 'economic systems'], required: true },
      { key: 'cinematic_opening', label: 'Cinematic Opening', type: 'select', options: ['aerial kingdom view', 'battle preparation', 'throne room scene', 'map overview', 'commander briefing'], required: true },
      { key: 'premium_cta', label: 'Premium CTA', type: 'text', defaultValue: 'Master the Art of Strategy', required: true },
      { key: 'strategy_audience', label: 'Target Audience', type: 'text', defaultValue: 'Hardcore strategy gamers, 25-50 years old', required: true }
    ],
    examples: [
      'Epic medieval strategy with complex diplomacy and warfare',
      'Futuristic empire building with advanced technology trees',
      'Historical civilization management with authentic details'
    ],
    tags: ['Strategy', 'Premium', 'Complex', 'Hardcore', 'Competitive'],
    usageCount: 43,
    avgPerformance: { ctr: 3.9, ipm: 28.4, cpi: 4.67 }
  },

  {
    id: 'playable-interactive-demo',
    name: 'Interactive Playable Demo',
    category: 'playable',
    description: 'Template for creating engaging playable ad experiences',
    template: `# {{playable_title}} - Interactive Playable Experience

## Playable Structure
Create an engaging {{duration}}-second interactive demo:

**Instant Engagement (0-3s):**
- Auto-start with {{intro_animation}}
- Show {{tutorial_hint}} or {{finger_guidance}}
- Immediate {{interaction_feedback}}
- Clear {{objective_display}}

**Core Gameplay (3-{{gameplay_end}}s):**
- Implement {{core_mechanics}}
- {{difficulty_curve}} progression
- {{reward_feedback}} for actions
- {{progress_indicators}} throughout

**Achievement Moment ({{gameplay_end}}-{{achievement_end}}s):**
- Trigger {{success_celebration}}
- Show {{achievement_unlocked}}
- Display {{progress_made}}
- {{satisfaction_payoff}} moment

**Install Motivation ({{achievement_end}}-{{duration}}s):**
- Reveal {{what_comes_next}}
- Show {{additional_content}}
- Strong CTA: "{{playable_cta}}"
- {{urgency_element}} for installation

## Interaction Design
- Touch Targets: {{touch_size}} minimum
- Feedback: {{haptic_feedback}} and {{visual_feedback}}
- Accessibility: {{accessibility_features}}
- Error Handling: {{error_recovery}}

## Technical Requirements
- File Size: Under {{file_size_limit}} MB
- Loading Time: {{loading_target}} seconds
- Performance: {{fps_target}} FPS minimum
- Compatibility: {{device_support}}

## MRAID Integration
Required Events:
{{#each required_events}}
- {{name}}: {{description}}
{{/each}}

Optional Events:
{{#each optional_events}}
- {{name}}: {{description}}
{{/each}}

## User Experience Flow
1. {{ux_step_1}}
2. {{ux_step_2}}
3. {{ux_step_3}}
4. {{ux_step_4}}
5. {{ux_step_5}}

## Analytics Tracking
- Engagement Rate: {{engagement_metrics}}
- Completion Rate: {{completion_tracking}}
- Interaction Depth: {{interaction_metrics}}
- Install Attribution: {{install_tracking}}

Generated with AdCaleidoscope Creative OS`,
    variables: [
      { key: 'playable_title', label: 'Playable Title', type: 'text', required: true },
      { key: 'duration', label: 'Duration (seconds)', type: 'number', defaultValue: 30, required: true },
      { key: 'core_mechanics', label: 'Core Mechanics', type: 'multiselect', options: ['tap to shoot', 'drag to move', 'swipe to match', 'draw to create', 'tilt to control'], required: true },
      { key: 'intro_animation', label: 'Intro Animation', type: 'select', options: ['character introduction', 'world reveal', 'objective presentation', 'tutorial start'], required: true },
      { key: 'success_celebration', label: 'Success Celebration', type: 'select', options: ['particle explosion', 'screen flash', 'character cheer', 'victory sound'], required: true },
      { key: 'playable_cta', label: 'Playable CTA', type: 'text', defaultValue: 'Continue Playing - Install Now!', required: true },
      { key: 'file_size_limit', label: 'File Size Limit (MB)', type: 'number', defaultValue: 5, required: true }
    ],
    examples: [
      'Match-3 puzzle with cascading effects and power-ups',
      'Tower defense with drag-and-drop unit placement',
      'Endless runner with simple tap controls'
    ],
    tags: ['Playable', 'Interactive', 'MRAID', 'Engagement', 'Demo'],
    usageCount: 156,
    avgPerformance: { ctr: 6.8, ipm: 89.2, cpi: 1.45 }
  },

  {
    id: 'universal-performance',
    name: 'High-Performance Universal',
    category: 'universal',
    description: 'Optimized template for maximum performance across all formats',
    template: `# {{brand_name}} {{creative_format}} - Performance Optimized

## Performance-First Approach
Create a {{duration}}-second {{format}} optimized for {{target_metric}}:

**Hook Optimization (0-{{hook_duration}}s):**
- {{proven_hook}} within {{hook_timing}} seconds
- {{attention_grabber}} with {{visual_contrast}}
- {{emotional_trigger}} to create immediate connection
- {{brand_integration}} without compromising engagement

**Value Proposition ({{hook_duration}}-{{value_end}}s):**
- Clear {{main_benefit}} presentation
- Address {{primary_pain_point}}
- Show {{social_proof}} or {{credibility_indicator}}
- {{unique_selling_point}} differentiation

**Conversion Driver ({{value_end}}-{{duration}}s):**
- Strong {{conversion_element}}
- {{urgency_mechanism}} or {{scarcity_element}}
- Clear {{action_instruction}}
- {{risk_reduction}} if applicable

## Performance Optimization
- Pattern Integration: {{performance_patterns}}
- A/B Test Variables: {{test_variables}}
- Audience Targeting: {{target_segments}}
- Platform Optimization: {{platform_specific}}

## Creative Variables
- Visual Style: {{visual_approach}}
- Color Psychology: {{color_strategy}}
- Typography: {{text_treatment}}
- Motion: {{animation_approach}}

## Compliance & Guidelines
- Platform Requirements: {{platform_compliance}}
- Brand Guidelines: {{brand_compliance}}
- Legal Requirements: {{legal_compliance}}
- Performance Standards: {{performance_standards}}

## Success Metrics
- Primary KPI: {{primary_kpi}}
- Secondary KPIs: {{secondary_kpis}}
- Benchmark Targets: {{benchmark_targets}}
- Testing Framework: {{testing_approach}}

Generated with AdCaleidoscope Creative OS`,
    variables: [
      { key: 'brand_name', label: 'Brand Name', type: 'text', required: true },
      { key: 'creative_format', label: 'Creative Format', type: 'select', options: ['Video Ad', 'Display Banner', 'Playable Ad', 'Social Media Post'], required: true },
      { key: 'target_metric', label: 'Target Metric', type: 'select', options: ['CTR', 'IPM', 'CPI', 'ROAS', 'Engagement Rate'], required: true },
      { key: 'proven_hook', label: 'Proven Hook Type', type: 'select', options: ['problem/solution', 'before/after', 'social proof', 'curiosity gap', 'emotional story'], required: true },
      { key: 'main_benefit', label: 'Main Benefit', type: 'text', required: true },
      { key: 'primary_pain_point', label: 'Primary Pain Point', type: 'text', required: true },
      { key: 'target_segments', label: 'Target Segments', type: 'multiselect', options: ['lookalike audiences', 'interest-based', 'behavioral', 'demographic', 'retargeting'], required: true }
    ],
    examples: [
      'High-converting e-commerce product showcase',
      'Lead generation service promotion',
      'App install campaign optimization'
    ],
    tags: ['Performance', 'Universal', 'Optimization', 'Testing', 'KPI'],
    usageCount: 234,
    avgPerformance: { ctr: 4.7, ipm: 56.3, cpi: 2.89 }
  }
];

// Template utility functions
export function getTemplateById(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter(template => 
    template.category === category || template.category === 'universal'
  );
}

export function getTemplatesByTag(tag: string): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter(template => 
    template.tags.includes(tag)
  );
}

export function searchTemplates(query: string): PromptTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return PROMPT_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function fillTemplate(template: PromptTemplate, values: Record<string, any>): string {
  let filledTemplate = template.template;
  
  // Replace simple variables
  template.variables.forEach(variable => {
    const value = values[variable.key] || variable.defaultValue || '[Not specified]';
    const regex = new RegExp(`{{${variable.key}}}`, 'g');
    filledTemplate = filledTemplate.replace(regex, value);
  });
  
  // Handle conditional blocks and loops (basic implementation)
  // This could be extended with a more sophisticated template engine
  
  return filledTemplate;
}

export function validateTemplateValues(template: PromptTemplate, values: Record<string, any>): string[] {
  const errors: string[] = [];
  
  template.variables.forEach(variable => {
    if (variable.required && !values[variable.key]) {
      errors.push(`${variable.label} is required`);
    }
    
    if (variable.type === 'select' && variable.options && values[variable.key]) {
      if (!variable.options.includes(values[variable.key])) {
        errors.push(`${variable.label} must be one of: ${variable.options.join(', ')}`);
      }
    }
    
    if (variable.type === 'number' && values[variable.key]) {
      if (isNaN(Number(values[variable.key]))) {
        errors.push(`${variable.label} must be a valid number`);
      }
    }
  });
  
  return errors;
}

// Export default template for quick access
export const DEFAULT_TEMPLATE = PROMPT_TEMPLATES[0];