import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/index';
import reducers from "../reducers/index";

const sagaMiddleware = createSagaMiddleware();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancer(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga);

export default store;