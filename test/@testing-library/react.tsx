/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";

// Redux
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../../src/sagas/index";
import reducers from "../../src/reducers";

const renderConnected = (component) => {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancer = compose;
  const store = createStore(
    reducers,
    composeEnhancer(applyMiddleware(sagaMiddleware))
  );
  sagaMiddleware.run(rootSaga);

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
