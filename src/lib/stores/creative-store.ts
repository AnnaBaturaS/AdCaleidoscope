import { create } from 'zustand';
import { Creative, CreativeFilter } from '@/models/creative';

interface CreativeStore {
  creatives: Creative[];
  selectedCreatives: string[];
  filter: CreativeFilter;
  sortBy: 'name' | 'createdAt' | 'ctr' | 'ipm' | 'cpi';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  
  setCreatives: (creatives: Creative[]) => void;
  addCreative: (creative: Creative) => void;
  updateCreative: (id: string, updates: Partial<Creative>) => void;
  removeCreative: (id: string) => void;
  
  setSelectedCreatives: (ids: string[]) => void;
  toggleCreativeSelection: (id: string) => void;
  clearSelection: () => void;
  
  setFilter: (filter: Partial<CreativeFilter>) => void;
  clearFilter: () => void;
  
  setSorting: (sortBy: CreativeStore['sortBy'], sortOrder: CreativeStore['sortOrder']) => void;
  setViewMode: (viewMode: CreativeStore['viewMode']) => void;
  setLoading: (isLoading: boolean) => void;
  
  getFilteredCreatives: () => Creative[];
}

export const useCreativeStore = create<CreativeStore>((set, get) => ({
  creatives: [],
  selectedCreatives: [],
  filter: {},
  sortBy: 'createdAt',
  sortOrder: 'desc',
  viewMode: 'grid',
  isLoading: false,
  
  setCreatives: (creatives) => set({ creatives }),
  
  addCreative: (creative) => set((state) => ({
    creatives: [creative, ...state.creatives]
  })),
  
  updateCreative: (id, updates) => set((state) => ({
    creatives: state.creatives.map(creative =>
      creative.id === id ? { ...creative, ...updates } : creative
    )
  })),
  
  removeCreative: (id) => set((state) => ({
    creatives: state.creatives.filter(creative => creative.id !== id),
    selectedCreatives: state.selectedCreatives.filter(selectedId => selectedId !== id)
  })),
  
  setSelectedCreatives: (ids) => set({ selectedCreatives: ids }),
  
  toggleCreativeSelection: (id) => set((state) => ({
    selectedCreatives: state.selectedCreatives.includes(id)
      ? state.selectedCreatives.filter(selectedId => selectedId !== id)
      : [...state.selectedCreatives, id]
  })),
  
  clearSelection: () => set({ selectedCreatives: [] }),
  
  setFilter: (filter) => set((state) => ({
    filter: { ...state.filter, ...filter }
  })),
  
  clearFilter: () => set({ filter: {} }),
  
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
  
  setViewMode: (viewMode) => set({ viewMode }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  getFilteredCreatives: () => {
    const { creatives, filter, sortBy, sortOrder } = get();
    
    let filtered = creatives.filter(creative => {
      if (filter.format && !filter.format.includes(creative.format)) return false;
      if (filter.hook && creative.tags.hook && !filter.hook.includes(creative.tags.hook)) return false;
      if (filter.style && creative.tags.style && !filter.style.includes(creative.tags.style)) return false;
      if (filter.status && !filter.status.includes(creative.status)) return false;
      if (filter.network && creative.network && !creative.network.some(n => filter.network!.includes(n))) return false;
      
      if (filter.dateRange) {
        const createdAt = new Date(creative.createdAt);
        const from = new Date(filter.dateRange.from);
        const to = new Date(filter.dateRange.to);
        if (createdAt < from || createdAt > to) return false;
      }
      
      if (filter.performanceThreshold && creative.metrics) {
        const { metric, operator, value } = filter.performanceThreshold;
        const metricValue = creative.metrics[metric] as number;
        if (metricValue === undefined) return false;
        
        switch (operator) {
          case 'gt': if (!(metricValue > value)) return false; break;
          case 'lt': if (!(metricValue < value)) return false; break;
          case 'eq': if (!(metricValue === value)) return false; break;
        }
      }
      
      return true;
    });
    
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      if (sortBy === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else if (sortBy === 'createdAt') {
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
      } else if (a.metrics && b.metrics) {
        aValue = a.metrics[sortBy] || 0;
        bValue = b.metrics[sortBy] || 0;
      } else {
        return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }
}));