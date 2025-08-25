import { create } from 'zustand';
import { GenerationJob } from '@/components/generation/generation-panel';

interface GenerationState {
  jobs: GenerationJob[];
  addJob: (job: Omit<GenerationJob, 'id' | 'startTime'>) => string;
  updateJob: (id: string, updates: Partial<GenerationJob>) => void;
  removeJob: (id: string) => void;
  clearCompleted: () => void;
  getJob: (id: string) => GenerationJob | undefined;
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
  jobs: [],
  
  addJob: (jobData) => {
    const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const job: GenerationJob = {
      ...jobData,
      id,
      startTime: new Date(),
      status: 'processing'
    };
    
    set((state) => ({
      jobs: [job, ...state.jobs]
    }));
    
    return id;
  },
  
  updateJob: (id, updates) => {
    set((state) => ({
      jobs: state.jobs.map(job => 
        job.id === id 
          ? { 
              ...job, 
              ...updates,
              ...(updates.status === 'completed' || updates.status === 'failed' 
                ? { endTime: new Date() } 
                : {})
            }
          : job
      )
    }));
  },
  
  removeJob: (id) => {
    set((state) => ({
      jobs: state.jobs.filter(job => job.id !== id)
    }));
  },
  
  clearCompleted: () => {
    set((state) => ({
      jobs: state.jobs.filter(job => job.status === 'processing')
    }));
  },
  
  getJob: (id) => {
    return get().jobs.find(job => job.id === id);
  }
}));