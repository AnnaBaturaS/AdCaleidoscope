'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus,
  FileText,
  Zap,
  Copy,
  Edit,
  Play,
  MoreHorizontal,
  Calendar,
  User,
  Target,
  Palette,
  Video,
  Image,
  Gamepad2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const mockBriefs = [
  {
    id: 'brief-001',
    name: 'RPG Adventure - Q1 Campaign',
    description: 'Fantasy RPG targeting core gamers with epic storytelling',
    status: 'approved',
    format: ['video', 'playable'],
    brand: {
      name: 'Epic Quest Studios',
      colors: ['#1e40af', '#dc2626', '#facc15'],
      logo: '/logos/epic-quest.png'
    },
    targeting: {
      audience: 'Core RPG Gamers',
      ageRange: '18-35',
      interests: ['Fantasy', 'RPG', 'Mobile Gaming', 'Storytelling'],
      painPoints: ['Repetitive gameplay', 'Lack of story depth', 'Pay-to-win mechanics'],
      benefits: ['Rich storyline', 'Character progression', 'Fair monetization']
    },
    constraints: {
      duration: 30,
      aspectRatio: '9:16',
      fileSize: 10,
      safeArea: true
    },
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-26T14:30:00Z',
    createdBy: 'Sarah Chen',
    generatedCreatives: ['creative-001', 'creative-002', 'creative-003']
  },
  {
    id: 'brief-002',
    name: 'Casual Puzzle - Social Media Push',
    description: 'Light puzzle game for social media platforms',
    status: 'in_production',
    format: ['video', 'banner'],
    brand: {
      name: 'Puzzle Mania',
      colors: ['#f59e0b', '#10b981', '#8b5cf6'],
      logo: '/logos/puzzle-mania.png'
    },
    targeting: {
      audience: 'Casual Mobile Gamers',
      ageRange: '25-45',
      interests: ['Puzzle Games', 'Casual Gaming', 'Social Media'],
      painPoints: ['Complex controls', 'Time commitment', 'Stressful gameplay'],
      benefits: ['Simple mechanics', 'Quick sessions', 'Relaxing experience']
    },
    constraints: {
      duration: 15,
      aspectRatio: '1:1',
      fileSize: 5,
      safeArea: false
    },
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-28T11:45:00Z',
    createdBy: 'Mark Johnson',
    generatedCreatives: ['creative-004', 'creative-005']
  },
  {
    id: 'brief-003',
    name: 'Strategy Game - Premium Positioning',
    description: 'Complex strategy game for hardcore strategy fans',
    status: 'draft',
    format: ['video', 'playable', 'banner'],
    brand: {
      name: 'War Tactics Inc',
      colors: ['#374151', '#dc2626', '#fbbf24'],
      logo: '/logos/war-tactics.png'
    },
    targeting: {
      audience: 'Strategy Game Enthusiasts',
      ageRange: '25-50',
      interests: ['Strategy Games', 'Military History', 'Tactical Thinking'],
      painPoints: ['Simplified mechanics', 'Lack of depth', 'Poor AI'],
      benefits: ['Complex strategy', 'Realistic warfare', 'Advanced AI']
    },
    constraints: {
      duration: 60,
      aspectRatio: '16:9',
      fileSize: 20,
      safeArea: true
    },
    createdAt: '2024-01-28T16:20:00Z',
    updatedAt: '2024-01-28T16:20:00Z',
    createdBy: 'Alex Rodriguez',
    generatedCreatives: []
  }
];

const mockTemplates = [
  {
    id: 'template-001',
    name: 'Mobile RPG Standard',
    category: 'video',
    description: 'Standard template for mobile RPG games with character focus',
    usageCount: 127,
    avgCTR: 4.2,
    tags: ['RPG', 'Character-driven', 'Fantasy']
  },
  {
    id: 'template-002',
    name: 'Casual Game UGC Style',
    category: 'video',
    description: 'User-generated content style for casual games',
    usageCount: 89,
    avgCTR: 5.1,
    tags: ['Casual', 'UGC', 'Authentic']
  },
  {
    id: 'template-003',
    name: 'Playable Game Demo',
    category: 'playable',
    description: 'Interactive demo template for mobile games',
    usageCount: 156,
    avgCTR: 6.8,
    tags: ['Interactive', 'Gameplay', 'Demo']
  },
  {
    id: 'template-004',
    name: 'Strategy Game Showcase',
    category: 'video',
    description: 'Epic showcase template for strategy games',
    usageCount: 43,
    avgCTR: 3.9,
    tags: ['Strategy', 'Epic', 'Cinematic']
  }
];

export default function BriefsPage() {
  const [selectedTab, setSelectedTab] = useState('briefs');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_production':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_production':
        return <Play className="h-4 w-4" />;
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'review':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'banner':
        return <Image className="h-4 w-4" />;
      case 'playable':
        return <Gamepad2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredBriefs = mockBriefs.filter(brief => {
    if (statusFilter === 'all') return true;
    return brief.status === statusFilter;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Creative Briefs</h1>
            <p className="text-gray-600">Create and manage creative briefs for AI generation</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              Import Brief
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Brief
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">28</div>
              <div className="text-sm text-gray-600">Total Briefs</div>
              <div className="text-xs text-gray-500 mt-1">12 active</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-sm text-gray-600">Creatives Generated</div>
              <div className="text-xs text-green-600 mt-1">+23 this week</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">4.2%</div>
              <div className="text-sm text-gray-600">Avg CTR</div>
              <div className="text-xs text-green-600 mt-1">+0.3% vs average</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">15</div>
              <div className="text-sm text-gray-600">Templates</div>
              <div className="text-xs text-gray-500 mt-1">Available</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="briefs">My Briefs</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="briefs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="in_production">In Production</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredBriefs.map((brief) => (
                <Card key={brief.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-xl">{brief.name}</CardTitle>
                          <Badge className={getStatusColor(brief.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(brief.status)}
                              <span>{brief.status.replace('_', ' ')}</span>
                            </div>
                          </Badge>
                        </div>
                        <CardDescription>{brief.description}</CardDescription>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{brief.createdBy}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(brief.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{brief.targeting.audience}</span>
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Brief
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Zap className="mr-2 h-4 w-4" />
                            Generate Creative
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Formats & Brand</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">Formats:</span>
                            <div className="flex space-x-2 mt-1">
                              {brief.format.map(format => (
                                <Badge key={format} variant="secondary" className="flex items-center space-x-1">
                                  {getFormatIcon(format)}
                                  <span>{format}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-sm text-gray-500">Brand:</span>
                            <div className="mt-1">
                              <div className="font-medium text-sm">{brief.brand.name}</div>
                              <div className="flex items-center space-x-1 mt-1">
                                <Palette className="h-3 w-3 text-gray-400" />
                                <div className="flex space-x-1">
                                  {brief.brand.colors.map((color, index) => (
                                    <div
                                      key={index}
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Targeting & Audience</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">Demographics:</span>
                            <div className="text-sm mt-1">
                              <div>{brief.targeting.ageRange} years old</div>
                              <div className="text-gray-600">{brief.targeting.audience}</div>
                            </div>
                          </div>

                          <div>
                            <span className="text-sm text-gray-500">Key Interests:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {brief.targeting.interests.slice(0, 3).map(interest => (
                                <Badge key={interest} variant="outline" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                              {brief.targeting.interests.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{brief.targeting.interests.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Constraints & Output</h4>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <div className="font-medium">{brief.constraints.duration}s</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Aspect:</span>
                              <div className="font-medium">{brief.constraints.aspectRatio}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Size:</span>
                              <div className="font-medium">{brief.constraints.fileSize}MB</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Safe Area:</span>
                              <div className="font-medium">{brief.constraints.safeArea ? 'Yes' : 'No'}</div>
                            </div>
                          </div>

                          <div>
                            <span className="text-sm text-gray-500">Generated:</span>
                            <div className="text-lg font-semibold text-blue-600">
                              {brief.generatedCreatives.length} creatives
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Last updated: {new Date(brief.updatedAt).toLocaleString()}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          {brief.status === 'approved' && (
                            <Button size="sm">
                              <Zap className="mr-2 h-4 w-4" />
                              Generate Creative
                            </Button>
                          )}
                          {brief.status === 'draft' && (
                            <Button size="sm">
                              <Edit className="mr-2 h-4 w-4" />
                              Continue Editing
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBriefs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No briefs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {statusFilter === 'all' 
                    ? 'Create your first creative brief to get started.' 
                    : `No ${statusFilter} briefs found.`}
                </p>
                <div className="mt-6">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Brief
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          {getFormatIcon(template.category)}
                          <span>{template.name}</span>
                        </CardTitle>
                        <CardDescription className="mt-2">{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Usage:</span>
                          <div className="font-medium">{template.usageCount} times</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg CTR:</span>
                          <div className="font-medium">{template.avgCTR}%</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}