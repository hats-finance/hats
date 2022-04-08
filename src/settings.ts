import { DEFAULT_RINKEBY_SUBGRAPH_URI, LPUniswapURIs, MasterAddresses, NFTAirdropAddress, WalletConnectRPC } from "./constants/constants";
import { ChainId } from '@usedapp/core'
require('dotenv').config();

export const NETWORK: ChainId = parseInt(process.env.REACT_APP_NETWORK!) as ChainId || ChainId.Rinkeby;
export const SUBGRAPH_URI = process.env.REACT_APP_SUBGRAPH_URI || DEFAULT_RINKEBY_SUBGRAPH_URI;
export const LP_UNISWAP_URI = process.env.REACT_APP_LP_UNISWAP_URI || LPUniswapURIs[NETWORK];
export const MASTER_ADDRESS = process.env.REACT_APP_MASTER_ADDRESS || MasterAddresses[NETWORK];
export const NFT_AIRDROP_ADDRESS = NFTAirdropAddress[NETWORK] || NFTAirdropAddress.main;
export const WALLET_CONNECT_RPC = process.env.REACT_APP_WALLET_CONNECT_RPC || WalletConnectRPC[NETWORK];
export const DATA_POLLING_INTERVAL = 10000;

/** Currently not in use */
export const INFURA_ID = process.env.REACT_APP_INFURA_ID || "";
