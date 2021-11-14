import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { NETWORK } from "../../settings";
import { getNetworkNameByChainId, truncatedAddress } from "../../utils";
import millify from "millify";
import "./WalletInfo.scss";
import TransactionInfo from "../TransactionInfo/TransactionInfo";
import { ScreenSize } from "../../constants/constants";

export default function WalletInfo() {
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);
  const inTransaction = useSelector((state: RootState) => state.layoutReducer.inTransaction);
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const { ethBalance } = useSelector((state: RootState) => state.web3Reducer);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";

  return (
    <div className="wallet-info-wrapper">
      {screenSize === ScreenSize.Desktop && network === NETWORK &&
        <div className="wallet-balance">
          {ethBalance && <span>{`${millify(ethBalance)} ETH`}</span>}
        </div>}
      {inTransaction ? <TransactionInfo /> : screenSize === ScreenSize.Desktop && <span>{truncatedAddress(selectedAddress)}</span>}
      {screenSize === ScreenSize.Desktop && <span className="network-name">{`${network}`}</span>}
    </div>
  )
}
