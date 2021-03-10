import { useDispatch, useSelector } from "react-redux";
import { getNetworkNameByChainId, getEtherBalance } from "../utils";
import { getTokenBalance } from "../actions/contractsActions";
import { updateWalletBalance } from "../actions/index";
import { HATS_TOKEN } from "../constants/constants";

/**
 * A custom hook to update the wallet balance in the redux store for both ETH and HATS
 */
export const useWalletBalance = () => {
  const dispatch = useDispatch();
  const selectedAddress = useSelector(state => state.web3Reducer.provider?.selectedAddress) ?? "";
  const chainId = useSelector(state => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);

  return async () => {
    if (selectedAddress) {
      dispatch(updateWalletBalance(null, null));
      dispatch(updateWalletBalance(await getEtherBalance(network, selectedAddress), await getTokenBalance(HATS_TOKEN, selectedAddress)));
    }
  }
}
