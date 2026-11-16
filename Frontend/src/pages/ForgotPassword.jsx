import { memo, useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiRotateCw,
  FiShield,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import AuthVisualCard from "../components/auth/AuthVisualCard";
import Seo from "../components/common/Seo";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import api from "../services/api";

const MemoizedFooter = memo(Footer);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FORGOT_HIGHLIGHTS = [
  {
    icon: FiMail,
    title: "Secure Email Dispatch",
    desc: "We send a private, single-use password recovery link to your inbox.",
    color: "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10",
  },
  {
    icon: FiClock,
    title: "15-Minute Expiry",
    desc: "Time-limited security tokens protect your account against unauthorized reuse.",
    color: "text-primary border-primary/30 bg-primary/10",
  },
  {
    icon: FiShield,
    title: "Guarded & Private",
    desc: "Your credentials and workspace remain shielded with industry-standard encryption.",
    color: "text-neon-pink border-neon-pink/30 bg-neon-pink/10",
  },
];

/* Forgot Password Page */

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (value) => {
    const trimmed = (value || "").trim();
    if (!trimmed) {
      return "Email address is required.";
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationError = validate(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setIsSubmitted(true);
      toast.success(
        response.data?.message ||
          "Password reset link sent! Please check your email inbox.",
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        "Failed to send reset link. Please verify your email and try again.";
      setServerError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAgain = () => {
    setIsSubmitted(false);
    setServerError("");
    setError("");
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <Seo
        title="Forgot Password | Notiq"
        description="Reset your Notiq account password securely with our time-limited recovery link."
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
                badge="Account Recovery"
                title="Restore Your Access in Seconds."
                subtitle="Enter your email to receive a single-use reset link and get back to your calm, productive workspace."
                highlights={FORGOT_HIGHLIGHTS}
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

                <div className="mt-6">
                  <h1 className="text-xl font-bold tracking-tight text-heading sm:text-2xl">
                    Forgot Password?
                  </h1>
                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    {isSubmitted
                      ? "A recovery email has been dispatched."
                      : "No worries! Enter your registered email address and we'll send you a password reset link."}
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

                {isSubmitted ? (
                  <div className="mt-6 rounded-2xl border border-neon-cyan/30 bg-neon-cyan/5 p-5 sm:p-6">
                    <div className="flex items-start gap-3.5">
                      <div className="rounded-xl border border-neon-cyan/40 bg-neon-cyan/15 p-2 text-neon-cyan">
                        <FiCheckCircle className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-sm font-semibold text-heading">
                          Check Your Inbox
                        </h2>
                        <p className="text-xs text-muted leading-relaxed">
                          We sent a time-limited password reset link to{" "}
                          <span className="font-semibold text-heading">{email}</span>. Please click the link within 15 minutes.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                      <Link
                        to="/login"
                        className="notiq-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm"
                      >
                        <span>Return to Sign In</span>
                        <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>

                      <button
                        type="button"
                        onClick={handleResetAgain}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/75 px-4 py-2.5 text-xs font-semibold text-heading transition-colors hover:bg-surface/90 sm:text-sm dark:bg-elevated/70"
                      >
                        <FiRotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Resend Email</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                    <div>
                      <label
                        htmlFor="forgot-email"
                        className="mb-1 block text-xs font-medium text-heading sm:text-sm"
                      >
                        Registered Email Address
                      </label>
                      <div className="relative">
                        <FiMail
                          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
                          aria-hidden="true"
                        />
                        <input
                          id="forgot-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          aria-invalid={Boolean(error)}
                          className={`w-full rounded-xl border bg-surface/75 py-2.5 pr-3 pl-9 text-xs text-heading placeholder:text-muted/70 transition-colors duration-150 focus:outline-none focus:ring-2 dark:bg-elevated/70 sm:text-sm ${
                            error
                              ? "border-neon-pink/70 focus:ring-neon-pink/35"
                              : "border-border focus:border-primary/60 focus:ring-primary/25"
                          }`}
                        />
                      </div>
                      {error && (
                        <p
                          role="alert"
                          className="mt-1 flex items-center gap-1 text-[11px] font-medium text-neon-pink sm:text-xs"
                        >
                          <FiAlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <span>{error}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="notiq-btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      <span>{isSubmitting ? "Sending Link..." : "Send Reset Link"}</span>
                      {!isSubmitting && <FiArrowRight className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-8 border-t border-border/60 pt-4 text-center dark:border-white/10">
                <p className="text-xs text-muted">
                  Remember your password?{" "}
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

export default ForgotPassword;
