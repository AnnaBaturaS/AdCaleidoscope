import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Creative, CreativeFilter } from '@/models/creative';

// API Base URL - can be configured via environment variables
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

// Generic API fetch function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Dashboard API hooks
export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiCall('/dashboard'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

// Creatives API hooks
export function useCreatives(filters: CreativeFilter = {}) {
  const queryParams = new URLSearchParams();
  
  if (filters.format) queryParams.set('format', filters.format.join(','));
  if (filters.status) queryParams.set('status', filters.status.join(','));
  if (filters.network) queryParams.set('network', filters.network.join(','));
  
  const queryString = queryParams.toString();
  const endpoint = `/creatives${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['creatives', filters],
    queryFn: () => apiCall(endpoint),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreative(id: string) {
  return useQuery({
    queryKey: ['creative', id],
    queryFn: () => apiCall(`/creatives/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCreative() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (creativeData: Partial<Creative>) => 
      apiCall('/creatives', {
        method: 'POST',
        body: JSON.stringify(creativeData),
      }),
    onSuccess: () => {
      // Invalidate and refetch creatives list
      queryClient.invalidateQueries({ queryKey: ['creatives'] });
    },
  });
}

export function useUpdateCreative() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Creative> }) =>
      apiCall(`/creatives/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      // Invalidate specific creative and list
      queryClient.invalidateQueries({ queryKey: ['creative', id] });
      queryClient.invalidateQueries({ queryKey: ['creatives'] });
    },
  });
}

export function useDeleteCreative() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      apiCall(`/creatives/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creatives'] });
    },
  });
}

// Patterns API hooks
export function usePatterns() {
  return useQuery({
    queryKey: ['patterns'],
    queryFn: () => apiCall('/patterns'),
    staleTime: 10 * 60 * 1000, // 10 minutes - patterns don't change frequently
  });
}

// Experiments API hooks
export function useExperiments(status?: string) {
  return useQuery({
    queryKey: ['experiments', status],
    queryFn: () => apiCall(`/experiments${status ? `?status=${status}` : ''}`),
    staleTime: 2 * 60 * 1000,
  });
}

export function useExperiment(id: string) {
  return useQuery({
    queryKey: ['experiment', id],
    queryFn: () => apiCall(`/experiments/${id}`),
    enabled: !!id,
  });
}

// Briefs API hooks
export function useBriefs() {
  return useQuery({
    queryKey: ['briefs'],
    queryFn: () => apiCall('/briefs'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBrief(id: string) {
  return useQuery({
    queryKey: ['brief', id],
    queryFn: () => apiCall(`/briefs/${id}`),
    enabled: !!id,
  });
}

export function useCreateBrief() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (briefData: any) =>
      apiCall('/briefs', {
        method: 'POST',
        body: JSON.stringify(briefData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefs'] });
    },
  });
}

// File Upload hooks
export function useUploadFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      // Get presigned URL
      const { uploadUrl, fileUrl } = await apiCall('/upload-url', {
        method: 'POST',
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      // Upload file to S3 using presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      return { fileUrl, fileName: file.name };
    },
  });
}

// AI Generation hooks
export function useGenerateCreative() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (generationRequest: {
      briefId: string;
      format: string;
      variations?: number;
      provider?: string;
    }) =>
      apiCall('/generate', {
        method: 'POST',
        body: JSON.stringify(generationRequest),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creatives'] });
    },
  });
}

// Analytics hooks
export function useAnalytics(params: {
  startDate: string;
  endDate: string;
  metrics?: string[];
  groupBy?: string;
}) {
  const queryParams = new URLSearchParams(params as any);
  
  return useQuery({
    queryKey: ['analytics', params],
    queryFn: () => apiCall(`/analytics?${queryParams.toString()}`),
    staleTime: 5 * 60 * 1000,
  });
}

// Settings hooks
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => apiCall('/settings'),
    staleTime: 10 * 60 * 1000,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: any) =>
      apiCall('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

// Integrations hooks
export function useIntegrations() {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: () => apiCall('/integrations'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTestIntegration() {
  return useMutation({
    mutationFn: (integrationId: string) =>
      apiCall(`/integrations/${integrationId}/test`, {
        method: 'POST',
      }),
  });
}

export function useConnectIntegration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ integrationId, config }: { integrationId: string; config: any }) =>
      apiCall(`/integrations/${integrationId}/connect`, {
        method: 'POST',
        body: JSON.stringify(config),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });
}

// Playable validation hooks
export function useValidatePlayable() {
  return useMutation({
    mutationFn: (playableFile: File) => {
      const formData = new FormData();
      formData.append('playable', playableFile);
      
      return fetch(`${API_BASE}/playable/validate`, {
        method: 'POST',
        body: formData,
      }).then(response => {
        if (!response.ok) throw new Error('Validation failed');
        return response.json();
      });
    },
  });
}

// Real-time notifications hook
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiCall('/notifications'),
    refetchInterval: 30 * 1000, // Check for new notifications every 30 seconds
  });
}

// Performance monitoring hook
export function usePerformanceMetrics(timeRange: string = '24h') {
  return useQuery({
    queryKey: ['performance', timeRange],
    queryFn: () => apiCall(`/performance?range=${timeRange}`),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}