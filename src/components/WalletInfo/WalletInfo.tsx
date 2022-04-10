import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { NETWORK } from "../../settings";
import "./WalletInfo.scss";
import TransactionInfo from "../TransactionInfo/TransactionInfo";
import { ScreenSize } from "../../constants/constants";
import Davatar from '@davatar/react';
import { ChainId, shortenIfAddress, useEtherBalance, useEthers, useLookupAddress } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";

export default function WalletInfo() {
  const inTransaction = useSelector((state: RootState) => state.layoutReducer.inTransaction);
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const { account, chainId } = useEthers()
  const ethBalance = formatEther(useEtherBalance(account) ?? 0)
  const ethBalanceString = (+ethBalance).toFixed(4)
  const correctNetwork = NETWORK === chainId
  const ensName = useLookupAddress()

  return (
    <div className="wallet-info-wrapper">
      {screenSize === ScreenSize.Desktop && correctNetwork &&
        <div className="wallet-balance">
          {ethBalance && <span>{ethBalanceString} ETH</span>}
        </div>}
      {inTransaction ? (
        <TransactionInfo />
      ) : (
        screenSize === ScreenSize.Desktop && (
          <div className="wallet-user">
            <div className="davatar">
              <Davatar size={20} address={account!} generatedAvatarType="jazzicon" />
            </div>
            <span>{ensName || shortenIfAddress(account)}</span>
          </div>
        )
      )}
      {screenSize === ScreenSize.Desktop && <span className="network-name">{ChainId[chainId!]}</span>}
    </div>
  )
}
