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
  let originalScrollTo;

  beforeEach(() => {
    originalScrollTo = window.scrollTo;
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    jest.restoreAllMocks();
  });

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

  describe("ScrollToTop component behavior", () => {
    it("scrolls window to top when navigating without a hash", () => {
      render(
        <MemoryRouter initialEntries={["/about"]}>
          <App />
        </MemoryRouter>,
      );

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "auto",
      });
    });

    it("scrolls to the target section when navigating to /#features", () => {
      const scrollIntoViewMock = jest.fn();
      const featuresElem = document.createElement("div");
      featuresElem.id = "features";
      featuresElem.scrollIntoView = scrollIntoViewMock;
      document.body.appendChild(featuresElem);

      render(
        <MemoryRouter initialEntries={["/#features"]}>
          <App />
        </MemoryRouter>,
      );

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: "auto",
        block: "start",
      });
      expect(window.scrollTo).not.toHaveBeenCalled();

      document.body.removeChild(featuresElem);
    });

    it("scrolls to the target section when navigating to /#how-it-works", () => {
      const scrollIntoViewMock = jest.fn();
      const howItWorksElem = document.createElement("div");
      howItWorksElem.id = "how-it-works";
      howItWorksElem.scrollIntoView = scrollIntoViewMock;
      document.body.appendChild(howItWorksElem);

      render(
        <MemoryRouter initialEntries={["/#how-it-works"]}>
          <App />
        </MemoryRouter>,
      );

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: "auto",
        block: "start",
      });
      expect(window.scrollTo).not.toHaveBeenCalled();

      document.body.removeChild(howItWorksElem);
    });

    it("does not call window.scrollTo when hash is present even if target element is missing", () => {
      render(
        <MemoryRouter initialEntries={["/#non-existent-section"]}>
          <App />
        </MemoryRouter>,
      );

      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });
});
