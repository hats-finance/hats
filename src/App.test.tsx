import React from "react";
import { renderConnected, within } from "../test/@testing-library/react";
import { createMockServer } from "../test/msw/server";

import App from "./App";

const defaultProps = {};

let server;
beforeAll(() => {
  server = createMockServer();
  server.listen({
    onUnhandledRequest(req) {
      console.error(
        "Found an unhandled %s request to %s",
        req.method,
        req.url.href
      );
    },
  });
});

test("Loads the App to the Welcome screen", () => {
  const { getByTestId } = renderConnected(<App {...defaultProps} />);

  const welcome = getByTestId("Welcome");
  expect(within(welcome).getByText("Hats")).toBeInTheDocument();
  expect(
    within(welcome).getByText(
      "We are changing the way security works to fit the culture, nature, and de-facto development processes of Ethereum by incentivizing black hat to become white hat hackers."
    )
  ).toBeInTheDocument();
  expect(within(welcome).getByText("ENTER")).toBeInTheDocument();
});
