import axios from "axios";
import { Dispatch } from "redux";
import { updateAirdropData } from "../../actions";
import { getMerkleTree, isRedeemed } from "../../actions/contractsActions";
import { IPFS_PREFIX, LocalStorage } from "../../constants/constants";
import { normalizeAddress } from "../../utils";
import { TOKEN_AIRDROP_IPFS_CID } from "./constants";

/**
 * Function to fetch airdrop data
 * @param {string} selectedAddress
 * @param {Function} showAirdropNotification 
 * @param {Dispatch} dispatch
 */
export const fetchAirdropData = async (selectedAddress: string, showAirdropNotification: () => void, dispatch: Dispatch) => {
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



    // if (Object.values(nftData).includes(normalizeAddress(selectedAddress))) {
    //   const savedItems = JSON.parse(localStorage.getItem(LocalStorage.Airdrop) ?? "[]");
    //   const tokenID = Object.keys(nftData).find(key => nftData[key] === normalizeAddress(selectedAddress));

    //   if (!savedItems.includes(normalizeAddress(selectedAddress)) && await isRedeemed(tokenID ?? "", normalizeAddress(selectedAddress)) === false) {
    //     showAirdropNotification();
    //   }
    // }


  } catch (error) {
    console.error(error);
  }
}



