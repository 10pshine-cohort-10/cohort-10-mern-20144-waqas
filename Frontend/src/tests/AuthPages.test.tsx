import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Login from "../pages/Login";
import Register, { type RegisterApiResponse } from "../pages/Register";
import api from "../services/api";
import useAuthStore, {
  type AuthApiResponse,
  type User,
} from "../store/useAuthStore";

jest.mock("../services/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Frontend Authentication Pages & Validations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  describe("1. Login Page Layout & Validations", () => {
    test("renders split layout with neon visual showcase and modernized login form", () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>,
      );

      // Visual Showcase Card
      expect(screen.getByText("Notiq Cloud Workspace")).toBeInTheDocument();
      expect(
        screen.getByText("Where Focus Meets Effortless Clarity."),
      ).toBeInTheDocument();
      expect(screen.getByText("Instant Workspace Access")).toBeInTheDocument();
      expect(screen.getByText("Encrypted & Private")).toBeInTheDocument();

      // Form Section
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Create an account" }),
      ).toHaveAttribute("href", "/register");
    });

    test("validates empty submission and shows in-field error messages", () => {
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

    test("validates invalid email format and short password", () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "invalid@email" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "123" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Login" }));

      expect(
        screen.getByText("Please enter a valid email address."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Password must be at least 6 characters."),
      ).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    test("toggles password visibility between password and text", () => {
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

    test("handles successful login, updates auth store, triggers toast, and navigates", async () => {
      const mockUser: User = {
        id: 1,
        username: "waqas",
        email: "waqas@example.com",
      };
      const mockLoginResponse: AuthApiResponse = {
        success: true,
        message: "Welcome back to Notiq!",
        data: { user: mockUser },
      };
      (api.post as jest.Mock).mockResolvedValueOnce({
        data: mockLoginResponse,
      });

      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "waqas@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "StrongPass!2026" },
      });

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

    test("displays server error message and error toast on invalid credentials", async () => {
      (api.post as jest.Mock).mockRejectedValueOnce({
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

      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "waqas@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "WrongPassword!999" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Login" }));

      await waitFor(() => {
        expect(
          screen.getByText("Invalid email/username or password"),
        ).toBeInTheDocument();
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Invalid email/username or password",
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("2. Register Page Layout & Validations", () => {
    test("renders split layout with neon visual showcase and modernized signup form", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );

      // Visual Showcase Card
      expect(screen.getByText("Create Free Account")).toBeInTheDocument();
      expect(
        screen.getByText("Organize Thoughts, Unleash Your Potential."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Structured Notes & Routines"),
      ).toBeInTheDocument();
      expect(screen.getByText("Document Organization")).toBeInTheDocument();

      // Form Section
      expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Register" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
        "href",
        "/login",
      );
    });

    test("validates empty submission and shows in-field errors for all fields", () => {
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
      expect(
        screen.getByText("Please confirm your password."),
      ).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    test("validates short name and invalid email format", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText("Full Name"), {
        target: { value: "ab" },
      });
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "bad-email" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      expect(
        screen.getByText("Name must be at least 3 characters."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Please enter a valid email address."),
      ).toBeInTheDocument();
    });

    test("validates invalid username with spaces or unsupported characters", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );

      // Username with spaces
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "waqas tariq" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      expect(
        screen.getByText(
          "Username must be 3-50 characters and contain only letters, numbers, dots, underscores, or hyphens.",
        ),
      ).toBeInTheDocument();

      // Username with unsupported characters
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "waqas@dev!" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      expect(
        screen.getByText(
          "Username must be 3-50 characters and contain only letters, numbers, dots, underscores, or hyphens.",
        ),
      ).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    test("validates weak password failing complexity requirements", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText("Full Name"), {
        target: { value: "Waqas Tariq" },
      });
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "waqas_tariq" },
      });
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "waqas@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "simplepass" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "simplepass" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      expect(
        screen.getByText(
          "Include uppercase, lowercase, number, and special character.",
        ),
      ).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    test("validates mismatched password and confirm password", () => {
      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "StrongPass!2026" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "DifferentPass!2026" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    test("toggles password and confirm password visibility", () => {
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

    test("handles successful registration with full name containing spaces and valid username", async () => {
      const mockCreatedUser: User = {
        id: 2,
        username: "waqas_tariq",
        email: "waqas@example.com",
      };
      const mockRegisterResponse: RegisterApiResponse = {
        success: true,
        message: "Account created! Welcome to Notiq.",
        data: { user: mockCreatedUser },
      };
      (api.post as jest.Mock).mockResolvedValueOnce({
        data: mockRegisterResponse,
      });

      render(
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText("Full Name"), {
        target: { value: "Waqas Tariq" },
      });
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "waqas_tariq" },
      });
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "waqas@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "StrongPass!2026" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "StrongPass!2026" },
      });

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

      expect(toast.success).toHaveBeenCalledWith(
        "Account created! Welcome to Notiq.",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    test("handles registration conflict (duplicate email) with in-field error and error toast", async () => {
      (api.post as jest.Mock).mockRejectedValueOnce({
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

      fireEvent.change(screen.getByLabelText("Full Name"), {
        target: { value: "Waqas Tariq" },
      });
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "waqas_tariq" },
      });
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "existing@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "StrongPass!2026" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "StrongPass!2026" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Register" }));

      await waitFor(() => {
        expect(
          screen.getAllByText("User with this email already exists").length,
        ).toBeGreaterThanOrEqual(1);
      });

      expect(toast.error).toHaveBeenCalledWith(
        "User with this email already exists",
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("handles registration conflict (duplicate username) with in-field error and error toast", async () => {
      try {
        (api.post as jest.Mock).mockRejectedValueOnce({
          response: {
            data: {
              success: false,
              message: "User with this username already exists",
            },
          },
        });

        render(
          <MemoryRouter initialEntries={["/register"]}>
            <Register />
          </MemoryRouter>,
        );

        fireEvent.change(screen.getByLabelText("Full Name"), {
          target: { value: "Waqas Tariq" },
        });
        fireEvent.change(screen.getByLabelText("Username"), {
          target: { value: "taken_username" },
        });
        fireEvent.change(screen.getByLabelText("Email Address"), {
          target: { value: "unique@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
          target: { value: "StrongPass!2026" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
          target: { value: "StrongPass!2026" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        await waitFor(() => {
          expect(
            screen.getAllByText("User with this username already exists").length,
          ).toBeGreaterThanOrEqual(1);
        });

        expect(toast.error).toHaveBeenCalledWith(
          "User with this username already exists",
        );
        expect(mockNavigate).not.toHaveBeenCalled();
        // eslint-disable-next-line no-useless-catch
      } catch (error) {
        throw error;
      }
    });
  });

  describe("3. Authentication Persistence & Fallback", () => {
    test("preserves active session in memory when localStorage writes fail", () => {
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });

      const testUser: User = {
        id: "u-123",
        username: "storage_fail_user",
        email: "storage_fail@example.com",
      };

      useAuthStore.getState().setUser(testUser);

      expect(useAuthStore.getState().user).toEqual(testUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Session must NOT be expired immediately despite localStorage write failure
      expect(useAuthStore.getState().isSessionExpired()).toBe(false);

      setItemSpy.mockRestore();
    });

    test("session remains valid across in-memory activity updates when localStorage is unavailable", () => {
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });

      const testUser: User = {
        id: "u-456",
        username: "active_user",
        email: "active@example.com",
      };

      useAuthStore.getState().setUser(testUser);
      useAuthStore.getState().updateActivity();

      expect(useAuthStore.getState().isSessionExpired()).toBe(false);

      setItemSpy.mockRestore();
    });

    test("clears both in-memory and persisted credentials on clearAuth", () => {
      const testUser: User = {
        id: "u-789",
        username: "cleared_user",
        email: "cleared@example.com",
      };

      useAuthStore.getState().setUser(testUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      useAuthStore.getState().clearAuth();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().isSessionExpired()).toBe(true);
      expect(localStorage.getItem("notiq_user")).toBeNull();
      expect(localStorage.getItem("notiq_last_active")).toBeNull();
    });

    test("renews activity normally for active, non-expired sessions", () => {
      const now = 1700000000000;
      jest.spyOn(Date, "now").mockReturnValue(now);

      const testUser: User = {
        id: "u-active",
        username: "valid_session_user",
        email: "valid@example.com",
      };

      useAuthStore.getState().setUser(testUser);
      expect(localStorage.getItem("notiq_last_active")).toBe(now.toString());

      // Advance time by 1 hour (well within 24h timeout)
      const later = now + 60 * 60 * 1000;
      Date.now.mockReturnValue(later);

      expect(useAuthStore.getState().isSessionExpired()).toBe(false);

      useAuthStore.getState().updateActivity();

      expect(localStorage.getItem("notiq_last_active")).toBe(later.toString());
      expect(useAuthStore.getState().isSessionExpired()).toBe(false);

      jest.restoreAllMocks();
    });

    test("skips activity renewal and does not extend session when session has already expired", () => {
      const now = 1700000000000;
      jest.spyOn(Date, "now").mockReturnValue(now);

      const testUser: User = {
        id: "u-expired",
        username: "expired_session_user",
        email: "expired@example.com",
      };

      useAuthStore.getState().setUser(testUser);
      expect(localStorage.getItem("notiq_last_active")).toBe(now.toString());

      // Advance time past 24 hours (24h + 10s)
      const expiredTime = now + 24 * 60 * 60 * 1000 + 10000;
      Date.now.mockReturnValue(expiredTime);

      // Session must be expired
      expect(useAuthStore.getState().isSessionExpired()).toBe(true);

      // Interaction after 24h calls updateActivity
      useAuthStore.getState().updateActivity();

      // Timestamp must NOT have been updated to expiredTime
      expect(localStorage.getItem("notiq_last_active")).toBe(now.toString());
      // Session must remain expired
      expect(useAuthStore.getState().isSessionExpired()).toBe(true);

      jest.restoreAllMocks();
    });

    test("unauthenticated users do not write activity timestamps on updateActivity", () => {
      useAuthStore.getState().clearAuth();
      useAuthStore.getState().updateActivity();

      expect(localStorage.getItem("notiq_last_active")).toBeNull();
      expect(useAuthStore.getState().isSessionExpired()).toBe(true);
    });
  });
});
