import { rest } from "msw";
import { setupServer } from "msw/node";

import commonHandlers from "./mockAPI.js";

function createMockServer(customHandlers = []) {
  return setupServer(...commonHandlers, ...customHandlers);
}

export { createMockServer, rest };
