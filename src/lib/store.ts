import { create } from 'zustand';

interface AppState {
    activeSection: string;
    isCeoMode: boolean;
    toggleCeoMode: () => void;
    setActiveSection: (sectionId: string) => void;
    activeModal: string | null;
    openModal: (modalId: string) => void;
    closeModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    activeSection: 'hero',
    isCeoMode: false,
    toggleCeoMode: () => set((state) => ({ isCeoMode: !state.isCeoMode })),
    setActiveSection: (sectionId) => set({ activeSection: sectionId }),
    activeModal: null,
    openModal: (modalId) => set({ activeModal: modalId }),
    closeModal: () => set({ activeModal: null }),
}));
