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
  Play, 
  Pause, 
  Square,
  Plus,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  BarChart3,
  Zap
} from 'lucide-react';

const mockExperiments = [
  {
    id: 'exp-001',
    name: 'Gaming Creative Test - Q1 2024',
    description: 'Testing new gameplay hooks for RPG audience',
    status: 'active',
    creatives: ['Adventure Quest - Hero Intro', 'Dragon Wars - Epic Battle', 'Magic Spells - Banner'],
    budget: {
      total: 50000,
      spent: 23450,
      daily: 2500
    },
    duration: {
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      remainingDays: 12
    },
    networks: ['Facebook', 'Google', 'TikTok'],
    targeting: {
      geos: ['US', 'CA', 'UK'],
      ageRange: '18-35',
      interests: ['Gaming', 'RPG', 'Mobile Games']
    },
    metrics: {
      impressions: 1250000,
      clicks: 47500,
      installs: 5670,
      spend: 23450,
      ctr: 3.8,
      ipm: 45.2,
      cpi: 4.14
    },
    alerts: [
      { type: 'scale', message: 'Adventure Quest performing above target' },
      { type: 'budget', message: '47% of budget spent' }
    ],
    lastUpdated: '2024-01-28T14:30:00Z'
  },
  {
    id: 'exp-002',
    name: 'Casual Games - UGC Style Test',
    description: 'Testing UGC-style creatives vs polished content',
    status: 'paused',
    creatives: ['Puzzle Adventure - UGC', 'Match-3 Mania - Creator'],
    budget: {
      total: 25000,
      spent: 18750,
      daily: 1000
    },
    duration: {
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      remainingDays: 0
    },
    networks: ['TikTok', 'Snapchat'],
    targeting: {
      geos: ['US'],
      ageRange: '16-28',
      interests: ['Casual Gaming', 'Puzzle Games']
    },
    metrics: {
      impressions: 890000,
      clicks: 26700,
      installs: 3204,
      spend: 18750,
      ctr: 3.0,
      ipm: 36.0,
      cpi: 5.85
    },
    alerts: [
      { type: 'kill', message: 'CPI above threshold, paused automatically' }
    ],
    lastUpdated: '2024-01-25T09:15:00Z'
  },
  {
    id: 'exp-003',
    name: 'Strategy Games - Premium Audience',
    description: 'Testing premium positioning for strategy game',
    status: 'draft',
    creatives: ['Empire Builder - Premium', 'War Strategy - Elite'],
    budget: {
      total: 75000,
      spent: 0,
      daily: 3000
    },
    duration: {
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      remainingDays: 28
    },
    networks: ['Google', 'Unity'],
    targeting: {
      geos: ['US', 'CA', 'AU', 'UK'],
      ageRange: '25-45',
      interests: ['Strategy Games', 'Board Games', 'Premium Gaming']
    },
    metrics: {
      impressions: 0,
      clicks: 0,
      installs: 0,
      spend: 0,
      ctr: 0,
      ipm: 0,
      cpi: 0
    },
    alerts: [],
    lastUpdated: '2024-01-28T16:45:00Z'
  }
];

const mockRules = [
  {
    id: 'rule-001',
    name: 'Auto Kill High CPI',
    type: 'kill',
    condition: 'CPI > $6.00 AND confidence > 80%',
    isActive: true,
    triggered: 3,
    lastTriggered: '2024-01-25T09:15:00Z'
  },
  {
    id: 'rule-002',
    name: 'Scale High Performers',
    type: 'scale',
    condition: 'CPI < $3.00 AND IPM > 50 AND spend > $1000',
    isActive: true,
    triggered: 1,
    lastTriggered: '2024-01-27T11:30:00Z'
  },
  {
    id: 'rule-003',
    name: 'Budget Alert 80%',
    type: 'alert',
    condition: 'Budget spent > 80%',
    isActive: true,
    triggered: 2,
    lastTriggered: '2024-01-28T08:00:00Z'
  }
];

export default function ExperimentsPage() {
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'paused':
        return <Pause className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'draft':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'kill':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'scale':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'budget':
        return <DollarSign className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredExperiments = mockExperiments.filter(exp => {
    if (selectedTab === 'all') return true;
    return exp.status === selectedTab;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Experiments</h1>
            <p className="text-gray-600">Manage and monitor your A/B tests and campaigns</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Manage Rules
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Experiment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Active Experiments</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                2 scaling up
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">$156K</div>
              <div className="text-sm text-gray-600">Total Budget</div>
              <div className="text-xs text-gray-500 mt-1">$89K spent</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">$3.84</div>
              <div className="text-sm text-gray-600">Avg CPI</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingDown className="mr-1 h-3 w-3" />
                12% vs last week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">23</div>
              <div className="text-sm text-gray-600">Auto Actions</div>
              <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {filteredExperiments.map((experiment) => (
                <Card key={experiment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-xl">{experiment.name}</CardTitle>
                          <Badge className={getStatusColor(experiment.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(experiment.status)}
                              <span>{experiment.status}</span>
                            </div>
                          </Badge>
                        </div>
                        <CardDescription>{experiment.description}</CardDescription>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{experiment.targeting.geos.join(', ')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{experiment.duration.remainingDays} days left</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{experiment.creatives.length} creatives</span>
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
                            <Play className="mr-2 h-4 w-4" />
                            {experiment.status === 'active' ? 'Pause' : 'Resume'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Edit Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Square className="mr-2 h-4 w-4" />
                            Stop Experiment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Budget & Performance</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Budget Used</span>
                              <span>${experiment.budget.spent.toLocaleString()} / ${experiment.budget.total.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(experiment.budget.spent / experiment.budget.total) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">CPI:</span>
                              <span className="ml-2 font-medium">${experiment.metrics.cpi}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">IPM:</span>
                              <span className="ml-2 font-medium">{experiment.metrics.ipm}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">CTR:</span>
                              <span className="ml-2 font-medium">{experiment.metrics.ctr}%</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Installs:</span>
                              <span className="ml-2 font-medium">{experiment.metrics.installs.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Networks & Targeting</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">Networks:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {experiment.networks.map(network => (
                                <Badge key={network} variant="outline" className="text-xs">
                                  {network}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-sm text-gray-500">Demographics:</span>
                            <div className="text-sm mt-1">
                              <div>{experiment.targeting.ageRange} years old</div>
                              <div className="text-gray-600">{experiment.targeting.interests.join(', ')}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Status & Alerts</h4>
                        
                        <div className="space-y-2">
                          {experiment.alerts.length > 0 ? (
                            experiment.alerts.map((alert, index) => (
                              <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                                {getAlertIcon(alert.type)}
                                <span className="text-sm">{alert.message}</span>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">No active alerts</span>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-gray-500">
                          Last updated: {new Date(experiment.lastUpdated).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-500">Creatives:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {experiment.creatives.slice(0, 2).map((creative, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {creative}
                              </Badge>
                            ))}
                            {experiment.creatives.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{experiment.creatives.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Report
                          </Button>
                          {experiment.status === 'active' ? (
                            <Button variant="outline" size="sm">
                              <Pause className="mr-2 h-4 w-4" />
                              Pause
                            </Button>
                          ) : experiment.status === 'paused' ? (
                            <Button size="sm">
                              <Play className="mr-2 h-4 w-4" />
                              Resume
                            </Button>
                          ) : experiment.status === 'draft' ? (
                            <Button size="sm">
                              <Zap className="mr-2 h-4 w-4" />
                              Launch
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredExperiments.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No experiments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedTab === 'active' 
                    ? 'No active experiments at the moment.' 
                    : `No ${selectedTab} experiments found.`}
                </p>
                <div className="mt-6">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Experiment
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Automation Rules</CardTitle>
            <CardDescription>
              Automated rules for experiment management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${rule.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{rule.name}</h4>
                      <p className="text-sm text-gray-600">{rule.condition}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="text-center">
                      <div className="font-medium">{rule.triggered}</div>
                      <div className="text-xs">Triggered</div>
                    </div>
                    {rule.lastTriggered && (
                      <div className="text-xs">
                        Last: {new Date(rule.lastTriggered).toLocaleDateString()}
                      </div>
                    )}
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}