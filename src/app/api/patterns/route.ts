import { NextResponse } from 'next/server';
import { PatternFactor, PatternRule, AntiPattern } from '@/models/pattern';

const mockPatternFactors: PatternFactor[] = [
  {
    id: 'closeup-face',
    name: 'Close-up Face Hook',
    category: 'visual',
    description: 'Character face shown in close-up within first 3 seconds',
    impact: {
      ctr: 23,
      ipm: 8,
      retention: 15
    },
    confidence: 94,
    samples: 1247
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    category: 'interaction',
    description: 'Visible countdown timer creating urgency',
    impact: {
      ipm: 18,
      ctr: 12,
      cpi: -8
    },
    confidence: 87,
    samples: 892
  },
  {
    id: 'bright-colors',
    name: 'Bright Color Palette',
    category: 'visual',
    description: 'High saturation colors (>70% in HSV)',
    impact: {
      ctr: 12,
      retention: 7
    },
    confidence: 78,
    samples: 2156
  },
  {
    id: 'gameplay-footage',
    name: 'Actual Gameplay',
    category: 'visual',
    description: 'Real gameplay footage vs. rendered scenes',
    impact: {
      retention: 25,
      cpi: -15,
      ipm: 22
    },
    confidence: 91,
    samples: 1834
  },
  {
    id: 'fast-paced-editing',
    name: 'Fast-Paced Editing',
    category: 'timing',
    description: 'Quick cuts every 2-3 seconds',
    impact: {
      ctr: 16,
      retention: -5
    },
    confidence: 83,
    samples: 743
  }
];

const mockPatternRules: PatternRule[] = [
  {
    id: 'hook-face-gameplay',
    name: 'Face + Gameplay Combo',
    description: 'Close-up face in first 3s followed by gameplay',
    condition: 'closeup_face AND gameplay_footage AND sequence_order',
    factors: [mockPatternFactors[0], mockPatternFactors[3]],
    expectedLift: {
      metric: 'CTR',
      value: 35,
      confidence: 89
    },
    applicableFormats: ['video'],
    tags: ['high-impact', 'proven']
  },
  {
    id: 'urgency-bright',
    name: 'Urgency with Bright Colors',
    description: 'Countdown timer with high-saturation color scheme',
    condition: 'countdown_timer AND bright_colors',
    factors: [mockPatternFactors[1], mockPatternFactors[2]],
    expectedLift: {
      metric: 'IPM',
      value: 28,
      confidence: 82
    },
    applicableFormats: ['video', 'banner'],
    tags: ['conversion-focused']
  },
  {
    id: 'authentic-gameplay',
    name: 'Authentic Gameplay Focus',
    description: 'Actual gameplay with moderate pacing',
    condition: 'gameplay_footage AND NOT fast_paced_editing',
    factors: [mockPatternFactors[3]],
    expectedLift: {
      metric: 'Retention D7',
      value: 22,
      confidence: 88
    },
    applicableFormats: ['video', 'playable'],
    tags: ['retention-focused', 'authentic']
  }
];

const mockAntiPatterns: AntiPattern[] = [
  {
    id: 'misleading-gameplay',
    name: 'Misleading Gameplay',
    description: 'Showing gameplay that doesn\'t match actual game mechanics',
    warning: 'High risk of negative user feedback and poor retention',
    impact: {
      metric: 'Retention D1',
      negativeEffect: -45
    },
    avoidanceStrategy: 'Use only actual gameplay footage or clearly labeled concept art',
    examples: [
      'Showing strategy gameplay for a match-3 game',
      'Using high-end graphics for a simple mobile game',
      'Displaying features not available in the actual game'
    ]
  },
  {
    id: 'excessive-text',
    name: 'Text Overload',
    description: 'Too much text overlay reducing visual clarity',
    warning: 'Reduces CTR and user engagement, especially on mobile',
    impact: {
      metric: 'CTR',
      negativeEffect: -23
    },
    avoidanceStrategy: 'Limit text to essential information, use visual storytelling',
    examples: [
      'Multiple text overlays simultaneously',
      'Small font sizes on mobile screens',
      'Complex sentences in fast-paced videos'
    ]
  },
  {
    id: 'weak-hook',
    name: 'Generic Opening',
    description: 'First 3 seconds don\'t capture attention effectively',
    warning: 'Critical for video performance, especially on social platforms',
    impact: {
      metric: 'CTR',
      negativeEffect: -35
    },
    avoidanceStrategy: 'Start with strong visual hook, character, or action within 1 second',
    examples: [
      'Slow fade-ins or logo reveals',
      'Generic menu screens',
      'Lengthy setup without action'
    ]
  }
];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 300));

  return NextResponse.json({
    success: true,
    data: {
      factors: mockPatternFactors,
      rules: mockPatternRules,
      antiPatterns: mockAntiPatterns,
      summary: {
        totalFactors: mockPatternFactors.length,
        totalRules: mockPatternRules.length,
        totalAntiPatterns: mockAntiPatterns.length,
        avgConfidence: Math.round(
          mockPatternFactors.reduce((sum, f) => sum + f.confidence, 0) / mockPatternFactors.length
        ),
        lastUpdated: new Date().toISOString()
      }
    }
  });
}