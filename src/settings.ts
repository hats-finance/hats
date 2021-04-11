import { Networks } from "./constants/constants";

export const NETWORK: Networks = Networks.rinkeby; // TODO: should be as env var
export const SUBGRAPH_URI = "https://api.thegraph.com/subgraphs/name/hats-finance/hats_rinkeby_v1"; // TODO: should be as env var

/** We use polling unless we know The Graph WebSocket is stable and reliable to use */
export const DATA_POLLING_INTERVAL = 10000;
