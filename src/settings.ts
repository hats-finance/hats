import { DEFAULT_RINKEBY_SUBGRAPH_URI, LiquidityPoolsURIs, Networks } from "./constants/constants";
require('dotenv').config();

export const NETWORK: Networks = process.env.REACT_APP_NETWORK as Networks || Networks.rinkeby;
export const SUBGRAPH_URI = process.env.REACT_APP_SUBGRAPH_URI || DEFAULT_RINKEBY_SUBGRAPH_URI;
export const LIQUIDITY_POOLS_URI = process.env.REACT_APP_LIQUIDITY_POOLS_URI || LiquidityPoolsURIs[NETWORK];
export const DATA_POLLING_INTERVAL = 10000;
