import React from "react";
import { render, screen } from "@testing-library/react";
import FeaturesSection from "../components/home/FeaturesSection";

type ExpectedFeature = string;

const EXPECTED_FEATURES: readonly ExpectedFeature[] = [
  "Daily Notes",
  "Tasks",
  "To-Do Lists",
  "Reminders",
  "Labels",
  "Archived",
  "Starred",
  "Manage Notes",
  "Daily Routines",
  "Documents",
] as const;

describe("FeaturesSection component", () => {
  it("renders the section heading, description, and all 10 features", () => {
    render(<FeaturesSection />);

    expect(
      screen.getByRole("heading", {
        name: /Everything you need to capture and organize/i,
      }),
    ).toBeInTheDocument();

    for (const title of EXPECTED_FEATURES) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });
});
