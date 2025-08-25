'use client';

import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Eye,
  MousePointer,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

export default function DashboardPage() {
  const kpis = [
    {
      title: 'CPI',
      value: '$2.34',
      change: -12.5,
      period: 'vs last 7 days',
      icon: DollarSign,
      positive: true
    },
    {
      title: 'IPM',
      value: '45.2',
      change: 8.3,
      period: 'vs last 7 days',
      icon: Download,
      positive: true
    },
    {
      title: 'CTR',
      value: '3.8%',
      change: -2.1,
      period: 'vs last 7 days',
      icon: MousePointer,
      positive: false
    },
    {
      title: 'Total Spend',
      value: '$12.5K',
      change: 23.1,
      period: 'vs last 7 days',
      icon: Target,
      positive: false
    }
  ];

  const topCreatives = [
    {
      id: '1',
      name: 'Game Night Mystery - Video 15s',
      format: 'video',
      cpi: '$1.89',
      ipm: 67.3,
      ctr: '4.2%',
      status: 'active',
      trend: 'up'
    },
    {
      id: '2',
      name: 'Puzzle Adventure - Playable',
      format: 'playable',
      cpi: '$2.12',
      ipm: 52.8,
      ctr: '3.9%',
      status: 'testing',
      trend: 'up'
    },
    {
      id: '3',
      name: 'Hero Quest - Banner 320x50',
      format: 'banner',
      cpi: '$3.45',
      ipm: 34.1,
      ctr: '2.1%',
      status: 'paused',
      trend: 'down'
    }
  ];

  const alerts = [
    {
      id: '1',
      type: 'kill',
      message: 'Creative "Magic Castle RPG" exceeded CPI threshold ($5.00)',
      severity: 'high',
      timestamp: '2 minutes ago',
      creative: 'Magic Castle RPG - Video 30s'
    },
    {
      id: '2',
      type: 'scale',
      message: 'Creative "Adventure Quest" showing strong performance - consider scaling',
      severity: 'medium',
      timestamp: '15 minutes ago',
      creative: 'Adventure Quest - Playable'
    },
    {
      id: '3',
      type: 'budget',
      message: 'Daily budget 85% spent for "Mystery Games" campaign',
      severity: 'low',
      timestamp: '1 hour ago',
      creative: null
    }
  ];

  const topPatterns = [
    {
      name: 'Actual Gameplay',
      impact: '+25% Retention',
      confidence: 91,
      category: 'visual'
    },
    {
      name: 'Close-up Face Hook',
      impact: '+23% CTR',
      confidence: 94,
      category: 'visual'
    },
    {
      name: 'UGC Style',
      impact: '+19% CTR',
      confidence: 89,
      category: 'visual'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Monitor your creative performance and key metrics</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">Export Report</Button>
            <Button>
              <Zap className="mr-2 h-4 w-4" />
              Generate Creative
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center text-xs text-gray-600">
                  {kpi.change > 0 ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={kpi.change > 0 && kpi.positive ? 'text-green-600' : 
                                 kpi.change > 0 && !kpi.positive ? 'text-red-600' :
                                 kpi.change < 0 && kpi.positive ? 'text-red-600' : 'text-green-600'}>
                    {Math.abs(kpi.change)}%
                  </span>
                  <span className="ml-1">{kpi.period}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Creatives</CardTitle>
                <CardDescription>
                  Your best converting creatives in the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCreatives.map((creative) => (
                    <div key={creative.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Eye className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{creative.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Badge variant="outline">{creative.format}</Badge>
                            <Badge variant={creative.status === 'active' ? 'default' : 
                                          creative.status === 'testing' ? 'secondary' : 'outline'}>
                              {creative.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{creative.cpi}</div>
                          <div className="text-gray-500">CPI</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{creative.ipm}</div>
                          <div className="text-gray-500">IPM</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{creative.ctr}</div>
                          <div className="text-gray-500">CTR</div>
                        </div>
                        {creative.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alerts & Actions</CardTitle>
                <CardDescription>
                  Recent automated decisions and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {alert.type === 'kill' && (
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        )}
                        {alert.type === 'scale' && (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        )}
                        {alert.type === 'budget' && (
                          <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{alert.message}</p>
                        {alert.creative && (
                          <p className="text-xs text-gray-500 mt-1">{alert.creative}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{alert.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Patterns</CardTitle>
                <CardDescription>
                  Highest impact factors this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPatterns.map((pattern, index) => (
                    <div key={pattern.name} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{pattern.name}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <span>{pattern.impact}</span>
                          <Badge variant="outline" className="text-xs">
                            {pattern.confidence}% confident
                          </Badge>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-400">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}