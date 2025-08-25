'use client';

import { use } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Copy, 
  Download, 
  Share, 
  Edit,
  BarChart3,
  Tag,
  History,
  Target,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Eye
} from 'lucide-react';

const mockCreative = {
  id: '1',
  name: 'Adventure Quest - Hero Intro',
  format: 'video',
  duration: 15,
  status: 'active',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-16T14:20:00Z',
  version: 3,
  urls: {
    preview: '/api/placeholder/600/400',
    source: '/assets/adventure-quest-hero-intro.mp4',
    thumbnail: '/api/placeholder/300/200'
  },
  tags: {
    hook: 'gameplay',
    style: 'bold',
    cta: 'play_now',
    color: 'blue',
    intro_pace: 'fast',
    lang: 'en',
    has_voiceover: true,
    has_text_overlay: true,
    brand_visibility: 'high'
  },
  network: ['Facebook', 'Google', 'TikTok'],
  metrics: {
    impressions: 125000,
    clicks: 4750,
    installs: 567,
    ctr: 3.8,
    ipm: 45.2,
    cpi: 2.34,
    spend: 1327,
    cvr: 11.9,
    retention_d1: 68.5,
    retention_d7: 32.1
  },
  parentId: null,
  generatedFrom: 'brief-12',
  isVariation: false
};

const mockVariations = [
  {
    id: '1a',
    name: 'Adventure Quest - Hero Intro (Red CTA)',
    version: 1,
    changes: ['cta_color: red', 'cta_text: Download Now'],
    metrics: { cpi: 2.89, ipm: 38.7, ctr: 3.2 },
    status: 'testing'
  },
  {
    id: '1b',
    name: 'Adventure Quest - Hero Intro (Fast Pace)',
    version: 1,
    changes: ['intro_pace: very_fast', 'duration: 10s'],
    metrics: { cpi: 2.12, ipm: 52.1, ctr: 4.1 },
    status: 'active'
  }
];

const mockAnalysis = {
  patternFactors: [
    {
      factor: 'Gameplay Hook',
      presence: true,
      strength: 0.85,
      contribution: 23.4,
      impact: '+18% CTR'
    },
    {
      factor: 'Bold Visual Style',
      presence: true,
      strength: 0.72,
      contribution: 15.8,
      impact: '+12% IPM'
    },
    {
      factor: 'Fast Intro Pace',
      presence: true,
      strength: 0.93,
      contribution: 31.2,
      impact: '+25% Retention'
    },
    {
      factor: 'High Brand Visibility',
      presence: true,
      strength: 0.68,
      contribution: 8.9,
      impact: '+5% CVR'
    }
  ],
  predictedPerformance: {
    ctr: 4.2,
    ipm: 48.5,
    cpi: 2.15,
    confidence: 87
  },
  recommendations: [
    'Consider testing a countdown timer overlay to increase urgency',
    'Try reducing brand visibility slightly to improve CTR',
    'Test different CTA colors - red or orange may perform better'
  ],
  warnings: [
    'Current CPI is 8% above target threshold',
    'Retention D7 could be improved with longer engagement'
  ]
};

interface CreativeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CreativeDetailPage({ params }: CreativeDetailPageProps) {
  const { id } = use(params);

  const formatIcon = (format: string) => {
    switch (format) {
      case 'video':
        return <Play className="h-5 w-5" />;
      case 'playable':
        return <Target className="h-5 w-5" />;
      case 'banner':
        return <Eye className="h-5 w-5" />;
      default:
        return <Eye className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'testing':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              {formatIcon(mockCreative.format)}
              <h1 className="text-3xl font-bold text-gray-900">{mockCreative.name}</h1>
              <Badge className={`${getStatusColor(mockCreative.status)}`}>
                {mockCreative.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Version {mockCreative.version}</span>
              <span>•</span>
              <span>{mockCreative.duration}s duration</span>
              <span>•</span>
              <span>Created {new Date(mockCreative.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Create Variation
            </Button>
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600">Video Preview</p>
                    <p className="text-sm text-gray-500">{mockCreative.format} • {mockCreative.duration}s</p>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <Button>
                    <Play className="mr-2 h-4 w-4" />
                    Play Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="variations">Variations</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-900">${mockCreative.metrics.cpi}</div>
                      <div className="text-sm text-gray-600">CPI</div>
                      <div className="flex items-center text-xs text-red-600 mt-1">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        8% above target
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-900">{mockCreative.metrics.ipm}</div>
                      <div className="text-sm text-gray-600">IPM</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        12% vs average
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-900">{mockCreative.metrics.ctr}%</div>
                      <div className="text-sm text-gray-600">CTR</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        5% vs average
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-900">${mockCreative.metrics.spend}</div>
                      <div className="text-sm text-gray-600">Total Spend</div>
                      <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Metrics</CardTitle>
                    <CardDescription>Complete performance breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm text-gray-600">Impressions</div>
                        <div className="text-lg font-semibold">{mockCreative.metrics.impressions.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Clicks</div>
                        <div className="text-lg font-semibold">{mockCreative.metrics.clicks.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Installs</div>
                        <div className="text-lg font-semibold">{mockCreative.metrics.installs}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">CVR</div>
                        <div className="text-lg font-semibold">{mockCreative.metrics.cvr}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Retention D1</div>
                        <div className="text-lg font-semibold">{mockCreative.metrics.retention_d1}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Retention D7</div>
                        <div className="text-lg font-semibold">{mockCreative.metrics.retention_d7}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pattern Analysis</CardTitle>
                    <CardDescription>AI-identified factors contributing to performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAnalysis.patternFactors.map((factor, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{factor.factor}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>Strength: {Math.round(factor.strength * 100)}%</span>
                              <span>Contribution: {factor.contribution}%</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">{factor.impact}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {mockAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Warnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {mockAnalysis.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="variations" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Variations ({mockVariations.length})</h3>
                  <Button size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Create New Variation
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockVariations.map((variation) => (
                    <Card key={variation.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{variation.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                              <Badge variant="outline">v{variation.version}</Badge>
                              <Badge className={`${getStatusColor(variation.status)}`}>
                                {variation.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              Changes: {variation.changes.join(', ')}
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="text-center">
                              <div className="font-medium">${variation.metrics.cpi}</div>
                              <div className="text-gray-500 text-xs">CPI</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{variation.metrics.ipm}</div>
                              <div className="text-gray-500 text-xs">IPM</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{variation.metrics.ctr}%</div>
                              <div className="text-gray-500 text-xs">CTR</div>
                            </div>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Version History</CardTitle>
                    <CardDescription>Changes and updates to this creative</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Version 3</span>
                            <Badge variant="outline">Current</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Updated CTA color and positioning</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(mockCreative.updatedAt).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Version 2</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Added voiceover and improved text overlay</p>
                          <p className="text-xs text-gray-500 mt-1">Jan 15, 2024 at 2:15 PM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Version 1</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Initial creation from brief-12</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(mockCreative.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  Tags & Attributes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Hook</label>
                    <div className="mt-1">
                      <Badge>{mockCreative.tags.hook}</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Style</label>
                    <div className="mt-1">
                      <Badge>{mockCreative.tags.style}</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">CTA</label>
                    <div className="mt-1">
                      <Badge>{mockCreative.tags.cta}</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pace</label>
                    <div className="mt-1">
                      <Badge>{mockCreative.tags.intro_pace}</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Features</label>
                    <div className="mt-1 space-y-1">
                      {mockCreative.tags.has_voiceover && <Badge variant="outline">Voiceover</Badge>}
                      {mockCreative.tags.has_text_overlay && <Badge variant="outline">Text Overlay</Badge>}
                      <Badge variant="outline">Brand: {mockCreative.tags.brand_visibility}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Networks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockCreative.network.map((network) => (
                    <div key={network} className="flex items-center justify-between">
                      <span className="text-sm">{network}</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate Creative
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Campaign
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Download Assets
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <History className="mr-2 h-4 w-4" />
                    View All Versions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}