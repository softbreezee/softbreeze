import { create } from 'zustand';

interface TagState {
    selectedTag: string;
    setSelectedTag: (tag: string) => void;
}

export const useTagStore = create<TagState>((set) => ({
    selectedTag: 'all',
    setSelectedTag: (tag) => set({ selectedTag: tag }),
}));