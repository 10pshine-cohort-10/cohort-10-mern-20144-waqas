import React from "react";
import { render, screen } from "@testing-library/react";
import FeatureShowcase from "../components/home/FeatureShowcase";

describe("FeatureShowcase component", () => {
  it("renders the section heading and all four feature items", () => {
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
});
