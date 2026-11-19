import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

jest.mock("../services/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("App setup smoke test", () => {
  it("renders the Notiq home shell with navbar and hero", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByAltText("Notiq logo")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /A home for everything you think, learn, and create\./i,
      }),
    ).toBeInTheDocument();
  });
});
