import { create } from "zustand";

export const INACTIVITY_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface User {
  id: number | string;
  username: string;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponseData {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthApiResponse {
  statusCode?: number;
  data?: AuthResponseData;
  user?: User;
  message?: string;
  success?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateActivity: () => void;
  isSessionExpired: () => boolean;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

// In-memory fallback for the last activity timestamp when localStorage writes fail
let inMemoryLastActive: number | null = null;

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem("notiq_user");
    const lastActiveStr = localStorage.getItem("notiq_last_active");

    if (!raw) return null;

    if (lastActiveStr) {
      const lastActive = parseInt(lastActiveStr, 10);
      if (!Number.isNaN(lastActive)) {
        if (Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
          // Expired after 24 hours of inactivity
          try {
            localStorage.removeItem("notiq_user");
            localStorage.removeItem("notiq_last_active");
          } catch {
            // Ignore removal errors
          }
          return null;
        }
        inMemoryLastActive = lastActive;
      }
    }

    const parsed: User = JSON.parse(raw);
    if (inMemoryLastActive === null) {
      inMemoryLastActive = Date.now();
    }
    return parsed;
  } catch {
    return null;
  }
};

const initialUser: User | null = getStoredUser();

const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  isLoading: false,

  setUser: (user: User | null) => {
    const now = Date.now();
    if (user) {
      inMemoryLastActive = now;
      try {
        localStorage.setItem("notiq_user", JSON.stringify(user));
        localStorage.setItem("notiq_last_active", now.toString());
      } catch {
        // Ignore localStorage write failures; inMemoryLastActive guarantees session integrity
      }
    } else {
      inMemoryLastActive = null;
      try {
        localStorage.removeItem("notiq_user");
        localStorage.removeItem("notiq_last_active");
      } catch {
        // Ignore localStorage removal errors
      }
    }

    set({
      user,
      isAuthenticated: Boolean(user),
    });
  },

  updateActivity: () => {
    if (get().isAuthenticated) {
      const now = Date.now();
      inMemoryLastActive = now;
      try {
        localStorage.setItem("notiq_last_active", now.toString());
      } catch {
        // Ignore localStorage write errors
      }
    }
  },

  isSessionExpired: (): boolean => {
    if (!get().isAuthenticated) return true;

    const now = Date.now();
    let persistedTimestamp: number | null = null;

    try {
      const lastActiveStr = localStorage.getItem("notiq_last_active");
      if (lastActiveStr) {
        const parsed = parseInt(lastActiveStr, 10);
        if (!Number.isNaN(parsed)) {
          persistedTimestamp = parsed;
        }
      }
    } catch {
      // localStorage read failed; rely on in-memory timestamp
    }

    // Determine the most authoritative recent activity timestamp
    const effectiveLastActive =
      persistedTimestamp !== null && inMemoryLastActive !== null
        ? Math.max(persistedTimestamp, inMemoryLastActive)
        : (persistedTimestamp ?? inMemoryLastActive);

    // If neither persisted nor in-memory timestamp exists, session is considered expired
    if (effectiveLastActive === null) {
      return true;
    }

    return now - effectiveLastActive > INACTIVITY_TIMEOUT_MS;
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  clearAuth: () => {
    inMemoryLastActive = null;
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
