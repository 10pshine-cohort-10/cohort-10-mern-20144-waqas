import React, { memo, useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiZap,
} from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

const MemoizedFooter = memo(Footer);

const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

export type VerificationState = "checking" | "valid" | "invalid";

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormErrors {
  password?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
}

export interface ResetPasswordApiResponse {
  statusCode?: number;
  message?: string;
  success?: boolean;
}

const RESET_HIGHLIGHTS: AuthVisualHighlight[] = [
  {
    icon: FiLock,
    title: "Strong Password Shield",
    desc: "Create a resilient new password to keep your notes and routines safeguarded.",
    color: "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10",
  },
  {
    icon: FiCheckCircle,
    title: "Immediate Token Revocation",
    desc: "Once updated, recovery links and stale sessions are terminated immediately.",
    color: "text-primary border-primary/30 bg-primary/10",
  },
  {
    icon: FiZap,
    title: "Seamless Workspace Re-entry",
    desc: "Log in with your fresh credentials and resume work with zero interruptions.",
    color: "text-neon-pink border-neon-pink/30 bg-neon-pink/10",
  },
];

/* Reset Password Page */

function ResetPassword(): React.JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [verificationState, setVerificationState] = useState<VerificationState>(
    () => (token ? "checking" : "invalid"),
  );
  const [verificationError, setVerificationError] = useState<string>(() =>
    token ? "" : "Missing password reset token in the link.",
  );

  const [formData, setFormData] = useState<ResetPasswordFormValues>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function checkToken(): Promise<void> {
      try {
        await api.get<{ message?: string }>(
          `/auth/verify-reset-token?token=${encodeURIComponent(token)}`,
        );
        if (isMounted) {
          setVerificationState("valid");
        }
      } catch (err: unknown) {
        if (isMounted) {
          setVerificationState("invalid");
          const axiosErr = err as AxiosError<{ message?: string }>;
          setVerificationError(
            axiosErr.response?.data?.message ||
              "This password reset link is invalid or has expired.",
          );
        }
      }
    }

    checkToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const validateForm = (): ResetPasswordFormErrors => {
    const errs: ResetPasswordFormErrors = {};
    if (!formData.password) {
      errs.password = "New password is required.";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    } else if (!STRONG_PASSWORD_REGEX.test(formData.password)) {
      errs.password =
        "Include at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = "Please confirm your new password.";
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response: AxiosResponse<ResetPasswordApiResponse> =
        await api.post<ResetPasswordApiResponse>("/auth/reset-password", {
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

      toast.success(
        response.data?.message ||
          "Password reset successfully! Please sign in with your new password.",
      );
      navigate("/login");
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{
        message?: string;
        errors?: Array<{ message?: string; field?: string }>;
      }>;
      const message =
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.errors?.[0]?.message ||
        (err instanceof Error ? err.message : null) ||
        "Failed to reset password. Please try again.";
      setServerError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasMinLength = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(formData.password);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <Seo
        title="Reset Password | Notiq"
        description="Choose a secure new password for your Notiq account."
      />

      <Navbar />

      <main className="relative flex flex-1 items-center justify-center px-4 pt-28 pb-12 sm:px-6 sm:pt-32 sm:pb-16 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl transform-gpu sm:h-96 sm:w-96"
        />

        <div className="notiq-float-card relative w-full max-w-4xl overflow-hidden rounded-3xl border border-border/80 bg-surface/90 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-card/90">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="relative border-b border-border/60 bg-gradient-to-br from-primary/10 via-background/40 to-neon-cyan/10 dark:border-white/10 lg:col-span-5 lg:border-r lg:border-b-0">
              <AuthVisualCard
                badge="Account Security"
                title="Create Your New Password."
                subtitle="Set a resilient password to protect your workspace notes, daily routines, and synchronized tasks."
                highlights={RESET_HIGHLIGHTS}
              />
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 lg:p-10">
              <div>
                <div className="flex items-center justify-between">
                  <Link
                    to="/"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-heading"
                  >
                    <img
                      src={logo}
                      alt="Notiq logo"
                      className="h-7 w-7 rounded-lg transition-transform duration-150 group-hover:scale-105"
                    />
                    <span>Notiq.</span>
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-heading"
                  >
                    <FiArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>

                {verificationState === "checking" && (
                  <div className="mt-12 flex flex-col items-center justify-center py-10 text-center">
                    <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <h2 className="mt-4 text-sm font-semibold text-heading">
                      Verifying Reset Link...
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Please wait while we confirm your security token.
                    </p>
                  </div>
                )}

                {verificationState === "invalid" && (
                  <div className="mt-8 rounded-2xl border border-neon-pink/40 bg-neon-pink/10 p-6">
                    <div className="flex items-start gap-3.5">
                      <div className="rounded-xl border border-neon-pink/40 bg-neon-pink/20 p-2 text-neon-pink">
                        <FiAlertCircle className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-sm font-semibold text-heading">
                          Link Expired or Invalid
                        </h2>
                        <p className="text-xs text-muted leading-relaxed">
                          {verificationError ||
                            "This password reset link is invalid or has expired for your security. Please request a fresh reset link."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                      <Link
                        to="/forgot-password"
                        className="notiq-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm"
                      >
                        <span>Request New Link</span>
                        <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>

                      <Link
                        to="/login"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/75 px-4 py-2.5 text-xs font-semibold text-heading transition-colors hover:bg-surface/90 sm:text-sm dark:bg-elevated/70"
                      >
                        <span>Return to Sign In</span>
                      </Link>
                    </div>
                  </div>
                )}

                {verificationState === "valid" && (
                  <>
                    <div className="mt-6">
                      <h1 className="text-xl font-bold tracking-tight text-heading sm:text-2xl">
                        Reset Password
                      </h1>
                      <p className="mt-1 text-xs text-muted sm:text-sm">
                        Please enter and confirm your new password below.
                      </p>
                    </div>

                    {serverError && (
                      <div
                        role="alert"
                        className="mt-4 flex items-start gap-2 rounded-xl border border-neon-pink/40 bg-neon-pink/10 p-3 text-xs font-medium text-neon-pink"
                      >
                        <FiAlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{serverError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label
                            htmlFor="reset-password"
                            className="block text-xs font-medium text-heading sm:text-sm"
                          >
                            New Password
                          </label>
                          <span className="text-[11px] text-muted">8+ characters</span>
                        </div>
                        <div className="relative">
                          <FiLock
                            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
                            aria-hidden="true"
                          />
                          <input
                            id="reset-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter new password"
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

                      <div>
                        <label
                          htmlFor="reset-confirm-password"
                          className="mb-1 block text-xs font-medium text-heading sm:text-sm"
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <FiLock
                            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
                            aria-hidden="true"
                          />
                          <input
                            id="reset-confirm-password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter new password"
                            aria-invalid={Boolean(errors.confirmPassword)}
                            className={`w-full rounded-xl border bg-surface/75 py-2.5 pr-10 pl-9 text-xs text-heading placeholder:text-muted/70 transition-colors duration-150 focus:outline-none focus:ring-2 dark:bg-elevated/70 sm:text-sm ${
                              errors.confirmPassword
                                ? "border-neon-pink/70 focus:ring-neon-pink/35"
                                : "border-border focus:border-primary/60 focus:ring-primary/25"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={
                              showConfirmPassword ? "Hide password" : "Show password"
                            }
                            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1 text-muted transition-colors duration-150 hover:text-heading"
                          >
                            {showConfirmPassword ? (
                              <FiEyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <FiEye className="h-4 w-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p
                            role="alert"
                            className="mt-1 flex items-center gap-1 text-[11px] font-medium text-neon-pink sm:text-xs"
                          >
                            <FiAlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span>{errors.confirmPassword}</span>
                          </p>
                        )}
                      </div>

                      <div className="rounded-xl border border-border/60 bg-surface/50 p-3 text-[11px] text-muted dark:bg-elevated/40">
                        <p className="font-medium text-heading">Password Requirements:</p>
                        <div className="mt-2 grid grid-cols-2 gap-1.5">
                          <span
                            className={`flex items-center gap-1 ${
                              hasMinLength ? "text-neon-cyan" : "text-muted"
                            }`}
                          >
                            <FiCheck className="h-3 w-3" /> At least 8 characters
                          </span>
                          <span
                            className={`flex items-center gap-1 ${
                              hasUpper && hasLower ? "text-neon-cyan" : "text-muted"
                            }`}
                          >
                            <FiCheck className="h-3 w-3" /> Upper & lowercase
                          </span>
                          <span
                            className={`flex items-center gap-1 ${
                              hasNumber ? "text-neon-cyan" : "text-muted"
                            }`}
                          >
                            <FiCheck className="h-3 w-3" /> At least 1 number
                          </span>
                          <span
                            className={`flex items-center gap-1 ${
                              hasSpecial ? "text-neon-cyan" : "text-muted"
                            }`}
                          >
                            <FiCheck className="h-3 w-3" /> 1 special character
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="notiq-btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm disabled:cursor-not-allowed disabled:opacity-65"
                      >
                        <span>{isSubmitting ? "Updating Password..." : "Update Password"}</span>
                        {!isSubmitting && <FiArrowRight className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </form>
                  </>
                )}
              </div>

              <div className="mt-8 border-t border-border/60 pt-4 text-center dark:border-white/10">
                <p className="text-xs text-muted">
                  Remember your old password?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-primary transition-colors hover:text-neon-cyan"
                  >
                    Sign In here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MemoizedFooter />
    </div>
  );
}

export default ResetPassword;
