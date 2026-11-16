import { memo, useState } from "react";
import {
  FiAlertCircle,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiLayers,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import AuthVisualCard from "../components/auth/AuthVisualCard";
import Seo from "../components/common/Seo";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import api from "../services/api";

const MemoizedFooter = memo(Footer);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

function validateRegister({ name, email, password, confirmPassword }) {
  const errors = {};
  const trimmedName = (name || "").trim();
  const trimmedEmail = (email || "").trim().toLowerCase();

  if (!trimmedName) {
    errors.name = "Full name is required.";
  } else if (trimmedName.length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  if (!trimmedEmail) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!STRONG_PASSWORD_REGEX.test(password)) {
    errors.password =
      "Include uppercase, lowercase, number, and special character.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

const REGISTER_HIGHLIGHTS = [
  {
    icon: FiLayers,
    title: "Structured Notes & Routines",
    desc: "Build consistency with to-dos, labels, checklists, and daily habits.",
    color: "text-primary border-primary/30 bg-primary/10",
  },
  {
    icon: FiFileText,
    title: "Document Organization",
    desc: "Keep project specs, meeting logs, and drafts in one place.",
    color: "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10",
  },
  {
    icon: FiShield,
    title: "Private & Cloud-Ready",
    desc: "Your data stays private, encrypted, and backed up in real time.",
    color: "text-neon-pink border-neon-pink/30 bg-neon-pink/10",
  },
];

/* Register Page */

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    const validationErrors = validateRegister(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/register", {
        username: formData.name.trim(),
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(
        response.data?.message || "Account created successfully! Please sign in.",
      );
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please check your information and try again.";
      setServerError(message);

      if (message.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: message }));
      } else if (message.toLowerCase().includes("username")) {
        setErrors((prev) => ({ ...prev, name: message }));
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Register | Notiq — Create Your Free Workspace"
        description="Join Notiq to organize notes, daily tasks, reminders, and personal routines in one calm, vibrant workspace."
        keywords="Notiq registration, create account, sign up notes app"
        robots="noindex, follow"
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
                    badge="Create Free Account"
                    title="Organize Thoughts, Unleash Your Potential."
                    subtitle="Join thousands who plan routines, capture quick notes, and maintain effortless everyday focus."
                    highlights={REGISTER_HIGHLIGHTS}
                  />
                </div>

                <div className="flex flex-col justify-between p-6 sm:p-7 lg:col-span-7 lg:p-8">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
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
                        Sign Up
                      </span>
                    </div>

                    <h1 className="text-xl font-extrabold tracking-tight text-heading sm:text-2xl">
                      Create your <span className="notiq-gradient-text">free account</span>
                    </h1>
                    <p className="mt-1 text-xs text-muted sm:text-sm">
                      Start organizing your notes, tasks, and habits in seconds.
                    </p>

                    {serverError && (
                      <div
                        role="alert"
                        className="mt-3 flex items-start gap-2 rounded-xl border border-neon-pink/40 bg-neon-pink/10 p-2.5 text-xs font-medium text-neon-pink"
                      >
                        <FiAlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{serverError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="mt-3.5 space-y-2.5 sm:space-y-3">
                      <div>
                        <label
                          htmlFor="register-name"
                          className="mb-1 block text-xs font-medium text-heading sm:text-sm"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <FiUser
                            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
                            aria-hidden="true"
                          />
                          <input
                            id="register-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Waqas Tariq"
                            aria-invalid={Boolean(errors.name)}
                            className={`w-full rounded-xl border bg-surface/75 py-2 pr-3 pl-9 text-xs text-heading placeholder:text-muted/70 transition-colors duration-150 focus:outline-none focus:ring-2 dark:bg-elevated/70 sm:text-sm ${
                              errors.name
                                ? "border-neon-pink/70 focus:ring-neon-pink/35"
                                : "border-border focus:border-primary/60 focus:ring-primary/25"
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p
                            role="alert"
                            className="mt-1 flex items-center gap-1 text-[11px] font-medium text-neon-pink sm:text-xs"
                          >
                            <FiAlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="register-email"
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
                            id="register-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            aria-invalid={Boolean(errors.email)}
                            className={`w-full rounded-xl border bg-surface/75 py-2 pr-3 pl-9 text-xs text-heading placeholder:text-muted/70 transition-colors duration-150 focus:outline-none focus:ring-2 dark:bg-elevated/70 sm:text-sm ${
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
                            htmlFor="register-password"
                            className="block text-xs font-medium text-heading sm:text-sm"
                          >
                            Password
                          </label>
                          <span className="text-[11px] text-muted">Min 8 chars, mixed case, # & sym</span>
                        </div>
                        <div className="relative">
                          <FiLock
                            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
                            aria-hidden="true"
                          />
                          <input
                            id="register-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            aria-invalid={Boolean(errors.password)}
                            className={`w-full rounded-xl border bg-surface/75 py-2 pr-10 pl-9 text-xs text-heading placeholder:text-muted/70 transition-colors duration-150 focus:outline-none focus:ring-2 dark:bg-elevated/70 sm:text-sm ${
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
                          htmlFor="register-confirm-password"
                          className="mb-1 block text-xs font-medium text-heading sm:text-sm"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <FiLock
                            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
                            aria-hidden="true"
                          />
                          <input
                            id="register-confirm-password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            aria-invalid={Boolean(errors.confirmPassword)}
                            className={`w-full rounded-xl border bg-surface/75 py-2 pr-10 pl-9 text-xs text-heading placeholder:text-muted/70 transition-colors duration-150 focus:outline-none focus:ring-2 dark:bg-elevated/70 sm:text-sm ${
                              errors.confirmPassword
                                ? "border-neon-pink/70 focus:ring-neon-pink/35"
                                : "border-border focus:border-primary/60 focus:ring-primary/25"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
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

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="notiq-btn-primary mt-1 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm disabled:cursor-not-allowed disabled:opacity-65"
                      >
                        <span>{isSubmitting ? "Creating account..." : "Register"}</span>
                        {!isSubmitting && <FiArrowRight className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </form>
                  </div>

                  <div className="mt-4 border-t border-border/70 pt-3 text-center">
                    <p className="text-xs text-muted sm:text-sm">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="font-semibold text-primary transition-colors hover:text-neon-cyan"
                      >
                        Sign in
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

export default Register;
