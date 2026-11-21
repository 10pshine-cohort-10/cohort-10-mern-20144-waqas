import { create } from "zustand";

export type Theme = "light" | "dark";

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme | string) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "notiq-theme";

const applyThemeToDocument = (theme: Theme | string): void => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
};

const persistTheme = (theme: Theme): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    if (error instanceof DOMException) {
      return;
    }
    throw error;
  }
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
  } catch (error) {
    if (!(error instanceof DOMException)) {
      throw error;
    }
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ? "dark"
    : "light";
};

const initialTheme: Theme = getInitialTheme();
applyThemeToDocument(initialTheme);

const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,
  setTheme: (theme: Theme | string) => {
    const nextTheme: Theme = theme === "dark" ? "dark" : "light";
    applyThemeToDocument(nextTheme);
    persistTheme(nextTheme);
    set({ theme: nextTheme });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme: Theme = state.theme === "dark" ? "light" : "dark";
      applyThemeToDocument(nextTheme);
      persistTheme(nextTheme);
      return { theme: nextTheme };
    }),
}));

export default useThemeStore;
