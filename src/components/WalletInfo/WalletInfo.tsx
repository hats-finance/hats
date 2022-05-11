import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { CHAINID } from "../../settings";
import TransactionInfo from "../TransactionInfo/TransactionInfo";
import { ScreenSize } from "../../constants/constants";
import Davatar from '@davatar/react';
import { ChainId, shortenIfAddress, useEtherBalance, useEthers, useLookupAddress, useTokenBalance } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import "./WalletInfo.scss";

export default function WalletInfo() {
  const inTransaction = useSelector((state: RootState) => state.layoutReducer.inTransaction);
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const { account, chainId } = useEthers();
  const ethBalance = formatEther(useEtherBalance(account) ?? 0);
  const ethBalanceString = (+ethBalance).toFixed(4);
  const correctNetwork = CHAINID === chainId;
  const ensName = useLookupAddress();
  const hatsBalance = formatEther(useTokenBalance(rewardsToken, account) ?? 0);
  const hatsBalanceString = (+hatsBalance).toFixed(4);

  return (
    <div className="wallet-info-wrapper">
      {screenSize === ScreenSize.Desktop && correctNetwork &&
        <div className="wallet-balance">
          {hatsBalance && <span>{hatsBalanceString} HATS&nbsp;|&nbsp;</span>}
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
