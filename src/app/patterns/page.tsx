'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  BarChart3, 
  Lightbulb,
  Target,
  Filter,
  Search,
  Download,
  Clock,
  Tag,
  ChevronDown
} from 'lucide-react';


interface ProcessedCreative {
  id: string;
  name: string;
  format: string;
  urls: {
    preview: string;
    source?: string;
    thumbnail: string;
  };
  tags: {
    hook?: string;
    style?: string;
    cta?: string;
    color?: string;
    intro_pace?: string;
    lang?: string;
    duration?: number;
    has_voiceover?: boolean;
    has_text_overlay?: boolean;
    brand_visibility?: string;
  };
  version: number;
  network: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  metrics: {
    impressions: number;
    clicks: number;
    installs: number;
    ctr: number;
    ipm: number;
    cpi: number;
    spend: number;
    cvr: number;
    retention_d1: number;
    retention_d7: number;
  };
  generatedFrom?: string;
  isVariation: boolean;
  keywords?: string[];
  target_audience?: string;
  summary?: string;
  hook_text?: string;
  scenes?: string[];
  suggestions?: string[];
}


export default function PatternsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [creatives, setCreatives] = useState<ProcessedCreative[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters for creatives
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [metricSortBy, setMetricSortBy] = useState<'ctr' | 'cpi' | 'ipm' | 'spend'>('ctr');

  useEffect(() => {
    const fetchCreatives = async () => {
      try {
        const response = await fetch('/api/creatives');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.data && Array.isArray(data.data)) {
            setCreatives(data.data);
          }
        }
      } catch (error) {
        console.error('Error loading creatives:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatives();
  }, []);


  
  const filteredCreatives = creatives.filter(creative => {
    const matchesSearch = searchTerm === '' || 
      (creative.id && creative.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (creative.summary && creative.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (creative.keywords && creative.keywords.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (creative.hook && creative.hook.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFormat = formatFilter === 'all' || formatFilter === 'video';
    const matchesStatus = statusFilter === 'all' || statusFilter === 'active';
    
    return matchesSearch && matchesFormat && matchesStatus;
  }).sort((a, b) => {
    if (metricSortBy === 'cpi') {
      return (a.cpi || 0) - (b.cpi || 0);
    } else if (metricSortBy === 'ctr') {
      return (b.ctr || 0) - (a.ctr || 0);
    } else if (metricSortBy === 'ipm') {
      return (b.ipm || 0) - (a.ipm || 0);
    } else if (metricSortBy === 'spend') {
      return (b.spend || 0) - (a.spend || 0);
    }
    return 0;
  });


  // Get unique values for filters
  const uniqueFormats = ['video'];
  const uniqueStatuses = ['active'];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pattern Analysis</h1>
            <p className="text-gray-600">Discover what makes creatives perform better</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Insights
            </Button>
            <Button>
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate Recommendations
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{creatives.length}</div>
              <div className="text-sm text-gray-600">Total Creatives</div>
              <div className="text-xs text-gray-500 mt-1">Real data analysis</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">
                {creatives.length > 0 ? (creatives.reduce((sum, c) => sum + (c.ctr || 0), 0) / creatives.length).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Avg CTR</div>
              <div className="text-xs text-gray-500 mt-1">Across all creatives</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">
                ${creatives.length > 0 ? (creatives.reduce((sum, c) => sum + (c.cpi || 0), 0) / creatives.length).toFixed(2) : 0}
              </div>
              <div className="text-sm text-gray-600">Avg CPI</div>
              <div className="text-xs text-gray-500 mt-1">Cost per install</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">
                {creatives.length > 0 ? (creatives.reduce((sum, c) => sum + (c.ipm || 0), 0) / creatives.length).toFixed(1) : 0}
              </div>
              <div className="text-sm text-gray-600">Avg IPM</div>
              <div className="text-xs text-gray-500 mt-1">Installs per mille</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="creatives" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="creatives">Creative Analysis</TabsTrigger>
          </TabsList>


          <TabsContent value="creatives" className="space-y-6">
            {/* Filters for Creatives */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Search className="mr-2 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search creatives..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-none outline-none bg-transparent placeholder-gray-500 text-sm w-40"
                  />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Format: {formatFilter === 'all' ? 'All' : formatFilter.charAt(0).toUpperCase() + formatFilter.slice(1)}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFormatFilter('all')}>
                      All Formats
                    </DropdownMenuItem>
                    {uniqueFormats.map(format => (
                      <DropdownMenuItem key={format} onClick={() => setFormatFilter(format)}>
                        {format.charAt(0).toUpperCase() + format.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                      All Statuses
                    </DropdownMenuItem>
                    {uniqueStatuses.map(status => (
                      <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Sort: {metricSortBy.toUpperCase()}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setMetricSortBy('ctr')}>
                      CTR (Click-Through Rate)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMetricSortBy('cpi')}>
                      CPI (Cost Per Install)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMetricSortBy('ipm')}>
                      IPM (Installs Per Mille)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMetricSortBy('spend')}>
                      Spend
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {filteredCreatives.length} of {creatives.length} creatives
                </span>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p>Loading creatives data...</p>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {filteredCreatives.map((creative) => (
                  <Dialog key={creative.id}>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-12 gap-4 items-start text-xs">
                            {/* Basic Info - 3 cols */}
                            <div className="col-span-3">
                              <div className="font-medium text-sm mb-1 line-clamp-2">{creative.summary}</div>
                              <div className="flex items-center gap-1 mb-2">
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  video
                                </Badge>
                                <Badge variant="default" className="text-xs px-1 py-0">
                                  active
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-600">
                                {(creative.duration_s || 0).toFixed(1)}s • ID: {creative.id.slice(0, 8)}...
                              </div>
                            </div>

                            {/* Hook & CTA - 2 cols */}
                            <div className="col-span-2">
                              <div className="font-medium text-xs text-gray-700 mb-1">Hook:</div>
                              <div className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {creative.hook || 'N/A'}
                              </div>
                              <div className="font-medium text-xs text-gray-700 mb-1">CTA:</div>
                              <div className="text-xs text-blue-600">
                                {creative.cta || 'N/A'}
                              </div>
                            </div>

                            {/* Target Audience - 2 cols */}
                            <div className="col-span-2">
                              <div className="font-medium text-xs text-gray-700 mb-1">Audience:</div>
                              <div className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {creative.target_audience}
                              </div>
                              {/* Success Probability */}
                              <div className="font-medium text-xs text-gray-700 mb-1">Success Probability:</div>
                              <div className="bg-green-50 rounded px-2 py-1 text-center">
                                <div className="font-semibold text-xs text-green-700">{creative.probability_success || '0'}%</div>
                              </div>
                            </div>

                            {/* Keywords - 2 cols */}
                            <div className="col-span-2">
                              <div className="font-medium text-xs text-gray-700 mb-1">Keywords:</div>
                              <div className="flex flex-wrap gap-1">
                                {creative.keywords && creative.keywords.split(', ').slice(0, 3).map((keyword, index) => (
                                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                    {keyword.trim()}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Metrics - 3 cols */}
                            <div className="col-span-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-center">
                                  <div className="font-semibold text-xs">{(creative.ctr || 0).toFixed(1)}%</div>
                                  <div className="text-xs text-gray-500">CTR</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-xs">${(creative.cpi || 0).toFixed(2)}</div>
                                  <div className="text-xs text-gray-500">CPI</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-xs">{(creative.ipm || 0).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">IPM</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-xs">${(creative.spend || 0).toFixed(0)}</div>
                                  <div className="text-xs text-gray-500">Spend</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-full w-[98vw] max-h-[95vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <span>{creative.summary}</span>
                          <Badge variant="secondary">video</Badge>
                          <Badge variant="default">active</Badge>
                        </DialogTitle>
                        <DialogDescription>
                          Detailed analysis of creative performance and patterns
                        </DialogDescription>
                      </DialogHeader>

                      {/* Performance Analytics */}
                      <div className="border rounded-lg p-4 mb-6">
                        <h3 className="font-medium mb-4 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Performance Analytics
                        </h3>
                        
                        {/* Row 1: Core Metrics */}
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-xl font-bold text-blue-700">{(creative.ctr || 0).toFixed(1)}%</div>
                            <div className="text-sm text-blue-600">CTR</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-xl font-bold text-green-700">${(creative.cpi || 0).toFixed(2)}</div>
                            <div className="text-sm text-green-600">CPI</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-xl font-bold text-purple-700">{(creative.ipm || 0).toFixed(1)}</div>
                            <div className="text-sm text-purple-600">IPM</div>
                          </div>
                        </div>
                        
                        {/* Row 2: File & Technical Info */}
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-gray-700">{(creative.duration_s || 0).toFixed(1)}s</div>
                            <div className="text-sm text-gray-600">Duration</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-gray-700">{(creative.fps || 0).toFixed(0)}</div>
                            <div className="text-sm text-gray-600">FPS</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-gray-700">{(creative.filesize_mb || 0).toFixed(1)}MB</div>
                            <div className="text-sm text-gray-600">File Size</div>
                          </div>
                        </div>
                        
                        {/* Row 3: Success Metrics */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-xl font-bold text-orange-700">${(creative.spend || 0).toFixed(0)}</div>
                            <div className="text-sm text-orange-600">Total Spend</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-xl font-bold text-yellow-700">{creative.probability_success || '0'}%</div>
                            <div className="text-sm text-yellow-600">Success Probability</div>
                          </div>
                          <div className="text-center p-3 bg-indigo-50 rounded-lg">
                            <div className="text-xl font-bold text-indigo-700">{(creative.bitrate_mbps || 0).toFixed(1)}</div>
                            <div className="text-sm text-indigo-600">Bitrate (Mbps)</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">

                          {/* Networks */}
                          <div className="border rounded p-3">
                            <h3 className="font-medium mb-2">Networks</h3>
                            <div className="flex flex-wrap gap-1">
                              {creative.network && creative.network.map((network) => (
                                <Badge key={network} variant="outline" className="text-xs">
                                  {network}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Target Audience */}
                          <div className="border rounded p-3">
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Target Audience
                            </h3>
                            <p className="text-sm text-gray-700">{creative.target_audience}</p>
                          </div>

                          {/* Keywords */}
                          <div className="border rounded p-3">
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              Keywords
                            </h3>
                            <div className="flex flex-wrap gap-1">
                              {creative.keywords && creative.keywords.split(', ').map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {keyword.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Suggestions */}
                          <div className="border rounded p-3">
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <Lightbulb className="h-4 w-4" />
                              Pattern Insights
                            </h3>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {creative.suggestions && creative.suggestions.split(' | ').map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{suggestion.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Scenes */}
                          <div className="border rounded p-3">
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Scene Analysis
                            </h3>
                            <div className="space-y-2">
                              {[creative.scene_1, creative.scene_2, creative.scene_3, creative.scene_4, creative.scene_5].filter(Boolean).map((scene, index) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium text-blue-600">Scene {index + 1}:</span>
                                  <span className="ml-2 text-gray-700">{scene}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}