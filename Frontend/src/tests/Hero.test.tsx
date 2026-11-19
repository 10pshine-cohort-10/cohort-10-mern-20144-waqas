import React from "react";
import { render, screen, type RenderResult } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "../components/home/Hero";

describe("Hero component", () => {
  const renderHero = (): RenderResult =>
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

  it("renders the main headline, description, and single Get Started CTA without the top badge", () => {
    renderHero();

    expect(screen.queryByText("Your workspace for everything")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /A home for everything you think, learn, and create\./i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Notiq brings your notes, tasks, ideas, and knowledge together/i),
    ).toBeInTheDocument();

    const ctaLinks = screen.getAllByRole("link");
    expect(ctaLinks).toHaveLength(1);
    expect(ctaLinks[0]).toHaveTextContent("Get Started");
    expect(ctaLinks[0]).toHaveAttribute("href", "/signup");
  });
});
