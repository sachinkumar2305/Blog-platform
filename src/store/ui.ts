import { create } from 'zustand';

interface UIState {
  isDraftMode: boolean;
  setDraftMode: (isDraft: boolean) => void;
  selectedCategories: number[];
  setSelectedCategories: (categories: number[]) => void;
  isEditMode: boolean;
  setEditMode: (isEdit: boolean) => void;
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDraftMode: false,
  setDraftMode: (isDraft) => set({ isDraftMode: isDraft }),
  selectedCategories: [],
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  isEditMode: false,
  setEditMode: (isEdit) => set({ isEditMode: isEdit }),
  isDarkMode: false,
  setDarkMode: (isDark) => set({ isDarkMode: isDark }),
}));