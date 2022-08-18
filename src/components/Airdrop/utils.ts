import { useEthers } from "@usedapp/core";
import { useActions } from "actions/contractsActions";
import axios from "axios";
import { ethers } from "ethers";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
//import { TOKEN_AIRDROP_IPFS_CID } from "settings";
import { updateAirdropData } from "../../actions";
import { LocalStorage } from "../../constants/constants";
import { ipfsTransformUri, normalizeAddress } from "../../utils";
import { Delegation, EIP712Domain } from "./constants";

/**
 * Function to fetch airdrop data
 * @param {string} selectedAddress
 * @param {Function} showAirdropPrompt 
 * @param {Dispatch} dispatch
 */
export const useFetchAirdropData = async (showAirdropPrompt: () => void) => {
  const dispatch = useDispatch();
  const { getMerkleTree, isRedeemed } = useActions(); //hasClaimed
  const { account } = useEthers();

  const getAirdropData = useCallback(async () => {

    try {
      // TODO: Temporary disable Token Airdrop
      //const tokenData = (await axios.get(`${IPFS_PREFIX}/${TOKEN_AIRDROP_IPFS_CID}`)).data;

      // for (let key in tokenData) {
      //   key = normalizeAddress(key);
      // }

      const NFT_AIRDRPOP_IPFS_CID = await getMerkleTree();
      if (!NFT_AIRDRPOP_IPFS_CID) {
        return;
      }

      const nftData = (await axios.get(ipfsTransformUri(NFT_AIRDRPOP_IPFS_CID))).data;

      for (const key in nftData) {
        nftData[key] = normalizeAddress(nftData[key]);
      }

      dispatch(updateAirdropData({ nft: nftData, token: {} }));

      // Here we check if to show the user the Airdrop Prompt or not
      if (Object.values(nftData).includes(account)) { // (account && Object.keys(tokenData).includes(account))
        const savedItems = JSON.parse(localStorage.getItem(LocalStorage.Airdrop) ?? "[]");

        if (!savedItems.includes(account)) {
          const tokenID = Object.keys(nftData).find(key => nftData[key] === account);
          if (tokenID && account && !await isRedeemed(tokenID, account)) { // || !await hasClaimed(account!)
            showAirdropPrompt();
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [account, dispatch, getMerkleTree, isRedeemed, showAirdropPrompt]);

  useEffect(() => {
    getAirdropData();
  }, [account, getAirdropData]);
}

/**
 * hashNFT
 * @param {string} tokenId
 * @param {string} address 
 */
export const hashNFT = (tokenId: string, address: string | unknown) => {
  return Buffer.from(ethers.utils.solidityKeccak256(['uint256', 'address'], [tokenId, address]).slice(2), 'hex');
}

/**
 * hashToken
 * @param {string} account
 * @param {number} amount
 */
export const hashToken = (account: string, amount: number | unknown) => {
  return Buffer.from(ethers.utils.solidityKeccak256(['address', 'uint256'], [account, amount]).slice(2), 'hex');
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
