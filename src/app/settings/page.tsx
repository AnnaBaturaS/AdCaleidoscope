'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save,
  Shield,
  Key,
  Link,
  Globe,
  Zap,
  Database,
  Bell,
  Users,
  Palette,
  Settings as SettingsIcon,
  CheckCircle,
  AlertCircle,
  Trash2,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';

const mockIntegrations = [
  {
    id: 'aws-bedrock',
    name: 'AWS Bedrock',
    category: 'AI Generation',
    status: 'connected',
    description: 'AI-powered creative generation using AWS Bedrock models',
    config: {
      region: 'us-east-1',
      models: ['Nova Canvas', 'Nova Reel', 'Claude 3.5'],
      apiKey: '••••••••••••••••'
    },
    lastSync: '2024-01-28T10:30:00Z'
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads Manager',
    category: 'Ad Networks',
    status: 'connected',
    description: 'Facebook and Instagram advertising campaigns',
    config: {
      appId: '••••••••••••••••',
      accessToken: '••••••••••••••••',
      adAccountId: 'act_1234567890'
    },
    lastSync: '2024-01-28T09:15:00Z'
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    category: 'Ad Networks',
    status: 'connected',
    description: 'Google advertising platform integration',
    config: {
      customerId: '123-456-7890',
      developerToken: '••••••••••••••••',
      refreshToken: '••••••••••••••••'
    },
    lastSync: '2024-01-28T08:45:00Z'
  },
  {
    id: 'appsflyer',
    name: 'AppsFlyer',
    category: 'MMP',
    status: 'connected',
    description: 'Mobile measurement and attribution platform',
    config: {
      appId: 'com.example.app',
      apiToken: '••••••••••••••••',
      devKey: '••••••••••••••••'
    },
    lastSync: '2024-01-28T07:20:00Z'
  },
  {
    id: 'unity-ads',
    name: 'Unity Ads',
    category: 'Ad Networks',
    status: 'error',
    description: 'Unity monetization and user acquisition',
    config: {
      organizationId: '••••••••••••••••',
      projectId: '••••••••••••••••',
      apiKey: '••••••••••••••••'
    },
    lastSync: '2024-01-27T15:30:00Z',
    error: 'API key expired'
  },
  {
    id: 'ironSource',
    name: 'ironSource',
    category: 'Ad Networks',
    status: 'disconnected',
    description: 'Mobile monetization and marketing platform',
    config: {},
    lastSync: null
  }
];

const mockUsers = [
  {
    id: 'user-001',
    name: 'Sarah Chen',
    email: 'sarah@adalchemy.com',
    role: 'Admin',
    lastActive: '2024-01-28T10:30:00Z',
    status: 'active'
  },
  {
    id: 'user-002',
    name: 'Mark Johnson',
    email: 'mark@adalchemy.com',
    role: 'Creative Director',
    lastActive: '2024-01-28T09:15:00Z',
    status: 'active'
  },
  {
    id: 'user-003',
    name: 'Alex Rodriguez',
    email: 'alex@adalchemy.com',
    role: 'Analyst',
    lastActive: '2024-01-27T16:45:00Z',
    status: 'active'
  },
  {
    id: 'user-004',
    name: 'Emma Wilson',
    email: 'emma@adalchemy.com',
    role: 'Designer',
    lastActive: '2024-01-25T14:20:00Z',
    status: 'inactive'
  }
];

const mockBrandSettings = {
  companyName: 'AdCaleidoscope',
  logo: '/logos/adalchemy.png',
  primaryColor: '#1e40af',
  secondaryColor: '#dc2626',
  theme: 'light',
  timezone: 'America/New_York',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY'
};

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState('integrations');
  const [showApiKeys, setShowApiKeys] = useState({});
  const [brandSettings, setBrandSettings] = useState(mockBrandSettings);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'disconnected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI Generation':
        return <Zap className="h-4 w-4" />;
      case 'Ad Networks':
        return <Globe className="h-4 w-4" />;
      case 'MMP':
        return <Database className="h-4 w-4" />;
      default:
        return <Link className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Creative Director':
        return 'bg-blue-100 text-blue-800';
      case 'Analyst':
        return 'bg-green-100 text-green-800';
      case 'Designer':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleApiKeyVisibility = (integrationId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage integrations, users, and system preferences</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Security Audit
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="brand">Brand</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-900">6</div>
                  <div className="text-sm text-gray-600">Total Integrations</div>
                  <div className="text-xs text-green-600 mt-1">4 connected</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-900">98.5%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                  <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-900">23K</div>
                  <div className="text-sm text-gray-600">API Calls</div>
                  <div className="text-xs text-gray-500 mt-1">This month</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {mockIntegrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getCategoryIcon(integration.category)}
                        </div>
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{integration.name}</span>
                            <Badge className={getStatusColor(integration.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(integration.status)}
                                <span>{integration.status}</span>
                              </div>
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-1">{integration.description}</CardDescription>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {integration.category}
                            </Badge>
                            {integration.lastSync && (
                              <span className="text-xs text-gray-500">
                                Last sync: {new Date(integration.lastSync).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {integration.status === 'connected' && (
                          <Button variant="outline" size="sm">
                            Test Connection
                          </Button>
                        )}
                        {integration.status === 'disconnected' && (
                          <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Connect
                          </Button>
                        )}
                        {integration.status === 'error' && (
                          <Button variant="outline" size="sm">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Fix
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {integration.status !== 'disconnected' && (
                    <CardContent>
                      <div className="space-y-3">
                        {integration.error && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-700">{integration.error}</span>
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Configuration</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(integration.config).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <div className="flex items-center space-x-2">
                                  {key.toLowerCase().includes('token') || key.toLowerCase().includes('key') ? (
                                    <>
                                      <span className="text-sm font-mono">
                                        {showApiKeys[integration.id] ? value : '••••••••••••••••'}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleApiKeyVisibility(integration.id)}
                                      >
                                        {showApiKeys[integration.id] ? (
                                          <EyeOff className="h-3 w-3" />
                                        ) : (
                                          <Eye className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </>
                                  ) : (
                                    <span className="text-sm font-medium">{value}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <Button variant="outline" size="sm">
                            <SettingsIcon className="mr-2 h-4 w-4" />
                            Configure
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="brand" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Brand Settings
                </CardTitle>
                <CardDescription>Customize your brand appearance and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={brandSettings.companyName}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={brandSettings.timezone}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={brandSettings.primaryColor}
                        onChange={(e) => setBrandSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-12 h-10 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={brandSettings.primaryColor}
                        onChange={(e) => setBrandSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={brandSettings.secondaryColor}
                        onChange={(e) => setBrandSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-12 h-10 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={brandSettings.secondaryColor}
                        onChange={(e) => setBrandSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={brandSettings.currency}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                      value={brandSettings.dateFormat}
                      onChange={(e) => setBrandSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Palette className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Drop your logo here or click to browse</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Team Members</h3>
                <p className="text-sm text-gray-600">Manage user access and permissions</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(user.lastActive).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">Add an extra layer of security</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Session Timeout</div>
                      <div className="text-sm text-gray-600">Auto-logout after inactivity</div>
                    </div>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>8 hours</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">API Rate Limiting</div>
                      <div className="text-sm text-gray-600">Requests per minute</div>
                    </div>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>100</option>
                      <option>500</option>
                      <option>1000</option>
                      <option>Unlimited</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="mr-2 h-5 w-5" />
                    API Keys
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">Production API Key</div>
                        <div className="text-xs text-gray-500 font-mono">ak_••••••••••••••••</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">Development API Key</div>
                        <div className="text-xs text-gray-500 font-mono">ak_••••••••••••••••</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Generate New Key
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Campaign Alerts</div>
                      <div className="text-sm text-gray-600">High CPI, low performance, budget alerts</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Creative Generation</div>
                      <div className="text-sm text-gray-600">When new creatives are generated</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Pattern Discoveries</div>
                      <div className="text-sm text-gray-600">New patterns and insights</div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Integration Status</div>
                      <div className="text-sm text-gray-600">Connection issues and updates</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Weekly Reports</div>
                      <div className="text-sm text-gray-600">Performance summary emails</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Delivery Methods</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                        <span className="text-sm">Email notifications</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm">Slack integration</span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm">SMS alerts (critical only)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                        <span className="text-sm">In-app notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}