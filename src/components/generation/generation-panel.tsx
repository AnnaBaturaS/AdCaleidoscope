'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Activity, Download, Eye, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export interface GenerationJob {
  id: string;
  type: 'text' | 'image' | 'video';
  prompt: string;
  status: 'processing' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  result?: {
    content: string;
    filename?: string;
    metadata?: any;
  };
  error?: string;
}

interface GenerationPanelProps {
  jobs: GenerationJob[];
  onRemoveJob: (id: string) => void;
  onViewResult: (job: GenerationJob) => void;
}

export function GenerationPanel({ jobs, onRemoveJob, onViewResult }: GenerationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const activeJobs = jobs.filter(job => job.status === 'processing').length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const failedJobs = jobs.filter(job => job.status === 'failed').length;

  // Auto-open panel when new job starts
  useEffect(() => {
    if (activeJobs > 0) {
      setIsOpen(true);
    }
  }, [activeJobs]);

  const formatDuration = (start: Date, end?: Date) => {
    const duration = (end || new Date()).getTime() - start.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const getStatusIcon = (status: GenerationJob['status']) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: GenerationJob['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
    }
  };

  const getTypeEmoji = (type: GenerationJob['type']) => {
    switch (type) {
      case 'text': return '📝';
      case 'image': return '🖼️';
      case 'video': return '🎬';
    }
  };

  const downloadContent = (job: GenerationJob) => {
    if (!job.result?.content) return;
    
    const link = document.createElement('a');
    
    if (job.result.content.startsWith('http') || job.result.content.startsWith('/')) {
      // It's a URL, fetch and download
      fetch(job.result.content)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = job.result?.filename || `generated-${job.type}.${job.type === 'video' ? 'mp4' : job.type === 'image' ? 'png' : 'txt'}`;
          link.click();
          window.URL.revokeObjectURL(url);
        });
    } else if (job.type === 'image' || job.type === 'video') {
      // It's base64
      link.href = `data:${job.type}/${job.type === 'video' ? 'mp4' : 'png'};base64,${job.result.content}`;
      link.download = job.result?.filename || `generated-${job.type}.${job.type === 'video' ? 'mp4' : 'png'}`;
      link.click();
    } else {
      // It's text
      const blob = new Blob([job.result.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = job.result?.filename || 'generated-text.txt';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant={activeJobs > 0 ? "default" : "outline"}
          size="lg"
          className={`
            fixed bottom-6 right-26 z-50 
            shadow-2xl hover:shadow-3xl transition-all duration-300
            ${activeJobs > 0 ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' : ''}
            group hover:scale-105
          `}
        >
          <div className="flex items-center gap-2">
            {activeJobs > 0 ? (
              <>
                <div className="relative">
                  <Activity className="h-5 w-5 animate-spin" />
                  <div className="absolute inset-0 h-5 w-5 animate-ping opacity-75">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <span className="font-semibold">Generating...</span>
                <Badge 
                  variant="secondary" 
                  className="bg-white/20 text-white border-0 animate-pulse"
                >
                  {activeJobs}
                </Badge>
              </>
            ) : (
              <>
                <Activity className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-semibold">Generation Queue</span>
                {jobs.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {jobs.length}
                  </Badge>
                )}
              </>
            )}
            
            {completedJobs > 0 && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm">{completedJobs}</span>
              </div>
            )}
          </div>
          
          {/* Progress indicator bar */}
          {activeJobs > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white animate-progress-slide rounded-full" />
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Generation Queue
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          {/* Summary */}
          <div className="flex gap-2 mb-4">
            {activeJobs > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {activeJobs} Processing
              </Badge>
            )}
            {completedJobs > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {completedJobs} Completed
              </Badge>
            )}
            {failedJobs > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {failedJobs} Failed
              </Badge>
            )}
          </div>

          {/* Job List */}
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {jobs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No generations yet</p>
                <p className="text-sm">Start a generation to see it here</p>
              </div>
            ) : (
              jobs.map((job) => (
                <Card key={job.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getTypeEmoji(job.type)}</span>
                        <Badge variant="secondary" className={getStatusColor(job.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(job.status)}
                            {job.status}
                          </div>
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDuration(job.startTime, job.endTime)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {job.prompt}
                      </p>
                      
                      {job.status === 'processing' && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse w-1/3"></div>
                        </div>
                      )}
                      
                      {job.error && (
                        <p className="text-xs text-red-600 mb-2">{job.error}</p>
                      )}
                      
                      {job.result && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewResult(job)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadContent(job)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveJob(job.id)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}