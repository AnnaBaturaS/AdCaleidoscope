'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  Video, 
  FileIcon,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface FileUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export function FileUpload({ 
  onFilesUploaded,
  acceptedTypes = ['image/*', 'video/*', '.zip', '.json'],
  maxFiles = 10,
  maxSize = 50,
  className 
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload
    newFiles.forEach((uploadFile, index) => {
      simulateUpload(uploadFile.id, acceptedFiles[index]);
    });
  }, []);

  const simulateUpload = async (fileId: string, file: File) => {
    const updateProgress = (progress: number) => {
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress } : f
      ));
    };

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        updateProgress(progress);
      }

      // Simulate successful upload
      const mockUrl = URL.createObjectURL(file);
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, progress: 100, status: 'completed', url: mockUrl }
          : f
      ));

      // Notify parent component
      const updatedFiles = uploadedFiles.filter(f => f.status === 'completed');
      onFilesUploaded?.(updatedFiles);

    } catch (error) {
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error', error: 'Upload failed' }
          : f
      ));
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const retryUpload = (fileId: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'uploading', progress: 0, error: undefined }
        : f
    ));
    
    // Re-simulate upload
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      // In real implementation, you would retry the actual upload
      simulateUpload(fileId, new File([], file.name, { type: file.type }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    disabled: uploadedFiles.length >= maxFiles
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-8 w-8" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8" />;
    if (type.includes('json')) return <FileText className="h-8 w-8" />;
    return <FileIcon className="h-8 w-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : uploadedFiles.length >= maxFiles
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          
          <div>
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop files here...</p>
            ) : uploadedFiles.length >= maxFiles ? (
              <p className="text-gray-500">Maximum files reached ({maxFiles})</p>
            ) : (
              <>
                <p className="text-gray-600 font-medium">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports: {acceptedTypes.join(', ')} up to {maxSize}MB each
                </p>
              </>
            )}
          </div>
          
          {uploadedFiles.length < maxFiles && (
            <Button variant="outline" className="mx-auto">
              Choose Files
            </Button>
          )}
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-gray-900">
            Uploaded Files ({uploadedFiles.length}/{maxFiles})
          </h4>
          
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* File Icon */}
                    <div className="flex-shrink-0 text-gray-400">
                      {getFileIcon(file.type)}
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <Badge variant={
                          file.status === 'completed' ? 'default' :
                          file.status === 'error' ? 'destructive' : 'secondary'
                        }>
                          {file.status === 'uploading' && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                          {file.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                          {file.status === 'error' && <AlertCircle className="mr-1 h-3 w-3" />}
                          {file.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        
                        {file.status === 'uploading' && (
                          <div className="flex-1 max-w-xs">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {file.error && (
                          <p className="text-xs text-red-600">{file.error}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {file.status === 'error' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => retryUpload(file.id)}
                        >
                          Retry
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload Summary */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {uploadedFiles.filter(f => f.status === 'completed').length} of {uploadedFiles.length} files uploaded
            </span>
            <span className="text-gray-600">
              Total: {formatFileSize(uploadedFiles.reduce((sum, f) => sum + f.size, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}