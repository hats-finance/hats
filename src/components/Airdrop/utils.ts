import {useEffect, useState} from "react";
import { useEthers } from "@usedapp/core";
import { useActions } from "actions/contractsActions";
import axios from "axios";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
//import { TOKEN_AIRDROP_IPFS_CID } from "settings";
import { updateAirdropData } from "../../actions";
import { IPFS_PREFIX, LocalStorage } from "../../constants/constants";
import { normalizeAddress } from "../../utils";
import { Delegation, EIP712Domain } from "./constants";

/**
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
  const [nftAirdrpopIpfsCid, setNftAirdrpopIpfsCid] = useState();
  const [nftData, setNftData] = useState();

  useEffect(() => {
    if (!nftAirdrpopIpfsCid) {
      const fetchMerkleTree = async () => {
        try{
        const merkleTree = await getMerkleTree();
        console.log({ merkleTree });
        // @ts-ignore
        setNftAirdrpopIpfsCid(merkleTree);
        }catch(e){
          console.log("error getting merkle tree: ", e);
        }
      };
      fetchMerkleTree();
    }
  }, []);

  useEffect(() => {
    if (nftAirdrpopIpfsCid) {
      const getNftData = async () => {
        try{
        const res = (await axios.get(`${IPFS_PREFIX}/${nftAirdrpopIpfsCid}`))
          .data;
        console.log({res})
        for (const key in res) {
          res[key] = normalizeAddress(res[key]);
        }
        setNftData(res);
        }catch(e){
          console.log("error getting addresses: ", e)
        }
      };
      getNftData();
    }
  }, [nftAirdrpopIpfsCid]);

  useEffect(() => {
    //@ts-ignore
    dispatch(updateAirdropData({ nft: nftData, token: {} }));
    const checkIfShowUserAirdrom = async () => {
      console.log({nftData, account })
      if (nftData && Object.values(nftData).includes(account)) {
        // (account && Object.keys(tokenData).includes(account))
        const savedItems = JSON.parse(
          localStorage.getItem(LocalStorage.Airdrop) ?? "[]"
        );

        if (!savedItems.includes(account)) {
          //@ts-ignore
          const tokenID = Object.keys(nftData).find(
            //@ts-ignore
            (key) => nftData[key] === account
          );
          if (tokenID && account && !(await isRedeemed(tokenID, account))) {
            // || !await hasClaimed(account!)
            showAirdropPrompt();
          }
        }
      }
    };
    checkIfShowUserAirdrom();
  }, [nftAirdrpopIpfsCid, account, isRedeemed, nftData]);
};

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
