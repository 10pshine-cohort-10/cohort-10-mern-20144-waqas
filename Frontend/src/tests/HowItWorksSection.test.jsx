import { render, screen } from "@testing-library/react";
import HowItWorksSection from "../components/home/HowItWorksSection";

const EXPECTED_STEPS = [
  "Visit the Landing Page",
  "Create Your Account / Login",
  "Access Your Dashboard",
  "Create Your Notes",
  "Organize & Manage Notes",
  "Manage Your Tasks & To-Dos",
  "Set Reminders & Routines",
  "Stay Organized",
];

describe("HowItWorksSection component", () => {
  it("renders the How It Works heading and all 8 workflow steps", () => {
    render(<HowItWorksSection />);

    expect(
      screen.getByRole("heading", { name: /How It Works/i }),
    ).toBeInTheDocument();

    for (const stepTitle of EXPECTED_STEPS) {
      expect(
        screen.getByRole("heading", { name: stepTitle }),
      ).toBeInTheDocument();
    }
  });
});

