import { render, screen } from "@testing-library/react";
import TestimonialsSection from "../components/home/TestimonialsSection";

const EXPECTED_NAMES = [
  "Maya Patel",
  "Liam Brooks",
  "Sofia Alvarez",
  "Noah Kim",
  "Elena Rossi",
  "Daniel Okafor",
  "Hannah Chen",
  "Lucas Meyer",
  "Amara Singh",
];

describe("TestimonialsSection component", () => {
  it("renders the section heading and all 9 user testimonials", () => {
    render(<TestimonialsSection />);

    expect(
      screen.getByRole("heading", { name: /How People Use Notiq/i }),
    ).toBeInTheDocument();

    for (const name of EXPECTED_NAMES) {
      expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(1);
    }
  });
});

