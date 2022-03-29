import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { NETWORK } from "../../settings";
import { truncatedAddress } from "../../utils";
import millify from "millify";
import "./WalletInfo.scss";
import TransactionInfo from "../TransactionInfo/TransactionInfo";
import { ScreenSize } from "../../constants/constants";
import useENS from "../../hooks/useENS";
import Davatar from '@davatar/react';

export default function WalletInfo() {
  const inTransaction = useSelector((state: RootState) => state.layoutReducer.inTransaction);
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.selectedAddress) ?? "";
  const { ethBalance, network } = useSelector((state: RootState) => state.web3Reducer);
  const { ensName } = useENS(selectedAddress)

  return (
    <div className="wallet-info-wrapper">
      {screenSize === ScreenSize.Desktop && network === NETWORK &&
        <div className="wallet-balance">
          {ethBalance && <span>{`${millify(ethBalance)} ETH`}</span>}
        </div>}
      {inTransaction ? (
        <TransactionInfo />
      ) : (
        screenSize === ScreenSize.Desktop && (
          <div className="wallet-user">
            <div className="davatar">
              <Davatar size={20} address={selectedAddress} generatedAvatarType="jazzicon" />
            </div>
            <span>{ensName || truncatedAddress(selectedAddress)}</span>
          </div>
        )
      )}
      {screenSize === ScreenSize.Desktop && <span className="network-name">{`${network}`}</span>}
    </div>
  )
}
