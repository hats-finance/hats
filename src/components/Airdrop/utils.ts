import axios from "axios";
import { ethers } from "ethers";
import { Dispatch } from "redux";
import { updateAirdropData } from "../../actions";
import { getMerkleTree, hasClaimed, isRedeemed } from "../../actions/contractsActions";
import { IPFS_PREFIX, LocalStorage } from "../../constants/constants";
import { normalizeAddress } from "../../utils";
import { TOKEN_AIRDROP_IPFS_CID } from "./constants";

export const DELEGATION_EXPIRY = 10e9;

const EIP712Domain = [
  { "name": "name", "type": "string" },
  { "name": "chainId", "type": "uint256" },
  { "name": "verifyingContract", "type": "address" }
]

const Delegation = [
  { name: 'delegatee', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
];

/**
 * Function to fetch airdrop data
 * @param {string} selectedAddress
 * @param {Function} showAirdropPrompt 
 * @param {Dispatch} dispatch
 */
export const fetchAirdropData = async (selectedAddress: string, showAirdropPrompt: () => void, dispatch: Dispatch) => {
  try {

    const tokenData = (await axios.get(`${IPFS_PREFIX}${TOKEN_AIRDROP_IPFS_CID}`)).data;

    for (let key in tokenData) {
      key = normalizeAddress(key);
    }

    const NFT_AIRDRPOP_IPFS_CID = await getMerkleTree();
    const nftData = (await axios.get(`${IPFS_PREFIX}${NFT_AIRDRPOP_IPFS_CID}`)).data;

    for (const key in nftData) {
      nftData[key] = normalizeAddress(nftData[key]);
    }

    dispatch(updateAirdropData({ nft: nftData, token: tokenData }));


    // Here we check if to show the user the Airdrop Prompt or not
    if (Object.values(nftData).includes(selectedAddress) || Object.keys(tokenData).includes(selectedAddress)) {
      const savedItems = JSON.parse(localStorage.getItem(LocalStorage.Airdrop) ?? "[]");

      if (!savedItems.includes(selectedAddress)) {
        const tokenID = Object.keys(nftData).find(key => nftData[key] === selectedAddress);
        if (!await isRedeemed(tokenID!, selectedAddress) || !await hasClaimed(selectedAddress)) {
          showAirdropPrompt();
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * hashToken
 * @param {string} key
 * @param {string} value 
 */
 export const hashToken = (key: string, value: string | number) => {
  return Buffer.from(ethers.utils.solidityKeccak256(['uint256', 'address'], [key, value]).slice(2), 'hex');
}

/**
 * Builds delegation data used in claiming token
 * @param {string} chainId 
 * @param {string} verifyingContract 
 * @param {string} delegatee 
 * @param {number} nonce 
 * @param {number} expiry 
 */
export const buildDataDelegation = (chainId: number, verifyingContract: string, delegatee: string, nonce: number, expiry: number) => ({
  types: { EIP712Domain, Delegation },
  primaryType: 'Delegation',
  domain: { name: "hats.finance", chainId, verifyingContract },
  message: { delegatee, nonce, expiry },
});
