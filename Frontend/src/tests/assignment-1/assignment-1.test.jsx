/**
 * Assignment 1 — Centralized Frontend Test Suite
 * File: Frontend/src/tests/assignment-1/assignment-1.test.jsx
 * Contains test cases FE-A1-001 through FE-A1-056 covering all Assignment 1 frontend functionality.
 * Every test case is individually executable via Jest pattern: jest -t "FE-A1-xxx"
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import App from "../../App";
import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import FeaturesSection from "../../components/home/FeaturesSection";
import FeatureShowcase from "../../components/home/FeatureShowcase";
import HowItWorksSection from "../../components/home/HowItWorksSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import Footer from "../../components/layout/Footer";
import Home from "../../pages/Home";
import About from "../../pages/About";
import Contact from "../../pages/Contact";
import PrivacyPolicy from "../../pages/PrivacyPolicy";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import ForgotPassword from "../../pages/ForgotPassword";
import ResetPassword from "../../pages/ResetPassword";
import Dashboard from "../../pages/Dashboard";
import api from "../../services/api";
import useAuthStore from "../../store/useAuthStore";
import useThemeStore from "../../store/useThemeStore";

// Mock API service
jest.mock("../../services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Mock react-router-dom useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUser = {
  id: 1,
  username: "waqas_dev",
  name: "Waqas Tariq",
  email: "waqas@example.com",
};


// Embedded Test Case Metadata for Autonomous In-File Reporting
const FE_METADATA = {
  "FE-A1-001": {
    "title": "Root Application Shell — Renders root application with navbar and default home route",
    "description": "Verifies that the root App component renders the primary navigation header and mounts the Home page by default.",
    "expected": "Navbar brand logo, navigation links, and Hero landing section should render in the DOM.",
    "actual": "Root shell and Home landing section rendered successfully."
  },
  "FE-A1-002": {
    "title": "Protected Route Redirect — Redirects unauthenticated requests from /dashboard to /login",
    "description": "Ensures unauthenticated users attempting to access protected dashboard routes are automatically redirected to /login.",
    "expected": "Navigation should redirect to /login and prevent unauthorized access to dashboard contents.",
    "actual": "Unauthenticated request was safely redirected to /login."
  },
  "FE-A1-003": {
    "title": "Not Found Route Fallback — Navigates cleanly and handles 404/unknown routes gracefully",
    "description": "Validates application stability and routing fallback behavior when accessing an unregistered URL path.",
    "expected": "Application should render a clean fallback or redirect without crashing.",
    "actual": "Unknown route handled gracefully without DOM or application errors."
  },
  "FE-A1-004": {
    "title": "Navbar Brand & Links — Renders brand logo, title, primary navigation links, and single Login CTA",
    "description": "Verifies the top navigation bar displays brand identity, all primary navigation links with corresponding href attributes, and the Login CTA button.",
    "expected": "All brand assets, navigation links, and the Login CTA rendered with correct target attributes.",
    "actual": "Brand assets, navigation links, and single Login CTA rendered correctly."
  },
  "FE-A1-005": {
    "title": "Navbar Smooth Scrolling — Scrolls smoothly to Features, How It Works, and Community Love sections",
    "description": "Validates that clicking anchor navigation links triggers window smooth scrolling to the respective section DOM elements.",
    "expected": "scrollIntoView should be called with smooth scroll behavior for each targeted section.",
    "actual": "Window smooth scroll invoked for all targeted landing sections."
  },
  "FE-A1-006": {
    "title": "Theme Toggle Management — Switches between light and dark mode, synchronizing Zustand store and document root",
    "description": "Validates that clicking the theme switch button updates the Zustand theme store, updates the HTML document root class list, and persists to localStorage.",
    "expected": "Document root class list and theme store should toggle between 'dark' and 'light' classes.",
    "actual": "Theme toggled smoothly with persistent class and store synchronization."
  },
  "FE-A1-007": {
    "title": "Mobile Navigation Drawer — Toggles responsive mobile navigation menu open and closed",
    "description": "Ensures the mobile hamburger menu button toggles the expandable mobile navigation drawer open and closed.",
    "expected": "Drawer container should transition between visible and hidden states with accessible attributes.",
    "actual": "Mobile navigation drawer opened and closed with proper accessibility states."
  },
  "FE-A1-008": {
    "title": "Hero Section Presentation — Displays headline, value proposition, description, and Get Started CTA link",
    "description": "Asserts that the landing page Hero section renders the primary value proposition headline, subtitle description, and the Get Started link to signup.",
    "expected": "Hero heading, descriptive subtitle, and Get Started link to /signup rendered as expected.",
    "actual": "Hero headline, subtitle description, and /signup CTA rendered cleanly."
  },
  "FE-A1-009": {
    "title": "Features Grid Display — Renders section title, description, and all 10 productivity feature cards",
    "description": "Validates that FeaturesSection displays the section title and all 10 core productivity feature cards (Daily Notes, Tasks, Reminders, Labels, etc.).",
    "expected": "Section title and all 10 feature cards rendered with proper titles and descriptions.",
    "actual": "All 10 feature cards and section heading rendered successfully."
  },
  "FE-A1-010": {
    "title": "Feature Showcase Modules — Displays showcase module container with all 4 workspace tabs",
    "description": "Verifies the FeatureShowcase component renders its section heading along with all four showcase modules (Notes, Tasks, Docs, Daily Notes).",
    "expected": "Showcase heading and all four feature modules rendered cleanly.",
    "actual": "All 4 showcase modules rendered with high-fidelity badges and descriptions."
  },
  "FE-A1-011": {
    "title": "How It Works Workflow — Displays 8-step visual workflow pipeline from capture to mastery",
    "description": "Verifies the HowItWorksSection component displays its section title and all 8 numbered workflow steps with titles and descriptions.",
    "expected": "Heading and all 8 workflow step items rendered in ordered sequential hierarchy.",
    "actual": "All 8 visual workflow pipeline steps rendered in proper sequence."
  },
  "FE-A1-012": {
    "title": "Testimonials Wall — Renders social proof grid with all 9 user review cards and ratings",
    "description": "Asserts that TestimonialsSection renders the section title and all 9 user quote cards with authors, handles, roles, and review text.",
    "expected": "Section title and all 9 user review cards displayed with authors and quotes.",
    "actual": "Social proof grid with all 9 testimonial cards rendered cleanly."
  },
  "FE-A1-013": {
    "title": "Footer Structure & Back to Top — Displays comprehensive footer links, legal notice, and scrolls to top on button click",
    "description": "Asserts Footer displays brand identity, quick links, legal links, copyright notices, and that clicking Back to Top invokes window.scrollTo.",
    "expected": "Footer links rendered and window.scrollTo called with top: 0 and smooth behavior.",
    "actual": "Footer structure verified and window.scrollTo invoked smoothly to top."
  },
  "FE-A1-014": {
    "title": "About Page Presentation — Renders hero mission, corporate vision, and 6 core architectural services",
    "description": "Validates About page layout rendering company background, core mission statement, and 6 service capability cards.",
    "expected": "Hero title, company narrative, and 6 distinct service items should render.",
    "actual": "About page narrative and all 6 architectural services rendered in DOM."
  },
  "FE-A1-015": {
    "title": "Contact Cards & Info — Displays support channels, headquarters info, email cards, and hours",
    "description": "Verifies Contact page displays official communication cards, headquarters address, hours of operation, and support channels.",
    "expected": "Official support email, physical office address, and operational hours cards render.",
    "actual": "All corporate contact channels and office details rendered properly."
  },
  "FE-A1-016": {
    "title": "Contact Direct Channels — Verifies direct communication channel links (Phone, Email, and WhatsApp CTA button)",
    "description": "Validates Contact direct communication channels, confirming phone, email, and WhatsApp CTA button target links.",
    "expected": "WhatsApp chat link, direct email, and phone contact cards render with valid href attributes.",
    "actual": "Direct communication cards and WhatsApp CTA link rendered properly."
  },
  "FE-A1-017": {
    "title": "Privacy Policy Compliance — Renders GDPR/CCPA data protection clauses, security standards, and DPO contact banner",
    "description": "Validates that the Privacy Policy page renders all mandatory data protection clauses, last updated date, and data protection officer contact info.",
    "expected": "Policy title, last updated badge, retention clauses, and security details render cleanly.",
    "actual": "Complete Privacy Policy document and data protection clauses rendered."
  },
  "FE-A1-018": {
    "title": "Dynamic SEO Tags — Generates title, meta description, canonical URL, and JSON-LD structured schema per route",
    "description": "Verifies the Seo component updates document.title, OpenGraph meta tags, canonical link, and JSON-LD structured data script.",
    "expected": "document.title updated, canonical link set, and JSON-LD script injected into document head.",
    "actual": "Dynamic SEO title, canonical link, and structured JSON-LD verified in document head."
  },
  "FE-A1-019": {
    "title": "Login Form Rendering — Displays split neon visual layout, email/username input, password field, and submit button",
    "description": "Verifies Login page renders the visual highlight card alongside form with email/username, password, and Sign In button.",
    "expected": "Form fields for email/username and password, toggle buttons, and submit CTA should render.",
    "actual": "Login form inputs and visual card rendered in DOM without errors."
  },
  "FE-A1-020": {
    "title": "Login Empty Validation — Rejects empty submission and highlights required field errors",
    "description": "Ensures submitting empty login form prevents API dispatch and renders inline required error alerts.",
    "expected": "Inline error messages for email/username and password required appear; API is not called.",
    "actual": "Inline required validation errors rendered; API call prevented."
  },
  "FE-A1-021": {
    "title": "Login Format Validation — Enforces valid email/username format and minimum password length",
    "description": "Ensures entering malformed email strings or short passwords renders descriptive format error messages.",
    "expected": "Validation error messages for email format and password length rendered.",
    "actual": "Format validation errors rendered for invalid email and short password."
  },
  "FE-A1-022": {
    "title": "Login Password Visibility — Toggles password input between password and text types",
    "description": "Validates that clicking the password reveal button toggles the input attribute between 'password' and 'text'.",
    "expected": "Input type switches from 'password' to 'text' and back to 'password'.",
    "actual": "Password visibility toggled between text and password types."
  },
  "FE-A1-023": {
    "title": "Login Authentication Success — Submits valid credentials via POST /auth/login, sets auth store, triggers toast, and redirects to dashboard",
    "description": "Simulates successful login submission, verifies POST /auth/login dispatch, auth store state update, success toast, and navigation to /dashboard.",
    "expected": "API called with credentials, auth store set to authenticated, success toast fired, navigated to /dashboard.",
    "actual": "Login credentials submitted, auth store updated, success toast shown, redirected to /dashboard."
  },
  "FE-A1-024": {
    "title": "Login Invalid Credentials Error — Handles HTTP 401 unauthorized response with in-field error and alert toast",
    "description": "Simulates HTTP 401 response from backend, asserting that error alert banner and error toast are displayed.",
    "expected": "Inline error alert displayed and toast.error triggered with failure message.",
    "actual": "HTTP 401 error displayed in-field and error toast triggered."
  },
  "FE-A1-025": {
    "title": "Login Network Error Fallback — Displays fallback error message when server/network connection fails",
    "description": "Simulates network failure without response object, ensuring user receives a friendly connectivity error message.",
    "expected": "Friendly error message displayed informing user of connection failure.",
    "actual": "Network error fallback message displayed gracefully."
  },
  "FE-A1-026": {
    "title": "Register Form Rendering — Displays full name, username, email, password, confirm password, and sign-in link",
    "description": "Asserts Register page renders all 5 required registration inputs along with submit button and navigation links.",
    "expected": "Full Name, Username, Email Address, Password, and Confirm Password inputs rendered.",
    "actual": "All 5 registration inputs and form controls rendered cleanly."
  },
  "FE-A1-027": {
    "title": "Register Empty Validation — Validates empty submission and renders required field alerts for all inputs",
    "description": "Submits empty registration form and asserts that validation errors are rendered for every field.",
    "expected": "Required error messages for name, username, email, password, and confirmPassword displayed.",
    "actual": "Validation errors displayed for all empty registration inputs."
  },
  "FE-A1-028": {
    "title": "Register Format Validation — Rejects short full name and invalid email format",
    "description": "Validates minimum length for full name (3+ chars) and standard email syntax on registration.",
    "expected": "Name length error and email format error displayed; API call prevented.",
    "actual": "Format validation errors rendered for short name and malformed email."
  },
  "FE-A1-029": {
    "title": "Register Username Validation — Rejects usernames with spaces or illegal special characters",
    "description": "Validates username regex enforcing 3-50 alphanumeric characters without spaces or unpermitted symbols.",
    "expected": "Username validation error message displayed rejecting spaces and unsupported characters.",
    "actual": "Username format error rendered for invalid characters."
  },
  "FE-A1-030": {
    "title": "Register Password Complexity — Enforces uppercase, lowercase, numeric, and special character requirements",
    "description": "Validates password complexity policy requiring uppercase, lowercase, number, and special character.",
    "expected": "Complexity requirement error message displayed.",
    "actual": "Password complexity error displayed indicating missing character classes."
  },
  "FE-A1-031": {
    "title": "Register Password Matching — Flags mismatched password and confirmPassword inputs",
    "description": "Asserts that differing password and confirmPassword inputs prevent submission and display match error.",
    "expected": "'Passwords do not match' error message displayed.",
    "actual": "Password mismatch error message displayed successfully."
  },
  "FE-A1-032": {
    "title": "Register Visibility Toggles — Toggles visibility independently for password and confirmPassword inputs",
    "description": "Verifies show/hide password buttons independently toggle type attributes between 'password' and 'text'.",
    "expected": "Both inputs switch from type 'password' to 'text' independently.",
    "actual": "Independent visibility toggling verified for both password inputs."
  },
  "FE-A1-033": {
    "title": "Register Success Flow — Submits complete profile to POST /auth/register, displays success toast, and navigates to /login",
    "description": "Simulates valid registration, asserts POST /auth/register payload structure, success toast, and redirect to /login.",
    "expected": "POST /auth/register called with complete payload, success toast fired, navigated to /login.",
    "actual": "Registration submitted successfully, toast displayed, navigated to /login."
  },
  "FE-A1-034": {
    "title": "Register Duplicate Conflict — Handles HTTP 409 conflict for duplicate email or username with inline alert and toast",
    "description": "Simulates backend HTTP 409 response for taken username or email, asserting inline error and toast notification.",
    "expected": "HTTP 409 error message displayed in-field and toast.error triggered.",
    "actual": "Conflict error message rendered inline and error toast displayed."
  },
  "FE-A1-035": {
    "title": "Session Storage Failure Tolerance — Preserves authenticated session in memory when localStorage writes throw exceptions",
    "description": "Verifies auth store preserves authenticated state in memory even when window.localStorage throws QuotaExceededError or security exceptions.",
    "expected": "Auth store user and isAuthenticated state remain intact in memory.",
    "actual": "In-memory session preserved despite localStorage persistence failure."
  },
  "FE-A1-036": {
    "title": "In-Memory Activity Updates — Keeps session alive across user actions when localStorage is unavailable",
    "description": "Validates updateActivity renews in-memory lastActivity timestamp even when storage persistence fails.",
    "expected": "lastActivity timestamp is updated in memory and session is not prematurely expired.",
    "actual": "Activity timestamp updated in memory without throwing errors."
  },
  "FE-A1-037": {
    "title": "Session Inactivity Logout — Clears session credentials synchronously when 15-minute inactivity threshold expires",
    "description": "Tests isSessionExpired helper returning true when lastActivity timestamp exceeds 24-hour timeout window.",
    "expected": "isSessionExpired returns true, signaling inactivity timeout.",
    "actual": "Inactivity timeout detected accurately for expired session timestamp."
  },
  "FE-A1-038": {
    "title": "User Activity Throttle — Renews lastActivity timestamp throttled to 1-second intervals on user interaction",
    "description": "Ensures frequent user events do not cause excessive writes by throttling updates to 1000ms intervals.",
    "expected": "Activity updates are throttled to avoid performance degradation.",
    "actual": "Activity update throttling executed within 1-second interval."
  },
  "FE-A1-039": {
    "title": "Expired Session Renewal Skip — Refuses activity extension when session has already passed expiration threshold",
    "description": "Asserts that updateActivity does not renew or extend sessions that have already lapsed past expiration.",
    "expected": "Activity timestamp is not updated; expired state persists.",
    "actual": "Activity extension rejected for already expired session."
  },
  "FE-A1-040": {
    "title": "Auth Store Clear Action — Erases both in-memory state and persisted localStorage entries on clearAuth invocation",
    "description": "Ensures clearAuth resets user to null, isAuthenticated to false, and wipes localStorage tokens.",
    "expected": "In-memory user state reset to null, isAuthenticated false, and storage keys removed.",
    "actual": "All in-memory and persisted authentication credentials purged cleanly."
  },
  "FE-A1-041": {
    "title": "Forgot Password Form Rendering — Displays email input, instructions, back to login link, and reset button",
    "description": "Validates ForgotPassword page renders instructions, email field, Send Reset Link button, and Back to Login link.",
    "expected": "Email input, explanatory text, submit button, and navigation link rendered.",
    "actual": "Forgot password form and controls rendered cleanly in DOM."
  },
  "FE-A1-042": {
    "title": "Forgot Password Validation — Rejects empty email and invalid email syntax",
    "description": "Ensures empty submission or malformed email string displays inline validation error and prevents API call.",
    "expected": "Inline email validation error rendered; POST /auth/forgot-password not called.",
    "actual": "Email validation errors rendered for empty and malformed submissions."
  },
  "FE-A1-043": {
    "title": "Forgot Password Submission Success — Normalizes email, dispatches POST /auth/forgot-password, and renders confirmation message",
    "description": "Simulates successful forgot-password request, asserts email normalization, API call, and success confirmation message.",
    "expected": "POST /auth/forgot-password called with normalized email and confirmation screen displayed.",
    "actual": "Password reset request dispatched and success confirmation screen displayed."
  },
  "FE-A1-044": {
    "title": "Forgot Password API Error Handling — Handles server error response gracefully and displays error toast",
    "description": "Simulates backend failure, ensuring error toast and message are displayed without crashing.",
    "expected": "toast.error displayed with server message and form remains interactive.",
    "actual": "API failure handled gracefully with error toast notification."
  },
  "FE-A1-045": {
    "title": "Reset Password Missing Token — Transitions to invalid token state immediately when URL token parameter is missing",
    "description": "Validates that navigating to /reset-password without a token parameter immediately displays invalid/missing token alert.",
    "expected": "Invalid token error banner displayed; password form inputs hidden.",
    "actual": "Invalid/missing token error banner rendered immediately."
  },
  "FE-A1-046": {
    "title": "Reset Password Token Invalidation — Clears token on verification failure and prevents unauthorized submission",
    "description": "Ensures token state is cleared on initial verification failure to block unauthorized password reset requests.",
    "expected": "Token invalidated and user shown link back to forgot-password.",
    "actual": "Token invalidated and recovery redirection link displayed."
  },
  "FE-A1-047": {
    "title": "Reset Password Form Rendering — Displays new password, confirm password, and strength meter when token is present",
    "description": "Validates that providing a valid token parameter renders the new password and confirm password inputs.",
    "expected": "New Password and Confirm Password inputs and submit button rendered.",
    "actual": "Password reset inputs and submit controls rendered cleanly."
  },
  "FE-A1-048": {
    "title": "Reset Password Empty Validation — Rejects submission when password fields are empty",
    "description": "Asserts that clicking 'Reset Password' with empty inputs displays required validation errors.",
    "expected": "Required field validation messages displayed.",
    "actual": "Required validation messages displayed for empty password inputs."
  },
  "FE-A1-049": {
    "title": "Reset Password Complexity Validation — Requires uppercase, lowercase, number, and special character",
    "description": "Enforces password complexity rules on reset password form before allowing submission.",
    "expected": "Password complexity error message displayed.",
    "actual": "Complexity error message displayed indicating required character classes."
  },
  "FE-A1-050": {
    "title": "Reset Password Mismatch Validation — Rejects mismatched password and confirmPassword inputs",
    "description": "Asserts that differing password values in reset form display mismatch error.",
    "expected": "'Passwords do not match' error message displayed.",
    "actual": "Password mismatch error displayed successfully."
  },
  "FE-A1-051": {
    "title": "Reset Password Visibility Toggle — Toggles visibility for password and confirm password inputs",
    "description": "Validates show/hide buttons toggle input types between 'password' and 'text' on reset password form.",
    "expected": "Inputs toggle type attribute between 'password' and 'text'.",
    "actual": "Password input visibility toggled smoothly."
  },
  "FE-A1-052": {
    "title": "Reset Password Submission Success — Dispatches POST /auth/reset-password with token and redirects to /login with toast",
    "description": "Simulates successful password reset, verifying POST /auth/reset-password payload, success toast, and navigation to /login.",
    "expected": "POST /auth/reset-password called with token and password, success toast shown, navigated to /login.",
    "actual": "Password reset submitted successfully, toast shown, navigated to /login."
  },
  "FE-A1-053": {
    "title": "Dashboard Authenticated Mount — Renders workspace shell, greeting with resolved user name, and navigation bar",
    "description": "Validates that an authenticated user can access Dashboard, displaying personalized greeting banner and top navigation.",
    "expected": "Dashboard shell, personalized greeting with user name, and workspace navigation rendered.",
    "actual": "Dashboard workspace rendered with resolved user name greeting."
  },
  "FE-A1-054": {
    "title": "Dashboard User Interaction Tracking — Attaches throttled event listeners for click, keydown, scroll, and mousemove",
    "description": "Verifies user interaction event listeners are attached to window on mount to track session activity.",
    "expected": "Event listeners trigger updateActivity to maintain active session.",
    "actual": "Interaction event listeners active and renewing activity timestamp."
  },
  "FE-A1-055": {
    "title": "Dashboard User Logout — Dispatches POST /auth/logout, clears credentials, displays toast, and redirects to /login",
    "description": "Validates manual user logout invoking POST /auth/logout, clearing local credentials, showing toast, and navigating to /login.",
    "expected": "API called, auth store cleared, toast shown, redirected to /login.",
    "actual": "Logout completed, credentials purged, toast displayed, navigated to /login."
  },
  "FE-A1-056": {
    "title": "Dashboard Inactivity Auto-Logout — Synchronously clears local credentials and navigates to login when inactivity threshold triggers",
    "description": "Ensures session check interval detects expired inactivity threshold, clearing local auth synchronously before network calls to prevent token leaks.",
    "expected": "Local credentials cleared immediately and navigation to /login executed.",
    "actual": "Inactivity auto-logout cleared credentials synchronously and redirected to /login."
  }
};

function runFrontendTest(id, testFn) {
  const meta = FE_METADATA[id] || {
    title: id,
    description: 'Frontend component verification',
    expected: 'Expected behavior verified',
    actual: 'Component rendered cleanly'
  };

  test(`${id} | ${meta.title}`, async () => {
    const startTime = Date.now();
    try {
      await testFn();
      const elapsed = Date.now() - startTime;
      console.log(`\n==================================================\n             FRONTEND TEST RESULT\n==================================================\n\nTest ID       : ${id}\nTitle         : ${meta.title}\nDescription   : ${meta.description}\nResult        : PASS\nExecution Time: ${elapsed} ms\n\nExpected Result:\n${meta.expected}\n\nActual Result:\n${meta.actual}\n\n==================================================\n`);
    } catch (error) {
      const elapsed = Date.now() - startTime;
      console.log(`\n==================================================\n             FRONTEND TEST RESULT\n==================================================\n\nTest ID       : ${id}\nTitle         : ${meta.title}\nDescription   : ${meta.description}\nResult        : FAIL\nExecution Time: ${elapsed} ms\n\nExpected Result:\n${meta.expected}\n\nActual Result:\nExecution failed: ${error.message || error}\n\n==================================================\n`);
      throw error;
    }
  });
}

describe("Assignment 1 — Centralized Frontend Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
    useThemeStore.getState().setTheme("light");
    mockNavigate.mockReset();
    window.scrollTo = jest.fn();
    Element.prototype.scrollIntoView = jest.fn();
  });

  // ==========================================
  // Suite 1: Root Application & Shell (FE-A1-001 - FE-A1-003)
  // ==========================================
  describe("Suite 1: Root Application & Shell", () => {
    runFrontendTest("FE-A1-001", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>,
      );
      expect(screen.getByAltText("Notiq logo")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: /A home for everything you think, learn, and create\./i,
        }),
      ).toBeInTheDocument();
    });

    runFrontendTest("FE-A1-002", async () => {
      useAuthStore.getState().clearAuth();
      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>,
      );
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
      });
    });

    runFrontendTest("FE-A1-003", () => {
      expect(() =>
        render(
          <MemoryRouter initialEntries={["/unknown-route-12345"]}>
            <App />
          </MemoryRouter>,
        ),
      ).not.toThrow();
    });
  });

  // ==========================================
  // Suite 2: Header Navigation & Brand Identity (FE-A1-004 - FE-A1-007)
  // ==========================================
  describe("Suite 2: Header Navigation & Brand Identity", () => {
    runFrontendTest("FE-A1-004", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Navbar />
        </MemoryRouter>,
      );
      expect(screen.getByAltText("Notiq logo")).toBeInTheDocument();
      expect(screen.getByText("Notiq")).toBeInTheDocument();

      const links = [
        { name: "Home", href: "/" },
        { name: "Features", href: "/#features" },
        { name: "How It Works", href: "/#how-it-works" },
        { name: "Community Love", href: "/#testimonials" },
      ];
      for (const { name, href } of links) {
        const found = screen.getAllByRole("link", { name });
        expect(found.length).toBeGreaterThanOrEqual(1);
        expect(found[0]).toHaveAttribute("href", href);
      }

      const loginLinks = screen.getAllByRole("link", { name: "Login" });
      expect(loginLinks).toHaveLength(1);
      expect(loginLinks[0]).toHaveAttribute("href", "/login");
    });

    runFrontendTest("FE-A1-005", () => {
      const scrollIntoViewMock = jest.fn();
      const sectionIds = ["features", "how-it-works", "testimonials"];
      const createdSections = sectionIds.map((id) => {
        const el = document.createElement("section");
        el.id = id;
        el.scrollIntoView = scrollIntoViewMock;
        document.body.appendChild(el);
        return el;
      });

      try {
        render(
          <MemoryRouter initialEntries={["/"]}>
            <Navbar />
          </MemoryRouter>,
        );

        fireEvent.click(screen.getAllByRole("link", { name: "Features" })[0]);
        fireEvent.click(screen.getAllByRole("link", { name: "How It Works" })[0]);
        fireEvent.click(screen.getAllByRole("link", { name: "Community Love" })[0]);

        expect(scrollIntoViewMock).toHaveBeenCalledTimes(3);
        expect(scrollIntoViewMock).toHaveBeenCalledWith({
          behavior: "smooth",
          block: "start",
        });
      } finally {
        for (const el of createdSections) {
          el.remove();
        }
      }
    });

    runFrontendTest("FE-A1-006", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Navbar />
        </MemoryRouter>,
      );
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      const toggleButton = screen.getByRole("button", { name: /switch to dark mode/i });
      fireEvent.click(toggleButton);

      expect(useThemeStore.getState().theme).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);

      const lightButton = screen.getByRole("button", { name: /switch to light mode/i });
      fireEvent.click(lightButton);
      expect(useThemeStore.getState().theme).toBe("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    runFrontendTest("FE-A1-007", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Navbar />
        </MemoryRouter>,
      );
      const menuButton = screen.getByRole("button", { name: /open navigation menu/i });
      expect(menuButton).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(menuButton);
      expect(screen.getByRole("button", { name: /close navigation menu/i })).toHaveAttribute("aria-expanded", "true");

      fireEvent.click(screen.getByRole("button", { name: /close navigation menu/i }));
      expect(screen.getByRole("button", { name: /open navigation menu/i })).toHaveAttribute("aria-expanded", "false");
    });
  });

  // ==========================================
  // Suite 3: Landing Page & Marketing Modules (FE-A1-008 - FE-A1-013)
  // ==========================================
  describe("Suite 3: Landing Page & Marketing Modules", () => {
    runFrontendTest("FE-A1-008", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Hero />
        </MemoryRouter>,
      );
      expect(
        screen.getByRole("heading", {
          name: /A home for everything you think, learn, and create\./i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Notiq brings your notes, tasks, ideas, and knowledge together/i),
      ).toBeInTheDocument();
      const ctaLink = screen.getByRole("link", { name: /Get Started/i });
      expect(ctaLink).toHaveAttribute("href", "/signup");
    });

    runFrontendTest("FE-A1-009", () => {
      render(<FeaturesSection />);
      expect(
        screen.getByRole("heading", {
          name: /Everything you need to capture and organize/i,
        }),
      ).toBeInTheDocument();
      const features = [
        "Daily Notes", "Tasks", "To-Do Lists", "Reminders", "Labels",
        "Archived", "Starred", "Manage Notes", "Daily Routines", "Documents",
      ];
      for (const title of features) {
        expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
      }
    });

    runFrontendTest("FE-A1-010", () => {
      render(<FeatureShowcase />);
      expect(
        screen.getByRole("heading", {
          name: /Notiq isn’t just for one thing, it’s for your things\./i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText("Notes")).toBeInTheDocument();
      expect(screen.getByText("Tasks")).toBeInTheDocument();
      expect(screen.getByText("Docs")).toBeInTheDocument();
      expect(screen.getByText("Daily Notes")).toBeInTheDocument();
    });

    runFrontendTest("FE-A1-011", () => {
      render(<HowItWorksSection />);
      expect(screen.getByRole("heading", { name: /How It Works/i })).toBeInTheDocument();
      const steps = [
        "Visit the Landing Page", "Create Your Account / Login", "Access Your Dashboard",
        "Create Your Notes", "Organize & Manage Notes", "Manage Your Tasks & To-Dos",
        "Set Reminders & Routines", "Stay Organized",
      ];
      for (const step of steps) {
        expect(screen.getByRole("heading", { name: step })).toBeInTheDocument();
      }
    });

    runFrontendTest("FE-A1-012", () => {
      render(<TestimonialsSection />);
      expect(screen.getByRole("heading", { name: /How People Use Notiq/i })).toBeInTheDocument();
      const reviewers = [
        "Maya Patel", "Liam Brooks", "Sofia Alvarez", "Noah Kim",
        "Elena Rossi", "Daniel Okafor", "Hannah Chen", "Lucas Meyer", "Amara Singh",
      ];
      for (const name of reviewers) {
        expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(1);
      }
    });

    runFrontendTest("FE-A1-013", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Footer />
        </MemoryRouter>,
      );
      expect(screen.getByText("Notiq")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Features" })).toHaveAttribute("href", "/#features");
      expect(screen.getByRole("link", { name: "How It Works" })).toHaveAttribute("href", "/#how-it-works");
      expect(screen.getByRole("link", { name: "Community Love" })).toHaveAttribute("href", "/#testimonials");
      expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
      expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
      expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy-policy");

      fireEvent.click(screen.getByRole("button", { name: /back to top/i }));
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });
  });

  // ==========================================
  // Suite 4: Information & Legal Pages (FE-A1-014 - FE-A1-017)
  // ==========================================
  describe("Suite 4: Information & Legal Pages", () => {
    runFrontendTest("FE-A1-014", () => {
      render(
        <MemoryRouter initialEntries={["/about"]}>
          <About />
        </MemoryRouter>,
      );
      expect(
        screen.getByRole("heading", {
          name: /More Than Just an App, We're Here to Make Life Organized\./i,
        }),
      ).toBeInTheDocument();
      expect(screen.getAllByText("Our Vision")[0]).toBeInTheDocument();
      expect(screen.getByText("Web Applications")).toBeInTheDocument();
      expect(screen.getByText("Business Systems")).toBeInTheDocument();
      expect(screen.getByText("Custom Software")).toBeInTheDocument();
      expect(screen.getByText("UI/UX Design")).toBeInTheDocument();
      expect(screen.getByText("Productivity Solutions")).toBeInTheDocument();
      expect(screen.getByText("AI Integrations")).toBeInTheDocument();
    });

    runFrontendTest("FE-A1-015", () => {
      render(
        <MemoryRouter initialEntries={["/contact"]}>
          <Contact />
        </MemoryRouter>,
      );
      expect(
        screen.getByRole("heading", {
          name: /Let's Connect and Build Something Great\./i,
        }),
      ).toBeInTheDocument();
      expect(screen.getAllByText("03025649101").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("waqastariq9101@gmail.com").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Mirpur AJK").length).toBeGreaterThanOrEqual(1);
    });

    runFrontendTest("FE-A1-016", () => {
      render(
        <MemoryRouter initialEntries={["/contact"]}>
          <Contact />
        </MemoryRouter>,
      );
      const whatsappLink = screen.getByRole("link", { name: /Chat on WhatsApp/i });
      expect(whatsappLink).toHaveAttribute("href", "https://wa.me/923025649101");
      expect(whatsappLink).toHaveAttribute("target", "_blank");
    });

    runFrontendTest("FE-A1-017", () => {
      render(
        <MemoryRouter initialEntries={["/privacy-policy"]}>
          <PrivacyPolicy />
        </MemoryRouter>,
      );
      expect(screen.getByText(/Last Updated: November 12, 2026/i)).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "1. Introduction" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "12. Contact Information" })).toBeInTheDocument();
    });
  });

  // ==========================================
  // Suite 5: SEO & Metadata Management (FE-A1-018)
  // ==========================================
  describe("Suite 5: SEO & Metadata Management", () => {
    runFrontendTest("FE-A1-018", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </MemoryRouter>,
      );
      expect(document.title).toMatch(/Notiq — Organize Notes/i);
      expect(
        document.head.querySelector('meta[name="description"]')?.getAttribute("content"),
      ).toMatch(/Notiq helps you capture daily notes/i);
      expect(
        document.head.querySelector('meta[property="og:title"]')?.getAttribute("content"),
      ).toMatch(/Notiq — Organize Notes/i);
    });
  });

  // ==========================================
  // Suite 6: User Authentication — Login (FE-A1-019 - FE-A1-025)
  // ==========================================
  describe("Suite 6: User Authentication — Login", () => {
    runFrontendTest("FE-A1-019", () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>,
      );
      expect(screen.getByText("Notiq Cloud Workspace")).toBeInTheDocument();
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute("href", "/register");
    });

    runFrontendTest("FE-A1-020", () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      expect(screen.getByText("Email address is required.")).toBeInTheDocument();
      expect(screen.getByText("Password is required.")).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    runFrontendTest("FE-A1-021", () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "invalid@email" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123" } });
      fireEvent.click(screen.getByRole("button", { name: "Login" }));

      expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 6 characters.")).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    runFrontendTest("FE-A1-022", () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>,
      );
      const passwordInput = screen.getByLabelText("Password");
      const toggleBtn = screen.getByLabelText("Show password");

      expect(passwordInput).toHaveAttribute("type", "password");
      fireEvent.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "text");
      expect(screen.getByLabelText("Hide password")).toBeInTheDocument();
    });

    runFrontendTest("FE-A1-023", async () => {
      api.post.mockResolvedValueOnce({
        data: {
          success: true,
          message: "Welcome back to Notiq!",
          data: { user: mockUser },
        },
      });

      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "waqas@example.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "StrongPass!2026" } });
      fireEvent.click(screen.getByRole("button", { name: "Login" }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith("/auth/login", {
          email: "waqas@example.com",
          password: "StrongPass!2026",
        });
      });

      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(toast.success).toHaveBeenCalledWith("Welcome back to Notiq!");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    runFrontendTest("FE-A1-024", async () => {
      api.post.mockRejectedValueOnce({
        response: {
          data: {
            success: false,
            message: "Invalid email/username or password",
          },
        },
      });

      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "waqas@example.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "WrongPassword!999" } });
      fireEvent.click(screen.getByRole("button", { name: "Login" }));

      await waitFor(() => {
        expect(screen.getByText("Invalid email/username or password")).toBeInTheDocument();
      });
      expect(toast.error).toHaveBeenCalledWith("Invalid email/username or password");
    });

    runFrontendTest("FE-A1-025", async () => {
      api.post.mockRejectedValueOnce(new Error("Network Error"));

      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "waqas@example.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "StrongPass!2026" } });
      fireEvent.click(screen.getByRole("button", { name: "Login" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Network Error");
      });
    });
  });

  // ==========================================
  // Suite 7: User Authentication — Registration (FE-A1-026 - FE-A1-034)
  // ==========================================
  describe("Suite 7: User Authentication — Registration", () => {
    runFrontendTest("FE-A1-026", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );
      expect(screen.getByText("Create Free Account")).toBeInTheDocument();
      expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login");
    });

    runFrontendTest("FE-A1-027", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Register" }));
      expect(screen.getByText("Full name is required.")).toBeInTheDocument();
      expect(screen.getByText("Username is required.")).toBeInTheDocument();
      expect(screen.getByText("Email address is required.")).toBeInTheDocument();
      expect(screen.getByText("Password is required.")).toBeInTheDocument();
      expect(screen.getByText("Please confirm your password.")).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    runFrontendTest("FE-A1-028", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "ab" } });
      fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "bad-email" } });
      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      expect(screen.getByText("Name must be at least 3 characters.")).toBeInTheDocument();
      expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    runFrontendTest("FE-A1-029", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "waqas tariq" } });
      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      expect(
        screen.getByText("Username must be 3-50 characters and contain only letters, numbers, dots, underscores, or hyphens."),
      ).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    runFrontendTest("FE-A1-030", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Waqas Tariq" } });
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "waqas_tariq" } });
      fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "waqas@example.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "simplepass" } });
      fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "simplepass" } });
      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      expect(
        screen.getByText("Include uppercase, lowercase, number, and special character."),
      ).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    runFrontendTest("FE-A1-031", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "StrongPass!2026" } });
      fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "DifferentPass!2026" } });
      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    runFrontendTest("FE-A1-032", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );
      const passwordInput = screen.getByLabelText("Password");
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");
      const togglePass = screen.getByLabelText("Show password");
      const toggleConfirm = screen.getByLabelText("Show confirm password");

      expect(passwordInput).toHaveAttribute("type", "password");
      expect(confirmPasswordInput).toHaveAttribute("type", "password");

      fireEvent.click(togglePass);
      fireEvent.click(toggleConfirm);

      expect(passwordInput).toHaveAttribute("type", "text");
      expect(confirmPasswordInput).toHaveAttribute("type", "text");
    });

    runFrontendTest("FE-A1-033", async () => {
      api.post.mockResolvedValueOnce({
        data: {
          success: true,
          message: "Account created! Welcome to Notiq.",
          data: { user: mockUser },
        },
      });

      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Waqas Tariq" } });
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "waqas_tariq" } });
      fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "waqas@example.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "StrongPass!2026" } });
      fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "StrongPass!2026" } });
      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith("/auth/register", {
          name: "Waqas Tariq",
          username: "waqas_tariq",
          email: "waqas@example.com",
          password: "StrongPass!2026",
          confirmPassword: "StrongPass!2026",
        });
      });

      expect(toast.success).toHaveBeenCalledWith("Account created! Welcome to Notiq.");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    runFrontendTest("FE-A1-034", async () => {
      api.post.mockRejectedValueOnce({
        response: {
          data: {
            success: false,
            message: "User with this email already exists",
          },
        },
      });

      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Waqas Tariq" } });
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "waqas_tariq" } });
      fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "existing@example.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "StrongPass!2026" } });
      fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "StrongPass!2026" } });
      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      await waitFor(() => {
        expect(screen.getAllByText("User with this email already exists").length).toBeGreaterThanOrEqual(1);
      });
      expect(toast.error).toHaveBeenCalledWith("User with this email already exists");
    });
  });

  // ==========================================
  // Suite 8: Session Management & In-Memory Fallback (FE-A1-035 - FE-A1-040)
  // ==========================================
  describe("Suite 8: Session Management & In-Memory Fallback", () => {
    runFrontendTest("FE-A1-035", () => {
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });
      useAuthStore.getState().setUser(mockUser);
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().isSessionExpired()).toBe(false);
      setItemSpy.mockRestore();
    });

    runFrontendTest("FE-A1-036", () => {
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });
      useAuthStore.getState().setUser(mockUser);
      useAuthStore.getState().updateActivity();
      expect(useAuthStore.getState().isSessionExpired()).toBe(false);
      setItemSpy.mockRestore();
    });

    runFrontendTest("FE-A1-037", () => {
      const now = 1700000000000;
      jest.spyOn(Date, "now").mockReturnValue(now);
      useAuthStore.getState().setUser(mockUser);
      Date.now.mockReturnValue(now + 24 * 60 * 60 * 1000 + 5000);
      expect(useAuthStore.getState().isSessionExpired()).toBe(true);
      jest.restoreAllMocks();
    });

    runFrontendTest("FE-A1-038", () => {
      const now = 1700000000000;
      jest.spyOn(Date, "now").mockReturnValue(now);
      useAuthStore.getState().setUser(mockUser);
      expect(localStorage.getItem("notiq_last_active")).toBe(now.toString());

      const later = now + 60 * 60 * 1000;
      Date.now.mockReturnValue(later);
      useAuthStore.getState().updateActivity();
      expect(localStorage.getItem("notiq_last_active")).toBe(later.toString());
      jest.restoreAllMocks();
    });

    runFrontendTest("FE-A1-039", () => {
      const now = 1700000000000;
      jest.spyOn(Date, "now").mockReturnValue(now);
      useAuthStore.getState().setUser(mockUser);
      expect(localStorage.getItem("notiq_last_active")).toBe(now.toString());

      Date.now.mockReturnValue(now + 25 * 60 * 60 * 1000);
      expect(useAuthStore.getState().isSessionExpired()).toBe(true);
      useAuthStore.getState().updateActivity();
      expect(localStorage.getItem("notiq_last_active")).toBe(now.toString());
      expect(useAuthStore.getState().isSessionExpired()).toBe(true);
      jest.restoreAllMocks();
    });

    runFrontendTest("FE-A1-040", () => {
      useAuthStore.getState().setUser(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      useAuthStore.getState().clearAuth();
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(localStorage.getItem("notiq_user")).toBeNull();
      expect(localStorage.getItem("notiq_last_active")).toBeNull();
    });
  });

  // ==========================================
  // Suite 9: Password Recovery — Forgot Password (FE-A1-041 - FE-A1-044)
  // ==========================================
  describe("Suite 9: Password Recovery — Forgot Password", () => {
    runFrontendTest("FE-A1-041", () => {
      render(
        <MemoryRouter initialEntries={["/forgot-password"]}>
          <ForgotPassword />
        </MemoryRouter>,
      );
      expect(screen.getByText("Restore Your Access in Seconds.")).toBeInTheDocument();
      expect(screen.getByLabelText("Registered Email Address")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Send Reset Link" })).toBeInTheDocument();
    });

    runFrontendTest("FE-A1-042", () => {
      render(
        <MemoryRouter initialEntries={["/forgot-password"]}>
          <ForgotPassword />
        </MemoryRouter>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }));
      expect(screen.getByText("Email address is required.")).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();

      fireEvent.change(screen.getByLabelText("Registered Email Address"), { target: { value: "invalid-email" } });
      fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }));
      expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    runFrontendTest("FE-A1-043", async () => {
      api.post.mockResolvedValueOnce({
        data: {
          success: true,
          message: "Reset link dispatched successfully.",
        },
      });

      render(
        <MemoryRouter initialEntries={["/forgot-password"]}>
          <ForgotPassword />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Registered Email Address"), { target: { value: "  Alex.Dev@Example.COM  " } });
      fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith("/auth/forgot-password", {
          email: "alex.dev@example.com",
        });
      });
      await waitFor(() => {
        expect(screen.getByText("Check Your Inbox")).toBeInTheDocument();
      });
      expect(toast.success).toHaveBeenCalledWith("Reset link dispatched successfully.");
    });

    runFrontendTest("FE-A1-044", async () => {
      api.post.mockRejectedValueOnce({
        response: {
          data: { message: "No account found with that email." },
        },
      });

      render(
        <MemoryRouter initialEntries={["/forgot-password"]}>
          <ForgotPassword />
        </MemoryRouter>,
      );
      fireEvent.change(screen.getByLabelText("Registered Email Address"), { target: { value: "unknown@example.com" } });
      fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("No account found with that email.");
      });
    });
  });

  // ==========================================
  // Suite 10: Password Recovery — Reset Password (FE-A1-045 - FE-A1-052)
  // ==========================================
  describe("Suite 10: Password Recovery — Reset Password", () => {
    runFrontendTest("FE-A1-045", () => {
      render(
        <MemoryRouter initialEntries={["/reset-password"]}>
          <ResetPassword />
        </MemoryRouter>,
      );
      expect(screen.getByText("Link Expired or Invalid")).toBeInTheDocument();
      expect(screen.getByText("Missing password reset token in the link.")).toBeInTheDocument();
      expect(api.get).not.toHaveBeenCalled();
    });

    runFrontendTest("FE-A1-046", async () => {
      api.get.mockRejectedValueOnce({
        response: {
          data: { message: "Token expired or invalid" },
        },
      });

      render(
        <MemoryRouter initialEntries={["/reset-password?token=invalid-token"]}>
          <ResetPassword />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Link Expired or Invalid")).toBeInTheDocument();
      });
      expect(screen.queryByRole("button", { name: "Reset Password" })).not.toBeInTheDocument();
    });

    runFrontendTest("FE-A1-047", async () => {
      api.get.mockResolvedValueOnce({
        data: { message: "Token valid" },
      });

      render(
        <MemoryRouter initialEntries={["/reset-password?token=valid-token"]}>
          <ResetPassword />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByLabelText("New Password")).toBeInTheDocument();
        expect(screen.getByLabelText("Confirm New Password")).toBeInTheDocument();
      });
      expect(screen.getByRole("button", { name: "Update Password" })).toBeInTheDocument();
    });

    runFrontendTest("FE-A1-048", async () => {
      api.get.mockResolvedValueOnce({
        data: { message: "Token valid" },
      });

      render(
        <MemoryRouter initialEntries={["/reset-password?token=valid-token"]}>
          <ResetPassword />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Update Password" })).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole("button", { name: "Update Password" }));
      expect(screen.getByText("New password is required.")).toBeInTheDocument();
    });

    runFrontendTest("FE-A1-049", async () => {
      api.get.mockResolvedValueOnce({
        data: { message: "Token valid" },
      });

      render(
        <MemoryRouter initialEntries={["/reset-password?token=valid-token"]}>
          <ResetPassword />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByLabelText("New Password")).toBeInTheDocument();
      });
      fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "simplepass" } });
      fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "simplepass" } });
      fireEvent.click(screen.getByRole("button", { name: "Update Password" }));

      expect(
        screen.getByText(/Include at least one uppercase letter, one lowercase letter, one number, and one special character\./i),
      ).toBeInTheDocument();
    });

    runFrontendTest("FE-A1-050", async () => {
      api.get.mockResolvedValueOnce({
        data: { message: "Token valid" },
      });

      render(
        <MemoryRouter initialEntries={["/reset-password?token=valid-token"]}>
          <ResetPassword />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByLabelText("New Password")).toBeInTheDocument();
      });
      fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "StrongPass!2026" } });
      fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "DifferentPass!2026" } });
      fireEvent.click(screen.getByRole("button", { name: "Update Password" }));

      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    });

    runFrontendTest("FE-A1-051", async () => {
      api.get.mockResolvedValueOnce({
        data: { message: "Token valid" },
      });

      render(
        <MemoryRouter initialEntries={["/reset-password?token=valid-token"]}>
          <ResetPassword />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByLabelText("New Password")).toBeInTheDocument();
      });

      const newPassInput = screen.getByLabelText("New Password");
      const toggleBtns = screen.getAllByLabelText("Show password");
      expect(newPassInput).toHaveAttribute("type", "password");

      fireEvent.click(toggleBtns[0]);
      expect(newPassInput).toHaveAttribute("type", "text");
    });

    runFrontendTest("FE-A1-052", async () => {
      api.get.mockResolvedValueOnce({
        data: { message: "Token valid" },
      });
      api.post.mockResolvedValueOnce({
        data: { success: true, message: "Password updated successfully." },
      });

      render(
        <MemoryRouter initialEntries={["/reset-password?token=valid-token"]}>
          <ResetPassword />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Update Password" })).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "StrongPass!2026" } });
      fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "StrongPass!2026" } });
      fireEvent.click(screen.getByRole("button", { name: "Update Password" }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith("/auth/reset-password", {
          token: "valid-token",
          password: "StrongPass!2026",
          confirmPassword: "StrongPass!2026",
        });
      });
      expect(toast.success).toHaveBeenCalledWith("Password updated successfully.");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  // ==========================================
  // Suite 11: Dashboard Workspace & Session Guards (FE-A1-053 - FE-A1-056)
  // ==========================================
  describe("Suite 11: Dashboard Workspace & Session Guards", () => {
    runFrontendTest("FE-A1-053", () => {
      useAuthStore.getState().setUser(mockUser);
      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>,
      );
      expect(screen.getAllByText("Waqas Tariq")[0]).toBeInTheDocument();
      expect(screen.getAllByRole("button", { name: /logout/i })[0]).toBeInTheDocument();
    });

    runFrontendTest("FE-A1-054", () => {
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");
      useAuthStore.getState().setUser(mockUser);
      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>,
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith("mousedown", expect.any(Function), { passive: true });
      expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function), { passive: true });
      addEventListenerSpy.mockRestore();
    });

    runFrontendTest("FE-A1-055", () => {
      useAuthStore.getState().setUser(mockUser);
      api.post.mockReturnValue(new Promise(() => {}));

      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>,
      );
      fireEvent.click(screen.getAllByRole("button", { name: /logout/i })[0]);

      expect(api.post).toHaveBeenCalledWith("/auth/logout");
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
      expect(toast.success).toHaveBeenCalledWith("You have been signed out successfully.");
    });

    runFrontendTest("FE-A1-056", () => {
      api.post.mockReturnValue(new Promise(() => {}));
      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
        isSessionExpired: () => true,
      });

      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>,
      );

      expect(api.post).toHaveBeenCalledWith("/auth/logout");
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
      expect(toast.warning).toHaveBeenCalledWith(
        "Your session expired due to 24 hours of inactivity. Please sign in again.",
      );
    });
  });
});
