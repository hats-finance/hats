import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { NETWORK } from "../../settings";
import { getNetworkNameByChainId, linkToEtherscan, truncatedAddress } from "../../utils";
import millify from "millify";
import "./WalletInfo.scss";

export default function WalletInfo() {
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);
  const inTransaction = useSelector((state: RootState) => state.layoutReducer.inTransaction);
  const transactionHash = useSelector((state: RootState) => state.layoutReducer.transactionHash);
  const { ethBalance, hatsBalance } = useSelector((state: RootState) => state.web3Reducer);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";

  return (
    <div className="wallet-info-wrapper">
      {network === NETWORK &&
        <div className="wallet-balance">
          {ethBalance && <span className="eth-balance">{`${millify(ethBalance)} ETH`}</span>}
          {hatsBalance && <span>{`${millify(hatsBalance)} HATS`}</span>}
        </div>}
      {inTransaction ? <div onClick={() => window.open(linkToEtherscan(transactionHash, NETWORK, true))} className="pending-transaction">Pending Transaction</div> : <span>{truncatedAddress(selectedAddress)}</span>}
      <span className="network-name">{`${network}`}</span>
    </div>
  )
}
