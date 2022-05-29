import { MasterAddresses, Endpoint, Subgraph, VaultService } from "./constants/constants";
import { ChainId } from '@usedapp/core'
import { NFTAirdropAddress, TokenAirdropAddress, TokenAirdropCID, TokenAirdropDelegatees } from "components/Airdrop/constants";

export const CHAINID: ChainId = process.env.REACT_APP_CHAINID ? parseInt(process.env.REACT_APP_CHAINID) as ChainId : undefined || ChainId.Rinkeby;
export const SUBGRAPH_URI = process.env.REACT_APP_SUBGRAPH_URI || Subgraph[CHAINID];
export const MASTER_ADDRESS = process.env.REACT_APP_MASTER_ADDRESS || MasterAddresses[CHAINID];
export const ENDPOINT = process.env.REACT_APP_ENDPOINT || Endpoint[CHAINID];
export const VAULT_SERVICE = process.env.REACT_APP_VAULT_SERVICE || VaultService;
export const NFT_AIRDROP_ADDRESS = NFTAirdropAddress[CHAINID] || NFTAirdropAddress[ChainId.Mainnet];
export const TOKEN_AIRDROP_ADDRESS = TokenAirdropAddress[CHAINID];
export const DELEGATEES_IPFS = process.env.REACT_APP_DELEGATEES_IPFS || TokenAirdropDelegatees[CHAINID];
export const TOKEN_AIRDROP_IPFS_CID = process.env.REACT_APP_TOKEN_AIRDROP_IPFS_CID || TokenAirdropCID[CHAINID];

//export const LP_UNISWAP_URI = process.env.REACT_APP_LP_UNISWAP_URI || LPUniswapURIs[CHAINID];