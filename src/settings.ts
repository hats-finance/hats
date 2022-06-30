import { Endpoint, VaultService, Chains, DefaultBotAddress } from "./constants/constants";
import { Chain, ChainId } from '@usedapp/core'
import { NFTAirdropAddress, TokenAirdropAddress, TokenAirdropCID, TokenAirdropDelegatees } from "components/Airdrop/constants";

export const CHAINID: ChainId = process.env.REACT_APP_CHAINID ? parseInt(process.env.REACT_APP_CHAINID) as ChainId : undefined || ChainId.Rinkeby;
export const ENDPOINT = process.env.REACT_APP_ENDPOINT || Endpoint[CHAINID];
export const VAULT_SERVICE = process.env.REACT_APP_VAULT_SERVICE || VaultService;
export const NFT_AIRDROP_ADDRESS = NFTAirdropAddress[CHAINID] || NFTAirdropAddress[ChainId.Mainnet];
export const TOKEN_AIRDROP_ADDRESS = TokenAirdropAddress[CHAINID];
export const DELEGATEES_IPFS = process.env.REACT_APP_DELEGATEES_IPFS || TokenAirdropDelegatees[CHAINID];
export const TOKEN_AIRDROP_IPFS_CID = process.env.REACT_APP_TOKEN_AIRDROP_IPFS_CID || TokenAirdropCID[CHAINID];
export const DEFAULT_BOT = process.env.REACT_APP_DEFAULT_BOT || DefaultBotAddress;

export const defaultChain: Chain = Chains[CHAINID];

/** TODO: temporary until we'll eliminate the polling */
export const POLL_INTERVAL = 10000;

/** Currently not in use */
export const INFURA_ID = process.env.REACT_APP_INFURA_ID || "";
//export const LP_UNISWAP_URI = process.env.REACT_APP_LP_UNISWAP_URI || LPUniswapURIs[CHAINID];