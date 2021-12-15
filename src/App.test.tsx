import React from "react";
import {
  renderConnected,
  within,
  cleanup,
  fireEvent
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

test("Loads the App to the Welcome screen and accept cookies", async () => {
  const { getByTestId, queryByTestId } = renderConnected(<App />);

  // Welcome
  expect(within(getByTestId("Welcome")).getByText("Hats")).toBeInTheDocument();
  expect(
    within(getByTestId("Welcome")).getByText(
      "We are changing the way security works to fit the culture, nature, and de-facto development processes of Ethereum by incentivizing black hat to become white hat hackers."
    )
  ).toBeInTheDocument();
  expect(within(getByTestId("Welcome")).getByText("ENTER")).toBeInTheDocument();

  fireEvent.click(within(getByTestId("Welcome")).getByText("ENTER"));

  // Cookies
  expect(
    within(getByTestId("Cookies")).getByText(
      "This website uses cookies to ensure you the best experience on our website"
    )
  ).toBeInTheDocument();
  expect(
    within(getByTestId("Cookies")).getByText("Cookies Policy")
  ).toBeInTheDocument();
  expect(
    within(getByTestId("Cookies")).getByText("ACCEPT")
  ).toBeInTheDocument();

  expect(getByTestId("Cookies")).toBeInTheDocument();

  fireEvent.click(within(getByTestId("Cookies")).getByText("ACCEPT"));
  expect(queryByTestId("Cookies")).not.toBeInTheDocument();

  // Header
  expect(
    within(getByTestId("Header")).getByText("Connect a Wallet")
  ).toBeInTheDocument();
});

test("Loads the App to the Welcome screen with localized text", () => {
  setLocalStorage({ ...defaultLocalStorage, i18nextLng: "jp" });
  const { getByTestId } = renderConnected(<App />);

  const welcome = getByTestId("Welcome");
  expect(within(welcome).getByText("Hats")).toBeInTheDocument();
  expect(within(welcome).getByText("エンター")).toBeInTheDocument();
});
