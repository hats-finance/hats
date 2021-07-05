import { Networks } from "./constants/constants";

export const NETWORK: Networks = process.env.NETWORK as Networks || Networks.rinkeby;
export const SUBGRAPH_URI = process.env.SUBGRAPH_URI || "https://api.thegraph.com/subgraphs/name/hats-finance/hats_rinkeby_v2";
export const DATA_POLLING_INTERVAL = 10000; // TODO: should be as env var?
