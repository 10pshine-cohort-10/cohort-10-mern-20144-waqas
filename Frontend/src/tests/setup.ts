import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "node:util";

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
}
if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}

if (!globalThis.IntersectionObserver) {
  class MockIntersectionObserver {
    callback: IntersectionObserverCallback;
    root: Element | Document | null = null;
    rootMargin: string = "";
    thresholds: ReadonlyArray<number> = [];

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element): void {
      const entry = {
        isIntersecting: true,
        target,
      } as unknown as IntersectionObserverEntry;
      this.callback([entry], this as unknown as IntersectionObserver);
    }

    unobserve(_target: Element): void {}

    disconnect(): void {}

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof globalThis.IntersectionObserver;
}

if (typeof window !== "undefined") {
  window.scrollTo = jest.fn();
}
