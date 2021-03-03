import { combineReducers } from "redux";
import { web3Reducer } from "./web3";
import { layoutReducer } from "./layout";

const reducers = combineReducers({
  web3Reducer,
  layoutReducer
});

export default reducers;
