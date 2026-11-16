import { create } from "zustand";

export const INACTIVITY_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("notiq_user");
    const lastActiveStr = localStorage.getItem("notiq_last_active");

    if (!raw) return null;

    if (lastActiveStr) {
      const lastActive = parseInt(lastActiveStr, 10);
      if (!Number.isNaN(lastActive) && Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
        // Expired after 24 hours of inactivity
        localStorage.removeItem("notiq_user");
        localStorage.removeItem("notiq_last_active");
        return null;
      }
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const initialUser = getStoredUser();

const useAuthStore = create((set, get) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  isLoading: false,

  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem("notiq_user", JSON.stringify(user));
        localStorage.setItem("notiq_last_active", Date.now().toString());
      } else {
        localStorage.removeItem("notiq_user");
        localStorage.removeItem("notiq_last_active");
      }
    } catch {
      // Ignore localStorage write errors
    }
    set({
      user,
      isAuthenticated: Boolean(user),
    });
  },

  updateActivity: () => {
    try {
      if (get().isAuthenticated) {
        localStorage.setItem("notiq_last_active", Date.now().toString());
      }
    } catch {
      // Ignore localStorage write errors
    }
  },

  isSessionExpired: () => {
    try {
      const lastActiveStr = localStorage.getItem("notiq_last_active");
      if (!lastActiveStr) return true;
      const lastActive = parseInt(lastActiveStr, 10);
      if (Number.isNaN(lastActive)) return true;
      return Date.now() - lastActive > INACTIVITY_TIMEOUT_MS;
    } catch {
      return false;
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  clearAuth: () => {
    try {
      localStorage.removeItem("notiq_user");
      localStorage.removeItem("notiq_last_active");
    } catch {
      // Ignore localStorage write errors
    }
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
