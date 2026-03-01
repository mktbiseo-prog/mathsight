import { create } from "zustand";
import type { SubjectId } from "@/types";

interface AppStore {
  expandedSubject: SubjectId | null;
  toggleExpandSubject: (id: SubjectId) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  expandedSubject: null,
  toggleExpandSubject: (id) => {
    const current = get().expandedSubject;
    set({ expandedSubject: current === id ? null : id });
  },
}));
