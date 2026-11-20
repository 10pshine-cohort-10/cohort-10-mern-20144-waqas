import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Dashboard from "../pages/Dashboard";
import api from "../services/api";
import useAuthStore, { type User } from "../store/useAuthStore";

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
    warning: jest.fn(),
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

describe("Dashboard logout behavior", () => {
  const mockUser: User = {
    id: "1",
    email: "test@example.com",
    username: "testuser",
    name: "Test User",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    useAuthStore.getState().clearAuth();
  });

  it("manual logout completes when the server request remains pending", () => {
    useAuthStore.getState().setUser(mockUser);
    (api.post as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(api.post).toHaveBeenCalledWith("/auth/logout");
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
    expect(toast.success).toHaveBeenCalledWith(
      "You have been signed out successfully.",
    );
  });

  it("inactivity logout also completes when the server request remains pending", () => {
    (api.post as jest.Mock).mockReturnValue(new Promise(() => {}));

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

  it("rejected logout requests do not prevent local sign-out or cause unhandled rejections", async () => {
    useAuthStore.getState().setUser(mockUser);
    (api.post as jest.Mock).mockReturnValue(
      Promise.reject(new Error("Network timeout")),
    );

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(api.post).toHaveBeenCalledWith("/auth/logout");
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
    expect(toast.success).toHaveBeenCalledWith(
      "You have been signed out successfully.",
    );
  });
});
