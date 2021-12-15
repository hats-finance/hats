import { setupServer } from "msw/node";

import commonHandlers from "../__mocks__/APIMock";

function createMockServer(customHandlers = []) {
  return setupServer(...commonHandlers, ...customHandlers);
}

export { createMockServer };
