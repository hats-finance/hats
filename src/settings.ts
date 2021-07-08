import { Networks } from "./constants/constants";
require('dotenv').config();

export const NETWORK: Networks = process.env.REACT_APP_NETWORK as Networks || Networks.rinkeby;
export const SUBGRAPH_URI = process.env.REACT_APP_SUBGRAPH_URI || "https://api.thegraph.com/subgraphs/name/hats-finance/hats_rinkeby_v2";
export const DATA_POLLING_INTERVAL = 10000;
