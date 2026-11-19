import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import About from "../pages/About";
import Contact from "../pages/Contact";
import PrivacyPolicy from "../pages/PrivacyPolicy";

describe("Company Info Pages", () => {
  test("About page renders hero, vision, 6 services, and Explore Our Showcase CTA", () => {
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

    expect(screen.getByText("Our Vision")).toBeInTheDocument();
    expect(screen.getByText("Web Applications")).toBeInTheDocument();
    expect(screen.getByText("Business Systems")).toBeInTheDocument();
    expect(screen.getByText("Custom Software")).toBeInTheDocument();
    expect(screen.getByText("UI/UX Design")).toBeInTheDocument();
    expect(screen.getByText("Productivity Solutions")).toBeInTheDocument();
    expect(screen.getByText("AI Integrations")).toBeInTheDocument();

    const showcaseLink = screen.getByRole("link", {
      name: /Explore Our Showcase/i,
    });
    expect(showcaseLink).toHaveAttribute(
      "href",
      "https://waqasportfolio77.vercel.app/",
    );
    expect(showcaseLink).toHaveAttribute("target", "_blank");
    expect(showcaseLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("Contact page renders hero, contact cards, motivational heading, WhatsApp CTA, and no form", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/contact"]}>
        <Contact />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /Let's Connect and Build Something Great\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /Every Great Project Starts With a Conversation\./i,
      }),
    ).toBeInTheDocument();

    const whatsappLink = screen.getByRole("link", {
      name: /Chat on WhatsApp/i,
    });
    expect(whatsappLink).toHaveAttribute("href", "https://wa.me/923025649101");
    expect(whatsappLink).toHaveAttribute("target", "_blank");

    expect(container.querySelector("form")).toBeNull();
  });

  test("Privacy Policy page renders last updated date and all 12 sections", () => {
    render(
      <MemoryRouter initialEntries={["/privacy-policy"]}>
        <PrivacyPolicy />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Last Updated: November 12, 2026/i)).toBeInTheDocument();

    const expectedHeadings: readonly string[] = [
      "1. Introduction",
      "2. Information Collection and Usage",
      "3. Account Security",
      "4. Notes and User Content",
      "5. Data Storage and Protection",
      "6. Cookies and Third-Party Services",
      "7. Data Sharing",
      "8. User Rights and Data Deletion",
      "9. Data Retention",
      "10. Children's Privacy",
      "11. Policy Updates",
      "12. Contact Information",
    ];

    for (const heading of expectedHeadings) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
  });
});
