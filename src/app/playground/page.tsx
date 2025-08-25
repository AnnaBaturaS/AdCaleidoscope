'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  Download,
  Settings,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Monitor,
  Smartphone,
  ExternalLink
} from 'lucide-react';

interface MRAIDEvent {
  type: string;
  timestamp: number;
  data?: any;
  source: 'playable' | 'mraid';
}

export default function PlaygroundPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [events, setEvents] = useState<MRAIDEvent[]>([]);
  const [currentPlayable, setCurrentPlayable] = useState<string>('memory-match');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet'>('mobile');
  
  const mockPlayables = [
    {
      id: 'sample-game',
      name: 'Sample Puzzle Game',
      size: '2.1 MB',
      status: 'ready',
      description: 'A simple puzzle game demo with MRAID integration'
    },
    {
      id: 'rpg-demo',
      name: 'RPG Adventure Demo',
      size: '3.8 MB',
      status: 'uploading',
      description: 'Fantasy RPG playable with character selection'
    },
    {
      id: 'racing-game',
      name: 'Racing Game',
      size: '1.9 MB',
      status: 'error',
      description: 'High-speed racing game with car customization'
    }
  ];

  const validationResults = {
    passed: true,
    score: 85,
    checklist: {
      hasEndcard: true,
      hasStoreLink: true,
      eventsImplemented: ['ready', 'engage', 'endcard_view', 'cta_click'],
      performanceOk: true,
      sizeOk: true
    },
    errors: [],
    warnings: [
      {
        code: 'W001',
        message: 'Consider adding more user engagement events',
        suggestion: 'Add level_complete and achievement_unlock events',
        impact: 'medium'
      }
    ]
  };

  useEffect(() => {
    const eventListener = (event: MessageEvent) => {
      if (event.data.type === 'mraid_event') {
        setEvents(prev => [...prev, event.data.payload]);
      } else if (event.data.type === 'mraid_open') {
        setEvents(prev => [...prev, {
          type: 'open',
          timestamp: Date.now(),
          data: event.data.payload,
          source: 'mraid'
        }]);
      }
    };

    window.addEventListener('message', eventListener);
    return () => window.removeEventListener('message', eventListener);
  }, []);

  // Update iframe dimensions when device mode changes
  useEffect(() => {
    if (isLoaded) {
      const iframe = document.querySelector('iframe[title="Playable Ad"]');
      if (iframe) {
        const dimensions = getDeviceDimensions();
        iframe.style.width = `${dimensions.width}px`;
        iframe.style.height = `${dimensions.height}px`;
      }
    }
  }, [deviceMode, isLoaded]);

  const handleLoadPlayable = () => {
    setIsLoaded(true);
    setEvents([]);
    setIsExpanded(false);
    
    // Add initial ready event
    setTimeout(() => {
      setEvents(prev => [...prev, {
        type: 'ready',
        timestamp: Date.now(),
        source: 'mraid',
        data: { playable: currentPlayable }
      }]);
    }, 1000);
  };

  const handleSimulateEvent = (eventType: string) => {
    const newEvent: MRAIDEvent = {
      type: eventType,
      timestamp: Date.now(),
      source: 'playable'
    };

    if (eventType === 'expand') {
      setIsExpanded(true);
      newEvent.data = { expanded: true };
    } else if (eventType === 'close') {
      setIsExpanded(false);
      newEvent.data = { expanded: false };
    }

    setEvents(prev => [...prev, newEvent]);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getDeviceDimensions = () => {
    return deviceMode === 'mobile' 
      ? { width: 375, height: 812 } // iPhone X/11/12 размеры
      : { width: 768, height: 1024 }; // iPad размеры
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Playable Sandbox</h1>
            <p className="text-gray-600">Test and validate your playable ads with MRAID simulation</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Playable
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[900px] h-[calc(100vh-200px)]">
          {/* Left: Playable Preview */}
          <div className="lg:col-span-5 flex">
            <Card className="flex-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Playable Preview</CardTitle>
                    <CardDescription>Interactive sandbox with MRAID simulation</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={deviceMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setDeviceMode('mobile');
                        // Перезагружаем iframe с новыми размерами
                        if (isLoaded) {
                          const iframe = document.querySelector('iframe');
                          if (iframe) {
                            iframe.style.width = '375px';
                            iframe.style.height = '812px';
                          }
                        }
                      }}
                    >
                      <Smartphone className="h-4 w-4 mr-1" />
                      Mobile
                    </Button>
                    <Button
                      variant={deviceMode === 'tablet' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setDeviceMode('tablet');
                        // Перезагружаем iframe с новыми размерами
                        if (isLoaded) {
                          const iframe = document.querySelector('iframe');
                          if (iframe) {
                            iframe.style.width = '768px';
                            iframe.style.height = '1024px';
                          }
                        }
                      }}
                    >
                      <Monitor className="h-4 w-4 mr-1" />
                      Tablet
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
                  <div 
                    className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-gray-800 relative mx-auto"
                    style={{
                      width: getDeviceDimensions().width,
                      height: getDeviceDimensions().height,
                      maxWidth: '100%',
                      maxHeight: '80vh',
                      transition: 'all 0.3s ease-in-out'
                    }}
                  >
                    {!isLoaded ? (
                      <div className="h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <Play className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Playable Loaded</h3>
                          <p className="text-gray-600 mb-4">Select a playable from the list to start testing</p>
                          <Button onClick={handleLoadPlayable}>
                            <Play className="mr-2 h-4 w-4" />
                            Load {currentPlayable === 'endless-runner' ? 'Runner Game' : currentPlayable === 'memory-match' ? 'Memory Game' : 'Selected Game'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full relative">
                        <iframe
                          src={currentPlayable === 'endless-runner' ? '/playable-runner.html' : '/playable-demo.html'}
                          className="w-full h-full"
                          title="Playable Ad"
                          style={{ border: 'none' }}
                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        />
                        
                        {/* MRAID Indicators - positioned outside iframe */}
                      </div>
                    )}
                  </div>
                </div>

                {/* MRAID Status & Device Info */}
                <div className="mt-4 flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">MRAID 3.0</Badge>
                    {isExpanded && <Badge variant="outline" className="bg-blue-100 text-blue-800">Expanded</Badge>}
                  </div>
                  <div className="text-gray-500 flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {deviceMode === 'mobile' ? (
                        <Smartphone className="h-4 w-4" />
                      ) : (
                        <Monitor className="h-4 w-4" />
                      )}
                      <span>
                        {deviceMode === 'mobile' ? 'iPhone (375×812)' : 'iPad (768×1024)'}
                      </span>
                    </div>
                    <span>•</span>
                    <span>Safe Area: {deviceMode === 'mobile' ? '20px' : '40px'}</span>
                  </div>
                </div>

                {isLoaded && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSimulateEvent('engage')}
                    >
                      Simulate Engage
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSimulateEvent('endcard_view')}
                    >
                      Show Endcard
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSimulateEvent('cta_click')}
                    >
                      CTA Click
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSimulateEvent('expand')}
                      disabled={isExpanded}
                    >
                      Expand
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSimulateEvent('close')}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEvents([]);
                        handleLoadPlayable();
                      }}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Center: Playables List */}
          <div className="lg:col-span-4 flex">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Playables Library</CardTitle>
                <CardDescription>Select a playable to test</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      currentPlayable === 'memory-match' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setCurrentPlayable('memory-match');
                      setIsLoaded(false);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">🎮 Memory Match</h4>
                      <Badge variant="default">Ready</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Match pairs to win! Tests engagement and endcard events.</p>
                    <div className="flex justify-between items-center">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Size: 128 KB • 30s gameplay</span>
                      </div>
                      {currentPlayable === 'memory-match' && (
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadPlayable();
                          }}
                        >
                          Load
                        </Button>
                      )}
                    </div>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      currentPlayable === 'endless-runner' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setCurrentPlayable('endless-runner');
                      setIsLoaded(false);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">🏃 Endless Runner</h4>
                      <Badge variant="default">Ready</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Jump over obstacles! Canvas-based with physics.</p>
                    <div className="flex justify-between items-center">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Size: 96 KB • Endless gameplay</span>
                      </div>
                      {currentPlayable === 'endless-runner' && (
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadPlayable();
                          }}
                        >
                          Load
                        </Button>
                      )}
                    </div>
                  </div>

                  <div 
                    className="p-4 border-2 rounded-lg opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">🧩 Puzzle Quest</h4>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Match-3 puzzle with power-ups and levels.</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Size: 256 KB</span>
                      <span>5 levels</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Custom Playable
                    </Button>
                    <input 
                      id="file-upload"
                      type="file" 
                      accept=".html,.zip" 
                      className="hidden"
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Validation & Event Log */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Compact Validation Status at Top */}
            <div className="mb-6">
              <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Activity className="mr-2 h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">Validation Results</span>
                  </div>
                  <Badge variant={validationResults.score >= 80 ? "default" : "destructive"} className="text-xs">
                    {validationResults.score}/100
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>MRAID 3.0 Compatible</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Endcard Present</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>CTA Button Works</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                    <span>Missing level_complete</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="flex-1 flex flex-col" style={{ minHeight: '70vh' }}>
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-green-500" />
                      Event Log
                    </CardTitle>
                    <CardDescription>Real-time MRAID events and interactions</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {events.length} events
                    </Badge>
                    {events.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEvents([])}
                        className="h-8 w-8 p-0"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="space-y-2 flex-1 overflow-y-auto pr-2 max-h-[60vh]" style={{ scrollbarWidth: 'thin' }}>
                  {events.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[500px]">
                      <div className="text-center text-gray-500">
                        <div className="relative">
                          <Clock className="mx-auto h-16 w-16 mb-6 text-gray-300" />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 rounded-full animate-ping" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Waiting for events...</h3>
                        <p className="text-sm mb-4">Load a playable to start tracking MRAID events</p>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>• Click on a playable in the center column</p>
                          <p>• Press the Load button to start</p>
                          <p>• Events will appear here in real-time</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {events.slice().reverse().map((event, index) => (
                        <div key={events.length - index} className={`relative p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                          event.source === 'mraid' 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-green-50 border-green-200'
                        }`}>
                          {/* Timeline connector */}
                          {index < events.length - 1 && (
                            <div className="absolute left-4 top-12 w-0.5 h-6 bg-gray-200" />
                          )}
                          
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                  event.source === 'mraid' 
                                    ? 'bg-blue-500 ring-2 ring-blue-200' 
                                    : 'bg-green-500 ring-2 ring-green-200'
                                }`} />
                                <div className="text-xs text-gray-400 mt-1">
                                  #{events.length - index}
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className={`font-mono font-semibold text-sm ${
                                    event.source === 'mraid' ? 'text-blue-700' : 'text-green-700'
                                  }`}>
                                    {event.type}
                                  </span>
                                  <Badge 
                                    variant={event.source === 'mraid' ? 'default' : 'secondary'}
                                    className="text-xs px-1.5 py-0.5"
                                  >
                                    {event.source}
                                  </Badge>
                                </div>
                                
                                {event.data && (
                                  <div className="mt-2">
                                    <div className="text-xs text-gray-600 bg-white rounded px-2 py-1 border">
                                      {typeof event.data === 'object' 
                                        ? JSON.stringify(event.data, null, 2).substring(0, 100) + (JSON.stringify(event.data).length > 100 ? '...' : '')
                                        : String(event.data)
                                      }
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
                              {formatTimestamp(event.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                
                {events.length > 5 && (
                  <div className="pt-3 border-t mt-4">
                    <div className="text-xs text-gray-500 text-center">
                      Showing latest {Math.min(events.length, 50)} events
                      {events.length > 50 && ` (${events.length - 50} older events hidden)`}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}