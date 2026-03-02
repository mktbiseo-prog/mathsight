import { create } from "zustand";
import type { Theme } from "@/types";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("mathsight-theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem("mathsight-theme", next);
    set({ theme: next });
  },
}));
