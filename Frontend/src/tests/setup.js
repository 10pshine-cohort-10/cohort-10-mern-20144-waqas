import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "node:util";

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}
if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}

if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }

    observe(target) {
      this.callback([{ isIntersecting: true, target }]);
    }

    unobserve() {}

    disconnect() {}
  };
}

if (typeof window !== "undefined") {
  window.scrollTo = jest.fn();
}
