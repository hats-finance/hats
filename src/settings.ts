import { NFTAirdropAddress, TokenAirdropAddress, TokenAirdropCID, TokenAirdropDelegatees } from "components/Airdrop/constants";
import { DEFAULT_RINKEBY_SUBGRAPH_URI, LPUniswapURIs, MasterAddresses, Networks, VaultService } from "constants/constants";

require('dotenv').config();

export const NETWORK: Networks = process.env.REACT_APP_NETWORK as Networks || Networks.rinkeby;
export const SUBGRAPH_URI = process.env.REACT_APP_SUBGRAPH_URI || DEFAULT_RINKEBY_SUBGRAPH_URI;
export const LP_UNISWAP_URI = process.env.REACT_APP_LP_UNISWAP_URI || LPUniswapURIs[NETWORK];
export const MASTER_ADDRESS = process.env.REACT_APP_MASTER_ADDRESS || MasterAddresses[NETWORK];
export const VAULT_SERVICE = process.env.VAULT_SERVICE || VaultService[NETWORK];
export const NFT_AIRDROP_ADDRESS = NFTAirdropAddress[NETWORK] || NFTAirdropAddress.main;
export const TOKEN_AIRDROP_ADDRESS = TokenAirdropAddress[NETWORK];
export const DELEGATEES_IPFS = process.env.REACT_APP_DELEGATEES_IPFS || TokenAirdropDelegatees[NETWORK];
export const TOKEN_AIRDROP_IPFS_CID = process.env.REACT_APP_TOKEN_AIRDROP_IPFS_CID || TokenAirdropCID[NETWORK];
export const DATA_POLLING_INTERVAL = 10000;

/** Currently not in use */
export const INFURA_ID = process.env.REACT_APP_INFURA_ID || "";