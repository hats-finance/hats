import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { createMockServer } from "./msw/server";

global.React = React;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const server = createMockServer();
server.listen({
  onUnhandledRequest(req) {
    console.error(
      "Found an unhandled %s request to %s",
      req.method,
      req.url.href
    );
  },
});
