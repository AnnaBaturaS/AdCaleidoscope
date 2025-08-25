'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenerationPanel, GenerationJob } from '@/components/generation/generation-panel';
import { useGenerationStore } from '@/lib/stores/generation-store';
import dynamic from 'next/dynamic';
import { 
  Save, 
  Play,
  Wand2,
  Plus,
  Minus,
  Upload,
  Palette,
  Target,
  FileText,
  Settings,
  Eye,
  CheckCircle,
  AlertCircle,
  Download,
  Lightbulb,
  X,
  Sparkles
} from 'lucide-react';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface BrandBook {
  id: string;
  appName: string;
  logo?: string;
  genre: string[];
  platform: string[];
  targetAudience: {
    ageRange: string;
    demographics: string[];
    interests: string[];
  };
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  visualStyle: string;
  tone: string;
  keywords: string[];
}


// Function to convert HEX colors to color names
const hexToColorName = (hex: string): string => {
  const colorMap: { [key: string]: string } = {
    // Reds (18 colors)
    '#FF0000': 'red', '#DC143C': 'crimson', '#B22222': 'firebrick',
    '#CD5C5C': 'indian red', '#F08080': 'light coral', '#FA8072': 'salmon',
    '#E9967A': 'dark salmon', '#FFA07A': 'light salmon', '#FF6347': 'tomato',
    '#FF4500': 'orange red', '#8B0000': 'dark red', '#A52A2A': 'brown',
    '#B8860B': 'dark goldenrod', '#C0392B': 'brick red', '#E74C3C': 'alizarin',
    '#F1948A': 'dusty rose', '#EC7063': 'light coral', '#D5DBDB': 'silver pink',
    
    // Blues (12 colors)
    '#0000FF': 'blue', '#000080': 'navy', '#4169E1': 'royal blue',
    '#1E40AF': 'deep blue', '#2563EB': 'blue', '#3B82F6': 'bright blue',
    '#60A5FA': 'light blue', '#93C5FD': 'sky blue', '#87CEEB': 'sky blue',
    '#4682B4': 'steel blue', '#5F9EA0': 'cadet blue', '#B0C4DE': 'light steel blue',
    
    // Greens (12 colors)
    '#008000': 'green', '#228B22': 'forest green', '#32CD32': 'lime green',
    '#2E7D32': 'dark green', '#4CAF50': 'green', '#66BB6A': 'light green',
    '#81C784': 'mint green', '#00FF00': 'lime', '#00FF7F': 'spring green',
    '#98FB98': 'pale green', '#90EE90': 'light green', '#006400': 'dark green',
    
    // Yellows/Oranges (10 colors)
    '#FFFF00': 'yellow', '#FFD700': 'gold', '#FFA500': 'orange',
    '#FFC107': 'amber', '#FF9800': 'orange', '#FF5722': 'deep orange',
    '#FFEB3B': 'bright yellow', '#FFF176': 'light yellow', '#F57F17': 'dark yellow',
    '#FF8A65': 'peach',
    
    // Purples/Violets (8 colors)
    '#800080': 'purple', '#9C27B0': 'magenta', '#673AB7': 'indigo',
    '#3F51B5': 'blue violet', '#E1BEE7': 'lavender', '#DDA0DD': 'plum',
    '#BA55D3': 'orchid', '#9370DB': 'medium purple',
    
    // Pinks (6 colors)
    '#FFC0CB': 'pink', '#FF1493': 'deep pink', '#FF69B4': 'hot pink',
    '#FFB6C1': 'light pink', '#DB7093': 'pale violet red', '#C71585': 'medium violet red',
    
    // Browns (5 colors)
    '#8B4513': 'saddle brown', '#D2691E': 'chocolate', '#A0522D': 'sienna',
    '#CD853F': 'peru', '#DEB887': 'burlywood',
    
    // Grays (6 colors)
    '#808080': 'gray', '#A9A9A9': 'dark gray', '#D3D3D3': 'light gray',
    '#000000': 'black', '#FFFFFF': 'white', '#696969': 'dim gray',
    
    // Teals/Cyans (4 colors)
    '#008080': 'teal', '#20B2AA': 'light sea green', '#48CAE4': 'light blue',
    '#00CED1': 'dark turquoise'
  };
  
  // Direct match
  const upperHex = hex.toUpperCase();
  if (colorMap[upperHex]) return colorMap[upperHex];
  
  // Find closest color by RGB distance
  const hexToRgb = (h: string) => {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    return { r, g, b };
  };
  
  const targetRgb = hexToRgb(hex);
  let closestColor = 'colorful';
  let minDistance = Infinity;
  
  Object.entries(colorMap).forEach(([colorHex, colorName]) => {
    const colorRgb = hexToRgb(colorHex);
    const distance = Math.sqrt(
      Math.pow(targetRgb.r - colorRgb.r, 2) +
      Math.pow(targetRgb.g - colorRgb.g, 2) +
      Math.pow(targetRgb.b - colorRgb.b, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = colorName;
    }
  });
  
  return closestColor;
};

const defaultPromptTemplate = `Create a high-converting {{generation_type}} creative for {{brand_name}}.

Brand: {{brand_name}}
Style: {{brand_guidelines}}
Colors: {{brand_colors}}
Tone: {{brand_tone}}

Focus on {{brand_name}}'s core value proposition with authentic, engaging visuals. Use brand colors naturally and include a clear call-to-action.

{{custom_instructions}}`;

export default function NewBriefPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingCreative, setIsGeneratingCreative] = useState(false);
  const [generatedCreative, setGeneratedCreative] = useState<any>(null);
  const [showCreativeModal, setShowCreativeModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [selectedCreativeForPrompt, setSelectedCreativeForPrompt] = useState<any>(null);
  
  // Generation store
  const { jobs, addJob, updateJob, removeJob } = useGenerationStore();

  // Brand Books data (same as in brandbooks page)
  const brandBooks: BrandBook[] = [
    {
      id: '8',
      appName: 'Solitaire - Classic Card Games',
      logo: 'https://play-lh.googleusercontent.com/uMfsu3LiCkhB1qm-1mvumNQoKAvg9YTxM8HtMwFTwZYvWmZY7Cjuf61D0Ip_OMfTeA=w480-h960-rw',
      genre: ['Card', 'Solitaire', 'Casual', 'Single player'],
      platform: ['iOS', 'Android'],
      targetAudience: {
        ageRange: 'Everyone',
        demographics: ['Card game enthusiasts', 'Casual gamers', 'Brain training seekers', 'Relaxation seekers'],
        interests: ['Card games', 'Puzzles', 'Relaxation', 'Brain training', 'Classic games']
      },
      brandColors: {
        primary: '#2E7D32',
        secondary: '#4CAF50',
        accent: '#FFC107',
        background: '#E8F5E8',
        text: '#1B5E20'
      },
      visualStyle: 'Classic card game aesthetics with green felt background, traditional card designs, clean and minimalist interface focusing on gameplay',
      tone: 'Relaxing, classic, traditional, peaceful',
      keywords: ['solitaire', 'patience', 'card', 'classic', 'relaxing', 'brain', 'puzzle', 'offline', 'digital game', 'game']
    },
    {
      id: '7',
      appName: 'Business Empire: RichMan',
      logo: 'https://play-lh.googleusercontent.com/5p5R79o9wVz4HS1duEDvN-H0T6Os023GAeussNks_2oBVfsp7JzNfz7otpYXyXx7DVJrUVLR8KRtEYz5OseyMw=s96-rw',
      genre: ['Simulation', 'Management', 'Tycoon', 'Casual'],
      platform: ['Android'],
      targetAudience: {
        ageRange: '13+',
        demographics: ['Business enthusiasts', 'Strategy gamers', 'Entrepreneurs', 'Casual players'],
        interests: ['Business strategy', 'Economics', 'Investment', 'Management games', 'Empire building']
      },
      brandColors: {
        primary: '#3CA5E6',
        secondary: '#388E3C',
        accent: '#FAB58D',
        background: '#F5F5F5',
        text: '#212121'
      },
      visualStyle: 'Rich business aesthetics with gold and green colors, luxury imagery, corporate design elements, money and success symbols',
      tone: 'Ambitious, success-driven, professional, motivational',
      keywords: ['business', 'empire', 'rich', 'money', 'investment', 'strategy', 'tycoon', 'digital game', 'game']
    },
    {
      id: '1',
      appName: 'Instagram',
      genre: ['Social', 'Photography', 'Entertainment'],
      platform: ['iOS', 'Android', 'Web'],
      targetAudience: {
        ageRange: '13-45',
        demographics: ['Content creators', 'Social media users', 'Artists', 'Influencers'],
        interests: ['Photography', 'Art', 'Fashion', 'Travel', 'Food', 'Lifestyle']
      },
      brandColors: {
        primary: '#E4405F',
        secondary: '#F56040',
        accent: '#FCCC63',
        background: '#FAFAFA',
        text: '#262626'
      },
      visualStyle: 'Vibrant gradient backgrounds, clean typography, focus on visual content, modern and youthful aesthetic',
      tone: 'Creative, expressive, inclusive, inspiring',
      keywords: ['share', 'connect', 'express', 'discover', 'creative', 'community']
    },
    {
      id: '2',
      appName: 'Spotify',
      genre: ['Music', 'Entertainment', 'Audio'],
      platform: ['iOS', 'Android', 'Web', 'Desktop'],
      targetAudience: {
        ageRange: '16-55',
        demographics: ['Music lovers', 'Podcast listeners', 'Students', 'Commuters'],
        interests: ['Music', 'Podcasts', 'Entertainment', 'Discovery']
      },
      brandColors: {
        primary: '#1DB954',
        secondary: '#191414',
        accent: '#FFFFFF',
        background: '#121212',
        text: '#FFFFFF'
      },
      visualStyle: 'Dark theme with bright green accents, bold typography, album art focused, modern and sleek',
      tone: 'Passionate, energetic, accessible, music-focused',
      keywords: ['music', 'discovery', 'streaming', 'playlist', 'audio', 'entertainment']
    },
    {
      id: '5',
      appName: 'WhatsApp',
      genre: ['Communication', 'Social', 'Messaging'],
      platform: ['iOS', 'Android', 'Web', 'Desktop'],
      targetAudience: {
        ageRange: '13-70',
        demographics: ['Global users', 'Families', 'Business users', 'International communicators'],
        interests: ['Communication', 'Staying connected', 'International messaging', 'Group chats']
      },
      brandColors: {
        primary: '#25D366',
        secondary: '#128C7E',
        accent: '#34B7F1',
        background: '#FFFFFF',
        text: '#1F2937'
      },
      visualStyle: 'Clean green and white interface, simple icons, conversation-focused design, bubble chat layout',
      tone: 'Simple, reliable, secure, accessible',
      keywords: ['message', 'secure', 'simple', 'connect', 'reliable', 'global']
    },
    {
      id: '6',
      appName: 'Netflix',
      genre: ['Entertainment', 'Video', 'Streaming'],
      platform: ['iOS', 'Android', 'TV', 'Web'],
      targetAudience: {
        ageRange: '16-65',
        demographics: ['Entertainment seekers', 'Families', 'Binge watchers', 'Movie lovers'],
        interests: ['Movies', 'TV shows', 'Documentaries', 'International content', 'Original series']
      },
      brandColors: {
        primary: '#E50914',
        secondary: '#221F1F',
        accent: '#FFFFFF',
        background: '#000000',
        text: '#FFFFFF'
      },
      visualStyle: 'Dark background with red accents, cinematic imagery, content-focused design, poster thumbnails',
      tone: 'Entertaining, bold, cinematic, diverse',
      keywords: ['stream', 'watch', 'entertainment', 'original', 'unlimited', 'anywhere']
    }
  ];

  // Load real creative data for recommendations
  const [creativesData, setCreativesData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchCreatives = async () => {
      try {
        const response = await fetch('/api/creatives');
        const data = await response.json();
        setCreativesData(data.data || []);
      } catch (error) {
      }
    };
    
    fetchCreatives();
  }, []);


  // Function to get relevant insights based on selected app and real creative data
  const getRelevantRecommendations = (appId: string) => {
    const selectedApp = brandBooks.find(app => app.id === appId);
    if (!selectedApp || creativesData.length === 0) return { insights: [], topPerformers: [] };

    // Функция для проверки пересечения ключевых слов
    const getKeywordMatches = (creative: any, appKeywords: string[]) => {
      if (!creative.keywords) return { hasMatch: false, matches: [] };
      
      // Разбиваем строку keywords на массив
      const creativeKeywords = creative.keywords.toLowerCase().split(',').map((k: string) => k.trim());
      const appKeywordsLower = appKeywords.map(k => k.toLowerCase());
      
      // Находим все совпадения
      const matches: string[] = [];
      creativeKeywords.forEach((ck: string) => {
        appKeywordsLower.forEach(ak => {
          if (ck.includes(ak) || ak.includes(ck)) {
            if (!matches.includes(ak)) {
              matches.push(ak);
            }
          }
        });
      });
      
      return { hasMatch: matches.length > 0, matches };
    };

    // Фильтруем креативы по релевантности к выбранному приложению
    const relevantCreatives = creativesData
      .filter(creative => {
        // Базовый фильтр по CTR
        if (!creative.ctr || creative.ctr <= 0) return false;
        
        // Фильтр по пересечению ключевых слов с выбранным приложением
        const { hasMatch } = getKeywordMatches(creative, selectedApp.keywords);
        return hasMatch;
      })
      .map(creative => ({
        ...creative,
        keywordMatches: getKeywordMatches(creative, selectedApp.keywords).matches
      }))
      .sort((a, b) => (b.ctr || 0) - (a.ctr || 0));

    // Если нет релевантных креативов, показываем топ-креативы как fallback
    const topPerformers = relevantCreatives.length > 0 
      ? relevantCreatives.slice(0, 3)
      : creativesData
          .filter(creative => creative.ctr && creative.ctr > 0)
          .sort((a, b) => (b.ctr || 0) - (a.ctr || 0))
          .slice(0, 3);

    // Generate insights from relevant creative data
    const insights = topPerformers.slice(0, 3).map(creative => ({
      title: relevantCreatives.length > 0 
        ? `Relevant high-performer: ${creative.id.slice(0, 20)}...`
        : `Top performing creative: ${creative.id.slice(0, 20)}...`,
      description: creative.summary || 'High-performing creative',
      metric: 'CTR',
      value: creative.ctr || 0,
      relevance: relevantCreatives.length > 0 
        ? `Keyword match` 
        : 'General top performer',
      creative: creative // Добавляем полный объект креатива
    }));

    return { 
      insights, 
      topPerformers,
      isRelevant: relevantCreatives.length > 0,
      totalRelevant: relevantCreatives.length
    };
  };

  const [briefData, setBriefData] = useState({
    name: '',
    description: '',
    format: [],
    brand: {
      name: '',
      colors: ['#1e40af'],
      logo: '',
      guidelines: ''
    },
    targeting: {
      audience: '',
      ageRange: '',
      gender: 'all',
      interests: [],
      painPoints: [],
      benefits: []
    },
    content: {
      visualPrompt: '',
      copyPrompt: '',
      audioPrompt: '',
      customInstructions: ''
    },
    constraints: {
      duration: 30,
      aspectRatio: '9:16',
      fileSize: 10,
      safeArea: true,
      compliance: [],
      generationType: 'image',
      imageSettings: {
        width: 1024,
        height: 1024,
        quality: 'standard',
        seed: null,
        referenceImage: null as string | null,
        referenceImageName: null as string | null,
        includeLogo: false
      },
      videoSettings: {
        mode: 'single', // 'single' or 'multi'
        durationSeconds: 6,
        fps: 24,
        dimension: '1280x720',
        seed: null
      },
      textSettings: {
        maxTokens: 1024,
        temperature: 0.7,
        topP: 0.9,
        stopSequences: []
      }
    },
    references: {
      inspirations: [],
      competitorAds: [],
      assets: []
    }
  });

  const [promptTemplate, setPromptTemplate] = useState(defaultPromptTemplate);


  // Handle app selection and auto-populate brand data
  const handleAppSelection = (appId: string) => {
    setSelectedAppId(appId);
    const selectedApp = brandBooks.find(app => app.id === appId);
    
    if (selectedApp) {
      setBriefData(prev => ({
        ...prev,
        brand: {
          ...prev.brand,
          name: selectedApp.appName,
          colors: [selectedApp.brandColors.primary, selectedApp.brandColors.secondary, selectedApp.brandColors.accent],
          guidelines: `Visual Style: ${selectedApp.visualStyle}`
        },
        targeting: {
          ...prev.targeting,
          ageRange: selectedApp.targetAudience.ageRange,
          interests: selectedApp.targetAudience.interests,
          audience: selectedApp.targetAudience.demographics.join(', ')
        }
      }));

      // Auto-select first relevant creative for prompt
      const { insights } = getRelevantRecommendations(appId);
      if (insights.length > 0 && insights[0].creative) {
        setSelectedCreativeForPrompt(insights[0].creative);
      }
    }
  };

  const formats = ['video', 'banner', 'playable'];
  const aspectRatios = ['9:16', '16:9', '1:1', '4:5'];
  const durations = [10, 15, 30, 60];
  const complianceOptions = ['COPPA', 'GDPR', 'Platform Guidelines', 'Brand Safety'];

  const handleFormatToggle = (format: string) => {
    setBriefData(prev => ({
      ...prev,
      format: prev.format.includes(format)
        ? prev.format.filter(f => f !== format)
        : [...prev.format, format]
    }));
  };

  const addListItem = (category: 'interests' | 'painPoints' | 'benefits' | 'inspirations' | 'competitorAds' | 'assets' | 'compliance', value: string) => {
    if (!value.trim()) return;
    
    if (category === 'compliance') {
      setBriefData(prev => ({
        ...prev,
        constraints: {
          ...prev.constraints,
          [category]: [...prev.constraints[category], value]
        }
      }));
    } else if (['inspirations', 'competitorAds', 'assets'].includes(category)) {
      setBriefData(prev => ({
        ...prev,
        references: {
          ...prev.references,
          [category]: [...prev.references[category], value]
        }
      }));
    } else {
      setBriefData(prev => ({
        ...prev,
        targeting: {
          ...prev.targeting,
          [category]: [...prev.targeting[category], value]
        }
      }));
    }
  };

  const removeListItem = (category: 'interests' | 'painPoints' | 'benefits' | 'inspirations' | 'competitorAds' | 'assets' | 'compliance', index: number) => {
    if (category === 'compliance') {
      setBriefData(prev => ({
        ...prev,
        constraints: {
          ...prev.constraints,
          [category]: prev.constraints[category].filter((_, i) => i !== index)
        }
      }));
    } else if (['inspirations', 'competitorAds', 'assets'].includes(category)) {
      setBriefData(prev => ({
        ...prev,
        references: {
          ...prev.references,
          [category]: prev.references[category].filter((_, i) => i !== index)
        }
      }));
    } else {
      setBriefData(prev => ({
        ...prev,
        targeting: {
          ...prev.targeting,
          [category]: prev.targeting[category].filter((_, i) => i !== index)
        }
      }));
    }
  };

  const generatePrompt = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const generationType = briefData.constraints.generationType || 'image';
      const selectedApp = selectedAppId ? brandBooks.find(app => app.id === selectedAppId) : null;
      const { insights, topPerformers } = selectedAppId ? getRelevantRecommendations(selectedAppId) : { insights: [], topPerformers: [] };
      
      let generatedPrompt;
      
      // Always use full template first, then adjust for video if needed
      generatedPrompt = defaultPromptTemplate;
      
      if (selectedCreativeForPrompt) {
        const creativeContext = `${selectedCreativeForPrompt.summary || 'High-performing creative reference'}`;
        generatedPrompt = generatedPrompt + '\n\n' + creativeContext;
      }
      
      // Add reference image instructions if provided
      let customInstructions = briefData.content.customInstructions || '';
      if (generationType === 'image' && briefData.constraints.imageSettings.referenceImage) {
        if (briefData.constraints.imageSettings.includeLogo) {
          customInstructions = `Prominently include the brand logo from the reference image. ${customInstructions}`;
        } else {
          customInstructions = `Use the reference image as a style guide. ${customInstructions}`;
        }
      }
      
      // Convert HEX colors to color names
      const colorNames = briefData.brand.colors.length > 0 
        ? briefData.brand.colors.map(hexToColorName).join(', ')
        : 'blue';

      const replacements = {
        '{{generation_type}}': generationType,
        '{{brand_name}}': briefData.brand.name || 'Brand',
        '{{brand_colors}}': colorNames,
        '{{brand_guidelines}}': briefData.brand.guidelines || selectedApp?.visualStyle || 'Modern, clean design',
        '{{brand_tone}}': selectedApp?.tone || 'Professional, engaging',
        '{{custom_instructions}}': customInstructions
      };

      // Replace all placeholders
      Object.entries(replacements).forEach(([placeholder, value]) => {
        const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        generatedPrompt = generatedPrompt.replace(regex, value);
      });

      if (selectedApp && insights.length > 0) {
        const descriptions = insights
          .map(insight => insight.description)
          .filter(desc => desc && desc.length > 20)
          .filter(desc => {
            // Only include descriptions that are relevant to the current brand
            const brandName = (briefData.brand.name || selectedApp?.appName || '').toLowerCase();
            const appGenre = selectedApp.genre?.[0]?.toLowerCase() || '';
            const descLower = desc.toLowerCase();
            
            // Include if description contains brand-relevant keywords
            return brandName && (descLower.includes(brandName) || 
                   descLower.includes(appGenre) ||
                   (brandName.includes('solitaire') && descLower.includes('card')) ||
                   (brandName.includes('card') && descLower.includes('solitaire')) ||
                   (brandName.includes('business') && descLower.includes('business')));
          });
          
        if (descriptions.length > 0) {
          generatedPrompt += `\n\nStyle inspiration: ${descriptions.join(' ')}`;
        }
      }

      // No truncation - always use full prompt for all generation types

      // Update the brief data with generated prompt
      setBriefData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          visualPrompt: generatedPrompt
        }
      }));

      setIsGenerating(false);
    }, 500);
  };


  const startVideoPolling = async (bedrockJobId: string, panelJobId: string) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/generate/bedrock/status?jobId=${encodeURIComponent(bedrockJobId)}`);
        const result = await response.json();
        
        if (result.success && result.status === 'completed') {
          updateJob(panelJobId, {
            status: 'completed',
            result: {
              content: result.content,
              filename: result.filename,
              metadata: result.metadata
            }
          });
          return;
        } else if (result.status === 'failed') {
          updateJob(panelJobId, {
            status: 'failed',
            error: result.error || 'Video generation failed'
          });
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollStatus, 10000);
        } else {
          updateJob(panelJobId, {
            status: 'failed',
            error: 'Video generation is taking longer than expected'
          });
        }
      } catch (error) {
        updateJob(panelJobId, {
          status: 'failed',
          error: 'Error checking video status'
        });
      }
    };
    
    setTimeout(pollStatus, 10000);
  };

  const generateCreative = async (type?: 'image' | 'video' | 'text') => {
    // Use type from constraints if not provided
    const generationType = type || briefData.constraints.generationType;
    
    if (!briefData.content.visualPrompt && !briefData.brand.name) {
      alert('Please generate a prompt first or provide brand information');
      return;
    }

    // Check video prompt length limit
    if (generationType === 'video' && briefData.content.visualPrompt) {
      const maxChars = briefData.constraints.videoSettings?.mode === 'multi' ? 700 : 300;
      if (briefData.content.visualPrompt.length > maxChars) {
        alert(`Video prompt is too long (${briefData.content.visualPrompt.length} characters). Please reduce to ${maxChars} characters or less${briefData.constraints.videoSettings?.mode === 'multi' ? ' (Multi-Shot mode)' : ''}.`);
        return;
      }
    }

    const prompt = briefData.content.visualPrompt || 
      `Create a creative for ${briefData.brand.name || 'brand'} targeting ${briefData.targeting.ageRange || '18-45'} year olds interested in ${briefData.targeting.interests.join(', ') || 'mobile games'}`;

    // Add job to generation panel
    const jobId = addJob({
      type: generationType,
      prompt: prompt.substring(0, 300) + (prompt.length > 300 ? '...' : ''),
      status: 'processing'
    });

    // Removed setIsGeneratingCreative - allow parallel generations
    
    try {

      const response = await fetch('/api/generate/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          type: generationType,
          model: generationType === 'image' ? 'amazon.nova-canvas-v1:0' : 
                 generationType === 'video' ? 'amazon.nova-reel-v1:1' :
                 generationType === 'text' ? 'amazon.nova-pro-v1:0' : undefined,
          // Include model-specific settings
          settings: generationType === 'image' ? briefData.constraints.imageSettings :
                   generationType === 'video' ? briefData.constraints.videoSettings :
                   generationType === 'text' ? briefData.constraints.textSettings : {}
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate creative');
      }

      const result = await response.json();

      if (result.success) {
        if (result.status === 'processing' && generationType === 'video') {
          // Update job with polling info
          updateJob(jobId, { status: 'processing' });
          startVideoPolling(result.jobId, jobId);
        } else {
          // Update job with result
          updateJob(jobId, {
            status: 'completed',
            result: {
              content: result.content,
              filename: result.filename,
              metadata: result.metadata
            }
          });
        }
      } else {
        updateJob(jobId, {
          status: 'failed',
          error: result.error || 'Generation failed'
        });
      }
    } catch (error) {
      updateJob(jobId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      // Removed setIsGeneratingCreative - allow parallel generations
    }
  };

  const steps = [
    { id: 1, name: 'Basic Info', icon: FileText },
    { id: 2, name: 'Brand & Targeting', icon: Target },
    { id: 3, name: 'Constraints', icon: Settings },
    { id: 4, name: 'Prompt Builder', icon: Wand2 },
    { id: 5, name: 'Review', icon: Eye }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Brief</h1>
            <p className="text-gray-600">Build a comprehensive creative brief for AI generation</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button disabled={currentStep < 5}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit Brief
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors cursor-pointer ${
                  currentStep >= step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400'
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-4 rounded ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Start with the fundamentals of your creative brief</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brief Name</label>
                <input
                  type="text"
                  value={briefData.name}
                  onChange={(e) => setBriefData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., RPG Adventure - Q1 Campaign"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={briefData.description}
                  onChange={(e) => setBriefData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the creative campaign goals and approach"
                />
              </div>

            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Brand Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select App from Brand Books</label>
                  <Select value={selectedAppId} onValueChange={handleAppSelection}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose an app from your Brand Books..." />
                    </SelectTrigger>
                    <SelectContent>
                      {brandBooks.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          <div className="flex items-center space-x-3">
                            {app.logo && (
                              <img 
                                src={app.logo} 
                                alt={app.appName}
                                className="w-6 h-6 rounded object-cover"
                              />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium">{app.appName}</span>
                              <span className="text-xs text-gray-500">{app.genre.join(', ')}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedAppId && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-800">
                        <strong>Auto-populated from Brand Book:</strong> Brand colors, target audience, and guidelines have been automatically filled based on your selection.
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name (Auto-filled)</label>
                  <input
                    type="text"
                    value={briefData.brand.name}
                    onChange={(e) => setBriefData(prev => ({
                      ...prev,
                      brand: { ...prev.brand, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="Select an app to auto-fill or enter manually"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Colors</label>
                  <div className="flex space-x-2">
                    {briefData.brand.colors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...briefData.brand.colors];
                            newColors[index] = e.target.value;
                            setBriefData(prev => ({
                              ...prev,
                              brand: { ...prev.brand, colors: newColors }
                            }));
                          }}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBriefData(prev => ({
                        ...prev,
                        brand: { ...prev.brand, colors: [...prev.brand.colors, '#000000'] }
                      }))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Guidelines</label>
                  <textarea
                    value={briefData.brand.guidelines}
                    onChange={(e) => setBriefData(prev => ({
                      ...prev,
                      brand: { ...prev.brand, guidelines: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Key brand guidelines and restrictions"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Creative Recommendations
                </CardTitle>
                <CardDescription>
                  {selectedAppId ? 'AI-powered insights based on your selected app genre and successful patterns' : 'Select an app to see personalized creative recommendations'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedAppId ? (
                  (() => {
                    const { insights, topPerformers, isRelevant, totalRelevant } = getRelevantRecommendations(selectedAppId);
                    const selectedApp = brandBooks.find(app => app.id === selectedAppId);
                    
                    return (
                      <div className="space-y-6">
                        {/* App-specific header */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center space-x-3">
                            {selectedApp?.logo && (
                              <img 
                                src={selectedApp.logo} 
                                alt={selectedApp.appName}
                                className="w-8 h-8 rounded object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-blue-900">{selectedApp?.appName} Performance Insights</h4>
                              <p className="text-sm text-blue-700">
                                {isRelevant 
                                  ? `Found ${totalRelevant} relevant creative(s) matching your app keywords`
                                  : 'Showing general top performers (no keyword matches found)'
                                }
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-blue-600 font-medium">
                                Keywords: {selectedApp?.keywords?.slice(0, 3).join(', ')}
                              </div>
                              <div className={`text-xs font-semibold ${isRelevant ? 'text-green-600' : 'text-orange-600'}`}>
                                {isRelevant ? '✓ Matched' : '⚠ Fallback'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Creative Insights */}
                        {insights.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-gray-900">📊 Performance Insights</h5>
                              {selectedCreativeForPrompt && (
                                <Badge variant="default" className="text-xs">
                                  {selectedCreativeForPrompt.id.slice(0, 15)}... selected for prompt
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-3">
                              {insights.map((insight, idx) => (
                                <div 
                                  key={idx} 
                                  className={`border rounded-lg p-3 transition-colors cursor-pointer ${
                                    selectedCreativeForPrompt?.id === insight.creative.id 
                                      ? 'border-blue-500 bg-blue-50' 
                                      : 'border-gray-200 hover:bg-gray-50'
                                  }`}
                                  onClick={() => setSelectedCreativeForPrompt(insight.creative)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h6 className="font-medium text-gray-900">{insight.title}</h6>
                                        {selectedCreativeForPrompt?.id === insight.creative.id && (
                                          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                                            Selected for Prompt
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        <Badge 
                                          variant={insight.relevance?.includes('Match') ? 'default' : 'secondary'}
                                          className="text-xs"
                                        >
                                          {insight.relevance}
                                        </Badge>
                                        {insight.creative.keywordMatches && insight.creative.keywordMatches.map((keyword: string, kidx: number) => (
                                          <Badge key={kidx} variant="outline" className="text-xs bg-green-100 text-green-800">
                                            {keyword}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="ml-4 text-right">
                                      <div className="text-sm font-medium text-blue-600">
                                        {insight.metric}: {typeof insight.value === 'number' ? insight.value.toFixed(1) : insight.value}%
                                      </div>
                                      {selectedCreativeForPrompt?.id === insight.creative.id && (
                                        <div className="text-xs text-blue-500 mt-1">
                                          ✓ Will be used in prompt
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Top Performers */}
                        {topPerformers.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">🏆 Top Performing Creatives</h5>
                            <div className="space-y-3">
                              {topPerformers.slice(0, 2).map((creative) => (
                                <div key={creative.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h6 className="font-medium text-green-900">{creative.id.slice(0, 30)}...</h6>
                                      <p className="text-sm text-green-700 mt-1">{creative.summary || 'High-performing creative'}</p>
                                      <div className="flex gap-1 mt-2">
                                        {creative.keywords && creative.keywords.split(',').slice(0, 3).map((keyword, idx) => (
                                          <Badge key={idx} className="text-xs bg-green-100 text-green-800">
                                            {keyword.trim()}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="ml-4 text-right">
                                      <div className="text-sm font-bold text-green-600">
                                        CTR: {(creative.ctr || 0).toFixed(1)}%
                                      </div>
                                      <div className="text-xs text-green-500">CPI: ${(creative.cpi || 0).toFixed(2)}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Target Audience Summary (auto-filled) */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">📊 Target Audience (Auto-filled)</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Age Range:</span>
                              <span className="ml-2 text-gray-600">{selectedApp?.targetAudience.ageRange}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Demographics:</span>
                              <span className="ml-2 text-gray-600">{selectedApp?.targetAudience.demographics.join(', ')}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium text-gray-700">Interests:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedApp?.targetAudience.interests.map((interest, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Select an app from Brand Books to see personalized creative recommendations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Generation Settings & Constraints
              </CardTitle>
              <CardDescription>Choose generation type and configure model parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Generation Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Generation Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: 'image', icon: '🖼️', title: 'Generate Image', subtitle: 'Nova Canvas' },
                    { type: 'video', icon: '🎬', title: 'Generate Video', subtitle: 'Nova Reel' },
                    { type: 'text', icon: '📝', title: 'Generate Text', subtitle: 'Nova Pro' }
                  ].map(({ type, icon, title, subtitle }) => (
                    <button
                      key={type}
                      onClick={() => setBriefData(prev => ({
                        ...prev,
                        constraints: { ...prev.constraints, generationType: type }
                      }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        briefData.constraints.generationType === type
                          ? 'bg-blue-50 border-blue-500 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{icon}</div>
                      <div className="font-semibold text-sm">{title}</div>
                      <div className="text-xs text-gray-500">{subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Settings Based on Type */}
              {briefData.constraints.generationType === 'image' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">🖼️ Image Generation Settings (Nova Canvas)</h4>
                  <div className="space-y-4">
                    {/* Reference Image Upload */}
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-white">
                      <h5 className="font-medium text-gray-900 mb-2">📸 Reference Image (Optional)</h5>
                      <p className="text-sm text-gray-600 mb-3">Upload brand logo or reference image to include in the generated creative</p>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/png,image/jpeg';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setBriefData(prev => ({
                                    ...prev,
                                    constraints: {
                                      ...prev.constraints,
                                      imageSettings: {
                                        ...prev.constraints.imageSettings,
                                        referenceImage: reader.result as string,
                                        referenceImageName: file.name
                                      }
                                    }
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            };
                            input.click();
                          }}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        {briefData.constraints.imageSettings.referenceImageName && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">{briefData.constraints.imageSettings.referenceImageName}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setBriefData(prev => ({
                                ...prev,
                                constraints: {
                                  ...prev.constraints,
                                  imageSettings: {
                                    ...prev.constraints.imageSettings,
                                    referenceImage: null,
                                    referenceImageName: null
                                  }
                                }
                              }))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={briefData.constraints.imageSettings.includeLogo || false}
                            onChange={(e) => setBriefData(prev => ({
                              ...prev,
                              constraints: {
                                ...prev.constraints,
                                imageSettings: {
                                  ...prev.constraints.imageSettings,
                                  includeLogo: e.target.checked
                                }
                              }
                            }))}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">Include brand logo in the creative</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image Size</label>
                        <select
                          value={`${briefData.constraints.imageSettings.width}x${briefData.constraints.imageSettings.height}`}
                          onChange={(e) => {
                            const [width, height] = e.target.value.split('x').map(Number);
                            setBriefData(prev => ({
                              ...prev,
                              constraints: {
                                ...prev.constraints,
                                imageSettings: { 
                                  ...prev.constraints.imageSettings, 
                                  width,
                                  height
                                }
                              }
                            }));
                          }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="512x512">512x512 (Square)</option>
                        <option value="1024x1024">1024x1024 (Square)</option>
                        <option value="1024x768">1024x768 (4:3)</option>
                        <option value="768x1024">768x1024 (3:4)</option>
                        <option value="1024x576">1024x576 (16:9)</option>
                        <option value="576x1024">576x1024 (9:16)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seed (Optional)</label>
                      <input
                        type="number"
                        min="0"
                        max="858993459"
                        value={briefData.constraints.imageSettings.seed || ''}
                        onChange={(e) => setBriefData(prev => ({
                          ...prev,
                          constraints: {
                            ...prev.constraints,
                            imageSettings: { ...prev.constraints.imageSettings, seed: e.target.value ? parseInt(e.target.value) : null }
                          }
                        }))}
                        placeholder="Random if empty"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">For reproducible results (0-858,993,459)</p>
                    </div>
                  </div>
                  </div>
                </div>
              )}

              {briefData.constraints.generationType === 'video' && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-3">🎬 Video Generation Settings (Nova Reel 1.1)</h4>
                  <div className="space-y-4">
                    {/* Video Mode Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Video Mode</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setBriefData(prev => ({
                            ...prev,
                            constraints: {
                              ...prev.constraints,
                              videoSettings: { 
                                ...prev.constraints.videoSettings, 
                                mode: 'single',
                                durationSeconds: 6
                              }
                            }
                          }))}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            briefData.constraints.videoSettings.mode === 'single'
                              ? 'bg-purple-100 border-purple-500 text-purple-900'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold">Single Shot</div>
                          <div className="text-sm text-gray-600">6 seconds, ~90s generation</div>
                        </button>
                        
                        <button
                          onClick={() => setBriefData(prev => ({
                            ...prev,
                            constraints: {
                              ...prev.constraints,
                              videoSettings: { 
                                ...prev.constraints.videoSettings, 
                                mode: 'multi',
                                durationSeconds: 12
                              }
                            }
                          }))}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            briefData.constraints.videoSettings.mode === 'multi'
                              ? 'bg-purple-100 border-purple-500 text-purple-900'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold">Multi-Shot</div>
                          <div className="text-sm text-gray-600">12-120 seconds, ~14-17min generation</div>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Duration - only for multi-shot */}
                      {briefData.constraints.videoSettings.mode === 'multi' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
                          <select
                            value={briefData.constraints.videoSettings.durationSeconds}
                            onChange={(e) => setBriefData(prev => ({
                              ...prev,
                              constraints: {
                                ...prev.constraints,
                                videoSettings: { ...prev.constraints.videoSettings, durationSeconds: parseInt(e.target.value) }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            {[12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120].map(duration => (
                              <option key={duration} value={duration}>{duration}s ({duration/6} shots)</option>
                            ))}
                          </select>
                          <p className="text-xs text-gray-500 mt-1">Must be multiple of 6 (each shot is 6 seconds)</p>
                        </div>
                      )}
                      
                      {/* Seed */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Seed (Optional)</label>
                        <input
                          type="number"
                          min="0"
                          max="2147483646"
                          value={briefData.constraints.videoSettings.seed || ''}
                          onChange={(e) => setBriefData(prev => ({
                            ...prev,
                            constraints: {
                              ...prev.constraints,
                              videoSettings: { ...prev.constraints.videoSettings, seed: e.target.value ? parseInt(e.target.value) : null }
                            }
                          }))}
                          placeholder="Random if empty"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1">For reproducible results (0-2,147,483,646)</p>
                      </div>
                    </div>

                    {/* Fixed Parameters Info */}
                    <div className="bg-gray-100 p-3 rounded text-sm text-gray-600">
                      <div><strong>FPS:</strong> 24 (fixed)</div>
                      <div><strong>Resolution:</strong> 1280x720 (fixed)</div>
                      {briefData.constraints.videoSettings.mode === 'single' && (
                        <div><strong>Duration:</strong> 6 seconds (fixed)</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {briefData.constraints.generationType === 'text' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">📝 Text Generation Settings (Nova Pro)</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                      <select
                        value={briefData.constraints.textSettings.maxTokens}
                        onChange={(e) => setBriefData(prev => ({
                          ...prev,
                          constraints: {
                            ...prev.constraints,
                            textSettings: { ...prev.constraints.textSettings, maxTokens: parseInt(e.target.value) }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value={512}>512</option>
                        <option value={1024}>1024</option>
                        <option value={2048}>2048</option>
                        <option value={4096}>4096</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (0.0-1.0)</label>
                      <input
                        type="number"
                        min="0.0"
                        max="1.0"
                        step="0.1"
                        value={briefData.constraints.textSettings.temperature}
                        onChange={(e) => setBriefData(prev => ({
                          ...prev,
                          constraints: {
                            ...prev.constraints,
                            textSettings: { ...prev.constraints.textSettings, temperature: parseFloat(e.target.value) }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Top P (0.0-1.0)</label>
                      <input
                        type="number"
                        min="0.0"
                        max="1.0"
                        step="0.1"
                        value={briefData.constraints.textSettings.topP}
                        onChange={(e) => setBriefData(prev => ({
                          ...prev,
                          constraints: {
                            ...prev.constraints,
                            textSettings: { ...prev.constraints.textSettings, topP: parseFloat(e.target.value) }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="mr-2 h-5 w-5" />
                  AI Generation Ready
                </CardTitle>
                <CardDescription>Your creative brief is ready for AI generation using your Brand Book data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Brand Summary */}
                  {selectedAppId && (
                    (() => {
                      const selectedApp = brandBooks.find(app => app.id === selectedAppId);
                      const { insights, topPerformers } = getRelevantRecommendations(selectedAppId);
                      
                      return (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                          <div className="flex items-center space-x-4 mb-4">
                            {selectedApp?.logo && (
                              <img 
                                src={selectedApp.logo} 
                                alt={selectedApp.appName}
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div>
                              <h4 className="text-lg font-semibold text-blue-900">{selectedApp?.appName}</h4>
                              <p className="text-sm text-blue-700">Creative brief configured with Brand Book data</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Brand Colors</h5>
                              <div className="flex space-x-2">
                                {briefData.brand.colors.map((color, idx) => (
                                  <div key={idx} className="flex flex-col items-center">
                                    <div 
                                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                      style={{ backgroundColor: color }}
                                    />
                                    <span className="text-xs text-gray-600 mt-1">{color}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Target Audience</h5>
                              <p className="text-sm text-gray-700">{selectedApp?.targetAudience.ageRange} • {selectedApp?.targetAudience.demographics.join(', ')}</p>
                            </div>
                            
                            <div className="md:col-span-2">
                              <h5 className="font-medium text-gray-900 mb-2">Performance Insights Applied</h5>
                              <div className="flex flex-wrap gap-2">
                                {insights.slice(0, 2).map((insight, idx) => (
                                  <Badge key={idx} className="bg-green-100 text-green-800">
                                    {insight.metric}: {typeof insight.value === 'number' ? insight.value.toFixed(1) : insight.value}
                                  </Badge>
                                ))}
                                {topPerformers.slice(0, 1).map(creative => (
                                  <Badge key={creative.id} className="bg-blue-100 text-blue-800">
                                    Top: {creative.metrics?.ctr}% CTR
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}

                  {/* Generation Settings Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Generation Type</h5>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {briefData.constraints.generationType === 'image' && '🖼️'}
                          {briefData.constraints.generationType === 'video' && '🎬'}
                          {briefData.constraints.generationType === 'text' && '📝'}
                        </span>
                        <div>
                          <div className="font-medium">
                            {briefData.constraints.generationType === 'image' && 'Image'}
                            {briefData.constraints.generationType === 'video' && 'Video'}
                            {briefData.constraints.generationType === 'text' && 'Text'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {briefData.constraints.generationType === 'image' && 'Nova Canvas'}
                            {briefData.constraints.generationType === 'video' && `Nova Reel`}
                            {briefData.constraints.generationType === 'text' && 'Nova Pro'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {briefData.constraints.generationType === 'image' && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Image Settings</h5>
                        <div className="text-sm text-gray-700">
                          <div>{briefData.constraints.imageSettings.width}x{briefData.constraints.imageSettings.height}</div>
                          <div className="text-xs text-gray-500">Resolution</div>
                        </div>
                      </div>
                    )}

                    {briefData.constraints.generationType === 'video' && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Video Settings</h5>
                        <div className="text-sm text-gray-700">
                          <div className="capitalize">{briefData.constraints.videoSettings.mode} Shot</div>
                          <div className="text-xs text-gray-500">
                            {briefData.constraints.videoSettings.mode === 'multi' 
                              ? `${briefData.constraints.videoSettings.durationSeconds}s` 
                              : '6s'
                            }
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Brief Status</h5>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">Ready to Generate</span>
                      </div>
                    </div>
                  </div>

                  {/* Prompt Generation */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">AI Generation Prompt</h5>
                        {briefData.constraints.generationType === 'video' && (
                          <p className="text-xs text-orange-600 mt-1">
                            ⚠️ Video prompts are limited to {briefData.constraints.videoSettings?.mode === 'multi' ? '700' : '300'} characters 
                            {briefData.constraints.videoSettings?.mode === 'multi' ? ' (Multi-Shot mode)' : ' for optimal generation'}
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="outline"
                        onClick={generatePrompt}
                        disabled={isGenerating}
                        size="sm"
                      >
                        {isGenerating ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate from Brief
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <textarea
                      value={briefData.content.visualPrompt || ''}
                      onChange={(e) => {
                        setBriefData(prev => ({
                          ...prev,
                          content: { ...prev.content, visualPrompt: e.target.value }
                        }));
                      }}
                      rows={briefData.constraints.generationType === 'video' ? (briefData.constraints.videoSettings?.mode === 'multi' ? 6 : 3) : 8}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono ${
                        briefData.constraints.generationType === 'video' && (briefData.content.visualPrompt?.length || 0) > (briefData.constraints.videoSettings?.mode === 'multi' ? 700 : 300)
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder={briefData.constraints.generationType === 'video' 
                        ? `Video prompt (max ${briefData.constraints.videoSettings?.mode === 'multi' ? '700' : '300'} characters)...` 
                        : "Click 'Generate from Brief' to auto-fill or write your custom prompt here..."
                      }
                    />
                    
                    {briefData.constraints.generationType === 'video' && (() => {
                      const maxChars = briefData.constraints.videoSettings?.mode === 'multi' ? 700 : 300;
                      const warningChars = Math.floor(maxChars * 0.85); // 85% для предупреждения
                      const currentLength = briefData.content.visualPrompt?.length || 0;
                      
                      return (
                        <div className="mt-1 flex justify-between items-center">
                          {currentLength > maxChars && (
                            <span className="text-xs text-red-600">
                              ⚠️ Сократите на {currentLength - maxChars} символов
                            </span>
                          )}
                          <span className={`text-xs ml-auto ${
                            currentLength > maxChars ? 'text-red-600' : 
                            currentLength > warningChars ? 'text-orange-600' : 
                            'text-gray-500'
                          }`}>
                            {currentLength}/{maxChars} символов
                            {briefData.constraints.videoSettings?.mode === 'multi' && (
                              <span className="text-purple-600 ml-1">(Multi-Shot)</span>
                            )}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Custom Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Instructions (Optional)</label>
                    <textarea
                      value={briefData.content.customInstructions}
                      onChange={(e) => setBriefData(prev => ({
                        ...prev,
                        content: { ...prev.content, customInstructions: e.target.value }
                      }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any specific requirements or creative direction not covered above..."
                    />
                  </div>

                  {/* Generate Button */}
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => generateCreative()}
                      disabled={!briefData.content.visualPrompt && !briefData.brand.name}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        <span>
                          Generate {briefData.constraints.generationType === 'image' && 'Image'}
                          {briefData.constraints.generationType === 'video' && 'Video'}
                          {briefData.constraints.generationType === 'text' && 'Text'}
                        </span>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                Review & Submit
              </CardTitle>
              <CardDescription>Review your brief before submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Basic Information</h4>
                    <div className="mt-2 text-sm">
                      <div><strong>Name:</strong> {briefData.name || 'Not specified'}</div>
                      <div><strong>Description:</strong> {briefData.description || 'Not specified'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Brand & Targeting</h4>
                    <div className="mt-2 text-sm">
                      <div><strong>Brand:</strong> {briefData.brand.name || 'Not specified'}</div>
                      <div><strong>Audience:</strong> {briefData.targeting.audience || 'Not specified'}</div>
                      <div><strong>Age Range:</strong> {briefData.targeting.ageRange || 'Not specified'}</div>
                      <div><strong>Interests:</strong> {briefData.targeting.interests.join(', ') || 'None'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Constraints</h4>
                    <div className="mt-2 text-sm">
                      <div><strong>Duration:</strong> {briefData.constraints.duration}s</div>
                      <div><strong>Aspect Ratio:</strong> {briefData.constraints.aspectRatio}</div>
                      <div><strong>File Size:</strong> {briefData.constraints.fileSize}MB</div>
                      <div><strong>Safe Area:</strong> {briefData.constraints.safeArea ? 'Required' : 'Not required'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Validation</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        {briefData.name ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">Brief name provided</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {briefData.format.length > 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">Format selected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {briefData.brand.name ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">Brand information provided</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {briefData.content.visualPrompt ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">Prompt generated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="text-sm text-gray-600">
            Step {currentStep} of {steps.length}
          </div>
          
          <Button
            onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
            disabled={currentStep === steps.length}
          >
            Next
          </Button>
        </div>

        {/* Creative Generation Result Modal */}
        <Dialog open={showCreativeModal} onOpenChange={setShowCreativeModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Creative Generated Successfully!
              </DialogTitle>
              <DialogDescription>
                Your creative has been generated using AWS Bedrock AI. Preview it below.
              </DialogDescription>
            </DialogHeader>
            
            {generatedCreative && (
              <div className="space-y-4">
                {/* Metadata */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {generatedCreative.type}
                    </div>
                    <div>
                      <span className="font-medium">Model:</span> {generatedCreative.metadata?.model}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Generated at:</span> {generatedCreative.timestamp}
                    </div>
                  </div>
                </div>

                {/* Content Display */}
                <div className="border rounded-lg p-4">
                  {generatedCreative.type === 'image' ? (
                    <div className="text-center">
                      <img 
                        src={`data:image/png;base64,${generatedCreative.content}`}
                        alt="Generated creative"
                        className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                        style={{ maxHeight: '700px' }}
                      />
                      <div className="mt-4">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = `data:image/png;base64,${generatedCreative.content}`;
                            link.download = generatedCreative.filename || 'generated-creative.png';
                            link.click();
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Image
                        </Button>
                      </div>
                    </div>
                  ) : generatedCreative.type === 'video' ? (
                    <div className="text-center">
                      <video 
                        controls 
                        className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                        style={{ maxHeight: '600px' }}
                      >
                        <source 
                          src={
                            generatedCreative.content 
                              ? generatedCreative.content.startsWith('http') || generatedCreative.content.startsWith('/')
                                ? generatedCreative.content 
                                : `data:video/mp4;base64,${generatedCreative.content}`
                              : ''
                          } 
                          type="video/mp4" 
                        />
                        Your browser does not support the video tag.
                      </video>
                      <div className="mt-4">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            if (generatedCreative.content && generatedCreative.content.startsWith('http')) {
                              // It's a presigned URL, fetch and download
                              fetch(generatedCreative.content)
                                .then(response => response.blob())
                                .then(blob => {
                                  const url = window.URL.createObjectURL(blob);
                                  link.href = url;
                                  link.download = generatedCreative.filename || 'generated-video.mp4';
                                  link.click();
                                  window.URL.revokeObjectURL(url);
                                });
                            } else {
                              // It's base64 content
                              link.href = `data:video/mp4;base64,${generatedCreative.content}`;
                              link.download = generatedCreative.filename || 'generated-video.mp4';
                              link.click();
                            }
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Video
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium mb-2">Generated Content:</h4>
                      <div className="bg-white p-4 border rounded max-h-96 overflow-y-auto whitespace-pre-wrap">
                        {generatedCreative.content}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setShowCreativeModal(false)}>
                    Close
                  </Button>
                  <Button 
                    onClick={() => generateCreative()}
                    disabled={isGeneratingCreative}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-lg border border-slate-700 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      {isGeneratingCreative ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {briefData.constraints.generationType === 'image' && '🖼️'}
                            {briefData.constraints.generationType === 'video' && '🎬'}
                            {briefData.constraints.generationType === 'text' && '📝'}
                          </span>
                          <span>
                            {briefData.constraints.generationType === 'image' && 'Generate Another'}
                            {briefData.constraints.generationType === 'video' && 'Generate Another'}
                            {briefData.constraints.generationType === 'text' && 'Generate Another'}
                          </span>
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Generation Panel */}
      <GenerationPanel
        jobs={jobs}
        onRemoveJob={removeJob}
        onViewResult={(job) => {
          if (job.result) {
            setGeneratedCreative({
              type: job.type,
              content: job.result.content,
              filename: job.result.filename,
              metadata: job.result.metadata,
              timestamp: job.endTime?.toISOString() || new Date().toISOString()
            });
            setShowCreativeModal(true);
          }
        }}
      />
    </Layout>
  );
}