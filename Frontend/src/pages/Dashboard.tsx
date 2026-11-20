import React, { useCallback, useEffect, useRef } from "react";
import { FiClock, FiLogOut, FiShield, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import Seo from "../components/common/Seo";
import api from "../services/api";
import useAuthStore, {
  INACTIVITY_TIMEOUT_MS,
  type AuthState,
  type User,
} from "../store/useAuthStore";

/* Dashboard Page */

function Dashboard(): React.JSX.Element {
  const navigate = useNavigate();
  const user: User | null = useAuthStore((state: AuthState) => state.user);
  const isAuthenticated: boolean = useAuthStore(
    (state: AuthState) => state.isAuthenticated,
  );
  const clearAuth = useAuthStore((state: AuthState) => state.clearAuth);
  const updateActivity = useAuthStore((state: AuthState) => state.updateActivity);
  const isSessionExpired = useAuthStore(
    (state: AuthState) => state.isSessionExpired,
  );

  const lastThrottleRef = useRef<number>(0);

  const handleLogout = useCallback((): void => {
    api.post("/auth/logout").catch(() => {});
    clearAuth();
    toast.success("You have been signed out successfully.");
    navigate("/login", { replace: true });
  }, [clearAuth, navigate]);

  const handleInactivityLogout = useCallback((): void => {
    api.post("/auth/logout").catch(() => {});
    clearAuth();
    toast.warning(
      "Your session expired due to 24 hours of inactivity. Please sign in again.",
    );
    navigate("/login", { replace: true });
  }, [clearAuth, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      clearAuth();
      navigate("/login", { replace: true });
      return undefined;
    }

    if (isSessionExpired()) {
      handleInactivityLogout();
      return undefined;
    }

    updateActivity();

    const handleUserInteraction = (): void => {
      const now = Date.now();
      if (now - lastThrottleRef.current > 15000) {
        lastThrottleRef.current = now;
        updateActivity();
      }
    };

    const interactionEvents: readonly string[] = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    interactionEvents.forEach((event) => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });

    const checkInterval = setInterval(() => {
      try {
        const lastActiveStr = localStorage.getItem("notiq_last_active");
        if (lastActiveStr) {
          const lastActive = parseInt(lastActiveStr, 10);
          if (
            !Number.isNaN(lastActive) &&
            Date.now() - lastActive > INACTIVITY_TIMEOUT_MS
          ) {
            handleInactivityLogout();
          }
        }
      } catch {
        // Ignore check errors
      }
    }, 30000);

    const handleWindowFocus = (): void => {
      try {
        const lastActiveStr = localStorage.getItem("notiq_last_active");
        if (lastActiveStr) {
          const lastActive = parseInt(lastActiveStr, 10);
          if (
            !Number.isNaN(lastActive) &&
            Date.now() - lastActive > INACTIVITY_TIMEOUT_MS
          ) {
            handleInactivityLogout();
            return;
          }
        }
        handleUserInteraction();
      } catch {
        // Ignore check errors
      }
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      interactionEvents.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
      window.removeEventListener("focus", handleWindowFocus);
      clearInterval(checkInterval);
    };
  }, [
    isAuthenticated,
    user,
    navigate,
    clearAuth,
    updateActivity,
    isSessionExpired,
    handleInactivityLogout,
  ]);

  const displayName: string =
    user?.name || user?.username || user?.email?.split("@")[0] || "Friend";
  const userEmail: string = user?.email || "";

  return (
    <>
      <Seo
        title="Dashboard | Notiq — Your Personal Workspace"
        description="Welcome to your Notiq dashboard."
        robots="noindex, nofollow"
      />
      <div className="notiq-hero-bg relative flex min-h-screen items-center justify-center p-4 sm:p-6 text-body">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/12 blur-3xl transform-gpu"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-neon-cyan/12 blur-3xl transform-gpu"
        />

        <div className="notiq-float-card relative w-full max-w-lg overflow-hidden rounded-3xl border border-border/80 p-8 sm:p-10 shadow-2xl text-center transform-gpu">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--notiq-gradient-neon-subtle)] p-2 ring-1 ring-primary/25 shadow-sm">
            <img
              src={logo}
              alt="Notiq logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface/90 px-3.5 py-1 text-xs font-semibold text-heading shadow-xs dark:bg-elevated/90">
            <FiShield className="h-3.5 w-3.5 text-neon-cyan" aria-hidden="true" />
            <span>Authenticated Workspace</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-heading">
            Welcome, <span className="notiq-gradient-text">{displayName}</span>!
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted">
            You are successfully logged in to Notiq. Your personal dashboard session is active and secure.
          </p>

          {userEmail && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-4 py-1.5 text-xs text-muted dark:bg-elevated/70">
              <FiUser className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span className="truncate max-w-xs">{userEmail}</span>
            </div>
          )}

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted">
            <FiClock className="h-3 w-3 text-neon-cyan" aria-hidden="true" />
            <span>Auto-logout after 24 hours of inactivity</span>
          </div>

          <div className="mt-8 border-t border-border/60 pt-6">
            <button
              type="button"
              onClick={handleLogout}
              className="notiq-btn-primary inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl px-8 py-3 text-sm font-semibold transition-transform duration-150 active:scale-95 shadow-md"
            >
              <FiLogOut className="h-4 w-4" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
