import { create } from "zustand";

const THEME_STORAGE_KEY = "notiq-theme";

const applyThemeToDocument = (theme) => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
};

const persistTheme = (theme) => {
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

const getInitialTheme = () => {
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

const initialTheme = getInitialTheme();
applyThemeToDocument(initialTheme);

const useThemeStore = create((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    const nextTheme = theme === "dark" ? "dark" : "light";
    applyThemeToDocument(nextTheme);
    persistTheme(nextTheme);
    set({ theme: nextTheme });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      applyThemeToDocument(nextTheme);
      persistTheme(nextTheme);
      return { theme: nextTheme };
    }),
}));

export default useThemeStore;

