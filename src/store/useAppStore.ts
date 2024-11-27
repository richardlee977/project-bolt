import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BusinessStage } from '../types/business';

interface AppState {
  businessStage: BusinessStage;
  showAIAgents: boolean;
  isDarkMode: boolean;
  setBusinessStage: (stage: BusinessStage) => void;
  setShowAIAgents: (show: boolean) => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      businessStage: 'ideation',
      showAIAgents: false,
      isDarkMode: false,
      setBusinessStage: (stage) => set({ businessStage: stage }),
      setShowAIAgents: (show) => set({ showAIAgents: show }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'app-storage',
    }
  )
);