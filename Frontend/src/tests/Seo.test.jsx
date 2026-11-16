import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import PrivacyPolicy from "../pages/PrivacyPolicy";

describe("SEO metadata", () => {
  test("updates title, meta tags, canonical link, and JSON-LD per route", () => {
    const { rerender } = render(
      <MemoryRouter key="/" initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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
    expect(
      document.head.querySelector('meta[name="twitter:card"]')?.getAttribute("content"),
    ).toBe("summary_large_image");
    expect(
      document.head.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("http://localhost/");

    const homeJsonLd = JSON.parse(
      document.head.querySelector('script[data-seo-jsonld="true"]')?.textContent || "{}",
    );
    expect(homeJsonLd["@type"]).toBe("SoftwareApplication");

    rerender(
      <MemoryRouter key="/about" initialEntries={["/about"]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(document.title).toBe("About Us | Notiq — Making Life Organized");
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);

    const aboutJsonLd = JSON.parse(
      document.head.querySelector('script[data-seo-jsonld="true"]')?.textContent || "{}",
    );
    expect(aboutJsonLd["@type"]).toBe("AboutPage");
  });
});
