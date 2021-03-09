import { useDispatch, useSelector } from "react-redux";
import { getNetworkNameByChainId, getEtherBalance } from "../utils";
import { getTokenBalance } from "../actions/contractsActions";
import { updateWalletBalance } from "../actions/index";
import { HATS_TOKEN, Networks } from "../constants/constants";

/**
 * A custom hook to update the wallet balance in the redux store for both ETH and HATS
 */
export const useWalletBalance = () => {
  const dispatch = useDispatch();
  const selectedAddress = useSelector(state => state.web3Reducer.provider?.selectedAddress) ?? "";
  const chainId = useSelector(state => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);

  return async () => {
    if (network !== Networks.rinkeby) { // TEMPORARY - UNTIL WE HAVE CROSS-NETWORK TOKEN
      dispatch(updateWalletBalance(await getEtherBalance(network, selectedAddress), "--"));
    } else if (selectedAddress) {
      dispatch(updateWalletBalance(null, null));
      dispatch(updateWalletBalance(await getEtherBalance(network, selectedAddress), await getTokenBalance(HATS_TOKEN, selectedAddress)));
    }
  }
}
