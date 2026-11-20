import React, { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ResetPassword from "../pages/ResetPassword";
import api from "../services/api";

jest.mock("../services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
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

let navigateFn: ReturnType<typeof useNavigate>;

function TestNavigationController(): React.JSX.Element | null {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigateFn = navigate;
  }, [navigate]);
  return null;
}

function renderResetPassword(initialPath = "/reset-password") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <TestNavigationController />
      <ResetPassword />
    </MemoryRouter>,
  );
}

describe("ResetPassword Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("missing token changes verification state to invalid immediately", () => {
    renderResetPassword("/reset-password");

    expect(screen.getByText("Link Expired or Invalid")).toBeInTheDocument();
    expect(
      screen.getByText("Missing password reset token in the link."),
    ).toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
  });

  it("removes token after initial verification and transitions to invalid state", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { message: "Token valid" },
    });

    renderResetPassword("/reset-password?token=initial-valid-token");

    // Initially valid after token verification
    await waitFor(() => {
      expect(screen.getByText("Reset Password")).toBeInTheDocument();
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    });

    // Token disappears (e.g. navigation without query parameter)
    await act(async () => {
      navigateFn("/reset-password");
    });

    // Verification state must transition to invalid and show missing token message
    expect(screen.getByText("Link Expired or Invalid")).toBeInTheDocument();
    expect(
      screen.getByText("Missing password reset token in the link."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Reset Password")).not.toBeInTheDocument();
  });

  it("changing to a new token clears the previous error and sets checking state", async () => {
    // First token fails verification
    (api.get as jest.Mock).mockRejectedValueOnce({
      response: {
        data: { message: "First token expired." },
      },
    });

    let resolveSecondToken: (value: unknown) => void = () => {};
    const secondTokenPromise = new Promise((resolve) => {
      resolveSecondToken = resolve;
    });
    (api.get as jest.Mock).mockReturnValueOnce(secondTokenPromise);

    renderResetPassword("/reset-password?token=expired-token-1");

    // Wait for the first token to fail
    await waitFor(() => {
      expect(screen.getByText("First token expired.")).toBeInTheDocument();
    });

    // Navigate to a new token
    await act(async () => {
      navigateFn("/reset-password?token=fresh-token-2");
    });

    // The previous error must be cleared and the checking state displayed
    expect(screen.queryByText("First token expired.")).not.toBeInTheDocument();
    expect(screen.getByText("Verifying Reset Link...")).toBeInTheDocument();

    // Now resolve the second token
    await act(async () => {
      resolveSecondToken({ data: { message: "Token 2 valid" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Reset Password")).toBeInTheDocument();
    });
  });

  it("stale verification results cannot overwrite the latest token state", async () => {
    // Slow token A
    let resolveTokenA: (value: unknown) => void = () => {};
    const tokenAPromise = new Promise((resolve) => {
      resolveTokenA = resolve;
    });

    // Fast token B
    const tokenBPromise = Promise.resolve({
      data: { message: "Token B valid" },
    });

    (api.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("token-a")) return tokenAPromise;
      if (url.includes("token-b")) return tokenBPromise;
      return Promise.reject(new Error("Unknown token"));
    });

    renderResetPassword("/reset-password?token=token-a");

    // Starts checking token-a
    expect(screen.getByText("Verifying Reset Link...")).toBeInTheDocument();

    // Before token-a settles, switch to token-b
    await act(async () => {
      navigateFn("/reset-password?token=token-b");
    });

    // Token B completes and shows reset password form
    await waitFor(() => {
      expect(screen.getByText("Reset Password")).toBeInTheDocument();
    });

    // Now Token A resolves late with an error
    await act(async () => {
      resolveTokenA({
        response: {
          data: { message: "Token A was rejected" },
        },
      });
    });

    // Verification state for Token B MUST remain valid and not get overwritten
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(screen.queryByText("Link Expired or Invalid")).not.toBeInTheDocument();
  });

  it("successfully resets password when form is filled and submitted", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { message: "Token valid" },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { message: "Password updated successfully!" },
    });

    renderResetPassword("/reset-password?token=valid-token");

    await waitFor(() => {
      expect(screen.getByText("Reset Password")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "StrongPass!2026" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "StrongPass!2026" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Update Password" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/reset-password", {
        token: "valid-token",
        password: "StrongPass!2026",
        confirmPassword: "StrongPass!2026",
      });
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Password updated successfully!",
    );
  });
});
