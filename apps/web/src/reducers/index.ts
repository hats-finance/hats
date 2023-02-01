import { combineReducers } from "redux";
import { web3Reducer } from "./web3";
import { layoutReducer } from "./layout";
import { dataReducer } from "./data";

const reducers = combineReducers({
  web3Reducer,
  layoutReducer,
  dataReducer
});

export default reducers;

export type RootState = ReturnType<typeof reducers>
