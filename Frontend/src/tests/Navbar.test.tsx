import React from "react";
import { render, screen, type RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import useThemeStore from "../store/useThemeStore";

interface ExpectedLink {
  name: string;
  href: string;
}

const EXPECTED_LINKS: readonly ExpectedLink[] = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Community Love", href: "/#testimonials" },
] as const;

describe("Navbar component", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useThemeStore.getState().setTheme("light");
  });

  const renderNavbar = (initialRoute: string = "/"): RenderResult =>
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navbar />
      </MemoryRouter>,
    );

  it("renders the logo, brand name, navigation links, and single Login CTA button", () => {
    renderNavbar();

    expect(screen.getByAltText("Notiq logo")).toBeInTheDocument();
    expect(screen.getByText("Notiq")).toBeInTheDocument();

    for (const { name, href } of EXPECTED_LINKS) {
      const links = screen.getAllByRole("link", { name });
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0]).toHaveAttribute("href", href);
    }

    const loginLinks = screen.getAllByRole("link", { name: "Login" });
    expect(loginLinks).toHaveLength(1);
    expect(loginLinks[0]).toHaveAttribute("href", "/login");
  });

  it("smoothly scrolls to Features, How It Works, and Community Love sections", async () => {
    const user = userEvent.setup();
    const scrollIntoViewMock = jest.fn<void, [ScrollIntoViewOptions | undefined]>();

    const sectionIds: string[] = ["features", "how-it-works", "testimonials"];
    const createdSections = sectionIds.map((id) => {
      const el = document.createElement("section");
      el.id = id;
      el.scrollIntoView = scrollIntoViewMock as unknown as typeof el.scrollIntoView;
      document.body.appendChild(el);
      return el;
    });

    try {
      renderNavbar("/");

      await user.click(screen.getAllByRole("link", { name: "Features" })[0]);
      await user.click(screen.getAllByRole("link", { name: "How It Works" })[0]);
      await user.click(screen.getAllByRole("link", { name: "Community Love" })[0]);

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

  it("toggles between light and dark mode via Zustand theme store", async () => {
    const user = userEvent.setup();
    renderNavbar();

    expect(document.documentElement.classList.contains("dark")).toBe(false);

    const toggleButton = screen.getByRole("button", { name: /switch to dark mode/i });
    await user.click(toggleButton);

    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem("notiq-theme")).toBe("dark");

    await user.click(screen.getByRole("button", { name: /switch to light mode/i }));

    expect(useThemeStore.getState().theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(window.localStorage.getItem("notiq-theme")).toBe("light");
  });

  it("opens and closes the mobile navigation menu", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const menuButton = screen.getByRole("button", { name: /open navigation menu/i });
    const mobileMenu = document.getElementById("mobile-nav-menu");

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(mobileMenu).toHaveAttribute("aria-hidden", "true");

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(mobileMenu).toHaveAttribute("aria-hidden", "false");

    await user.keyboard("{Escape}");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
    expect(menuButton).toHaveFocus();
  });
});
