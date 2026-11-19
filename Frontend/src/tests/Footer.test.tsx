import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../components/layout/Footer";

describe("Footer", () => {
  test("renders Notiq branding, quick links, company links, contact info, social links, and copyright", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("Notiq")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Features" })).toHaveAttribute(
      "href",
      "/#features",
    );
    expect(screen.getByRole("link", { name: "How It Works" })).toHaveAttribute(
      "href",
      "/#how-it-works",
    );
    expect(screen.getByRole("link", { name: "Community Love" })).toHaveAttribute(
      "href",
      "/#testimonials",
    );

    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy-policy",
    );
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute(
      "href",
      "/register",
    );

    expect(screen.getByText("03025649101").closest("a")).toHaveAttribute(
      "href",
      "tel:03025649101",
    );
    expect(screen.getByText("waqastariq9101@gmail.com").closest("a")).toHaveAttribute(
      "href",
      "mailto:waqastariq9101@gmail.com",
    );
    expect(screen.getByText("Mirpur AJK")).toBeInTheDocument();

    const instagramLink = screen.getByRole("link", { name: "Instagram" });
    expect(instagramLink).toHaveAttribute("target", "_blank");
    expect(instagramLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: "X (Twitter)" })).toHaveAttribute(
      "target",
      "_blank",
    );

    expect(
      screen.getByText("© 2026 Notiq. All rights reserved."),
    ).toBeInTheDocument();
  });

  test("smoothly scrolls to top when Back to Top is clicked", () => {
    const scrollToSpy = jest.fn<void, [ScrollToOptions | undefined]>();
    window.scrollTo = scrollToSpy as unknown as typeof window.scrollTo;

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Footer />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /back to top/i }));
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
