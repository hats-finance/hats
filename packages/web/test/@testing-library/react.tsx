/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";

// Redux
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "../../src/reducers";

const renderConnected = (component) => {
  const store = createStore(reducers);

  return render(
    <Provider store={store}>
      <MockedProvider>
        <MemoryRouter>{component}</MemoryRouter>
      </MockedProvider>
    </Provider>
  );
};

// re-export everything
export * from "@testing-library/react";

// add new render methods
export { renderConnected };
