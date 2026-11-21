import React, { memo, useState } from "react";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { AxiosError, AxiosResponse } from "axios";
import logo from "../assets/logo.png";
import AuthVisualCard, {
  type AuthVisualHighlight,
} from "../components/auth/AuthVisualCard";
import Seo from "../components/common/Seo";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import api from "../services/api";
import useAuthStore, {
  type AuthApiResponse,
  type AuthResponseData,
  type AuthState,
  type User,
} from "../store/useAuthStore";

const MemoizedFooter = memo(Footer);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

function validateLogin({ email, password }: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const trimmed = (email || "").trim();

  if (!trimmed) {
    errors.email = "Email address is required.";
  } else if (trimmed.includes("@") && !EMAIL_REGEX.test(trimmed)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

const LOGIN_HIGHLIGHTS: AuthVisualHighlight[] = [
  {
    icon: FiCheckCircle,
    title: "Instant Workspace Access",
    desc: "Pick up right where you left off across notes, tasks, and routines.",
    color: "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10",
  },
  {
    icon: FiShield,
    title: "Encrypted & Private",
    desc: "Advanced protection keeps your personal notes and credentials secure.",
    color: "text-primary border-primary/30 bg-primary/10",
  },
  {
    icon: FiZap,
    title: "Smooth Everyday Clarity",
    desc: "Optimized for lightning-fast loads with light and dark themes.",
    color: "text-neon-pink border-neon-pink/30 bg-neon-pink/10",
  },
];

/* Login Page */

function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const setUser = useAuthStore((state: AuthState) => state.setUser);

  const [formData, setFormData] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setServerError("");

    const validationErrors = validateLogin(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response: AxiosResponse<AuthApiResponse> = await api.post<AuthApiResponse>(
        "/auth/login",
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        },
      );

      const payload: AuthResponseData | AuthApiResponse | undefined =
        response.data?.data || response.data;
      const authenticatedUser: User | undefined = payload?.user;

      if (!authenticatedUser) {
        throw new Error("Invalid response format from server.");
      }

      setUser(authenticatedUser);
      toast.success(response.data?.message || "Welcome back to Notiq!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{
        message?: string;
        errors?: Array<{ message?: string; field?: string }>;
      }>;
      const message =
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.errors?.[0]?.message ||
        (err instanceof Error ? err.message : null) ||
        "Failed to sign in. Please check your credentials.";
      setServerError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Sign In — Notiq Workspace"
        description="Sign in to your private Notiq workspace to access your notes, tasks, to-do lists, reminders, and daily routines."
        keywords="Notiq sign in, login, productivity workspace, notes login"
      />

      <div className="notiq-hero-bg relative flex min-h-screen flex-col overflow-x-clip text-body">
        <Navbar />

        <main className="relative flex flex-1 items-center justify-center px-4 pt-28 pb-12 sm:px-6 sm:pt-32 sm:pb-16 lg:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-20 left-1/4 h-64 w-64 rounded-full bg-primary/15 blur-2xl transform-gpu"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-1/4 bottom-12 h-64 w-64 rounded-full bg-neon-cyan/15 blur-2xl transform-gpu"
          />

          <div className="relative mx-auto w-full max-w-5xl transform-gpu">
            <div className="notiq-float-card relative overflow-hidden rounded-3xl border border-border/80 shadow-2xl">
              <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
                <div className="hidden lg:col-span-5 lg:flex lg:flex-col border-r border-border/60 bg-gradient-to-br from-surface/80 via-surface/60 to-surface/40 dark:from-elevated/80 dark:via-elevated/60 dark:to-elevated/40">
                  <AuthVisualCard
                    badge="Notiq Cloud Workspace"
                    title="Where Focus Meets Effortless Clarity."
                    subtitle="Sign in to open your private, organized workspace for ideas, tasks, reminders, and daily habits."
                    highlights={LOGIN_HIGHLIGHTS}
                  />
                </div>

                <div className="flex flex-col justify-between p-6 sm:p-7 lg:col-span-7 lg:p-8">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <Link
                        to="/"
                        className="group inline-flex items-center gap-2 transition-opacity hover:opacity-90"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--notiq-gradient-neon-subtle)] p-1 ring-1 ring-primary/25 transition-transform duration-150 group-hover:scale-105">
                          <img
                            src={logo}
                            alt="Notiq logo"
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <span className="notiq-gradient-text text-lg font-bold tracking-tight">
                          Notiq
                        </span>
                      </Link>

                      <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        Sign In
                      </span>
                    </div>

                    <h1 className="text-xl font-extrabold tracking-tight text-heading sm:text-2xl">
                      Welcome back to <span className="notiq-gradient-text">Notiq</span>
                    </h1>
                    <p className="mt-1 text-xs text-muted sm:text-sm">
                      Enter your account details to access your notes, tasks, and daily routines.
                    </p>

                    {serverError && (
                      <div
                        role="alert"
                        className="mt-3.5 flex items-start gap-2 rounded-xl border border-neon-pink/40 bg-neon-pink/10 p-2.5 text-xs font-medium text-neon-pink"
                      >
                        <FiAlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{serverError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3.5">
                      <div>
                        <label
                          htmlFor="login-email"
                          className="mb-1 block text-xs font-medium text-heading sm:text-sm"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <FiMail
                            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
                            aria-hidden="true"
                          />
                          <input
                            id="login-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            aria-invalid={Boolean(errors.email)}
                            className={`w-full rounded-xl border bg-surface/75 py-2.5 pr-3 pl-9 text-xs text-heading placeholder:text-muted/70 transition-colors duration-150 focus:outline-none focus:ring-2 dark:bg-elevated/70 sm:text-sm ${
                              errors.email
                                ? "border-neon-pink/70 focus:ring-neon-pink/35"
                                : "border-border focus:border-primary/60 focus:ring-primary/25"
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p
                            role="alert"
                            className="mt-1 flex items-center gap-1 text-[11px] font-medium text-neon-pink sm:text-xs"
                          >
                            <FiAlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label
                            htmlFor="login-password"
                            className="block text-xs font-medium text-heading sm:text-sm"
                          >
                            Password
                          </label>
                          <Link
                            to="/forgot-password"
                            className="text-[11px] font-medium text-primary transition-colors hover:text-neon-cyan"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <FiLock
                            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
                            aria-hidden="true"
                          />
                          <input
                            id="login-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            aria-invalid={Boolean(errors.password)}
                            className={`w-full rounded-xl border bg-surface/75 py-2.5 pr-10 pl-9 text-xs text-heading placeholder:text-muted/70 transition-colors duration-150 focus:outline-none focus:ring-2 dark:bg-elevated/70 sm:text-sm ${
                              errors.password
                                ? "border-neon-pink/70 focus:ring-neon-pink/35"
                                : "border-border focus:border-primary/60 focus:ring-primary/25"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1 text-muted transition-colors duration-150 hover:text-heading"
                          >
                            {showPassword ? (
                              <FiEyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <FiEye className="h-4 w-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p
                            role="alert"
                            className="mt-1 flex items-center gap-1 text-[11px] font-medium text-neon-pink sm:text-xs"
                          >
                            <FiAlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span>{errors.password}</span>
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="notiq-btn-primary mt-1 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm disabled:cursor-not-allowed disabled:opacity-65"
                      >
                        <span>{isSubmitting ? "Signing in..." : "Login"}</span>
                        {!isSubmitting && <FiArrowRight className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </form>
                  </div>

                  <div className="mt-5 border-t border-border/70 pt-3.5 text-center">
                    <p className="text-xs text-muted sm:text-sm">
                      Don&apos;t have an account?{" "}
                      <Link
                        to="/register"
                        className="font-semibold text-primary transition-colors hover:text-neon-cyan"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <MemoizedFooter />
      </div>
    </>
  );
}

export default Login;
