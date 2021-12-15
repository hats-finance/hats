import React from "react";
import {
  renderConnected,
  within,
  cleanup,
} from "../test/@testing-library/react";
import { setLocalStorage } from "../test/testHelpers";

import App from "./App";

const defaultLocalStorage = { i18nextLng: "en" };

beforeEach(() => {
  jest.resetModules();
  setLocalStorage(defaultLocalStorage);
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

test("Loads the App to the Welcome screen", () => {
  const { getByTestId } = renderConnected(<App />);

  const welcome = getByTestId("Welcome");
  expect(within(welcome).getByText("Hats")).toBeInTheDocument();
  expect(
    within(welcome).getByText(
      "We are changing the way security works to fit the culture, nature, and de-facto development processes of Ethereum by incentivizing black hat to become white hat hackers."
    )
  ).toBeInTheDocument();
  expect(within(welcome).getByText("ENTER")).toBeInTheDocument();
});

test("Loads the App to the Welcome screen with localized text", () => {
  setLocalStorage({ ...defaultLocalStorage, i18nextLng: "jp" });
  const { getByTestId } = renderConnected(<App />);

  const welcome = getByTestId("Welcome");
  expect(within(welcome).getByText("Hats")).toBeInTheDocument();
  expect(within(welcome).getByText("エンター")).toBeInTheDocument();
});
