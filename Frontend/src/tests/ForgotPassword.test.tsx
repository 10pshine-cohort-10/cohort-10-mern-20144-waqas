import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import ForgotPassword from "../pages/ForgotPassword";
import api from "../services/api";

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

describe("ForgotPassword Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders page structure and visual highlights", () => {
    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <ForgotPassword />
      </MemoryRouter>,
    );

    expect(screen.getByText("Restore Your Access in Seconds.")).toBeInTheDocument();
    expect(screen.getByLabelText("Registered Email Address")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Reset Link" }),
    ).toBeInTheDocument();
  });

  it("validates empty email and invalid format", () => {
    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <ForgotPassword />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }));
    expect(screen.getByText("Email address is required.")).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Registered Email Address"), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }));
    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("submits normalized email and displays success confirmation with submitted email", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
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

    fireEvent.change(screen.getByLabelText("Registered Email Address"), {
      target: { value: "  Alex.Dev@Example.COM  " },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/forgot-password", {
        email: "alex.dev@example.com",
      });
    });

    await waitFor(() => {
      expect(screen.getByText("Check Your Inbox")).toBeInTheDocument();
    });

    expect(screen.getByText("alex.dev@example.com")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith(
      "Reset link dispatched successfully.",
    );
  });

  it("changing editable email during/after submission does not change the email shown in the success confirmation", async () => {
    let resolveApiPost: (value: unknown) => void = () => {};
    const apiPromise = new Promise((resolve) => {
      resolveApiPost = resolve;
    });
    (api.post as jest.Mock).mockReturnValueOnce(apiPromise);

    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <ForgotPassword />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText("Registered Email Address");
    fireEvent.change(emailInput, {
      target: { value: "original@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }));

    // While the request is pending, mutate the editable email input
    fireEvent.change(emailInput, {
      target: { value: "different-edited@example.com" },
    });

    // Resolve API request
    resolveApiPost({
      data: {
        success: true,
        message: "Password reset link sent!",
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Check Your Inbox")).toBeInTheDocument();
    });

    // The displayed confirmation must show the submitted/sent email, NOT the edited input
    expect(screen.getByText("original@example.com")).toBeInTheDocument();
    expect(screen.queryByText("different-edited@example.com")).not.toBeInTheDocument();
  });

  it("allows resending after success and resets confirmation state", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { success: true },
    });

    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <ForgotPassword />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Registered Email Address"), {
      target: { value: "first@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }));

    await waitFor(() => {
      expect(screen.getByText("Check Your Inbox")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Resend Email" }));

    expect(screen.queryByText("Check Your Inbox")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Registered Email Address")).toBeInTheDocument();
  });

  it("displays server error when API request fails", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          message: "No account found with this email address.",
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <ForgotPassword />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Registered Email Address"), {
      target: { value: "unknown@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }));

    await waitFor(() => {
      expect(
        screen.getByText("No account found with this email address."),
      ).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "No account found with this email address.",
    );
  });
});
