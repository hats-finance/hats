import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, getDeadline, getBaseURI, nftAirdropRedeem } from "../../actions/contractsActions";
import { IPFS_PREFIX, LocalStorage } from "../../constants/constants";
import { RootState } from "../../reducers";
import { EligibleTokens, IAirdropElement } from "../../types/types";
import { hashToken, isDateBefore, isProviderAndNetwork } from "../../utils";
import Countdown from "../Shared/Countdown/Countdown";
import { EligibilityStatus } from "./NFTAirdrop";
import QuestionIcon from "../../assets/icons/big-question-icon.svg";
import Image from "../Shared/Image/Image";
import "./Redeem.scss";

interface IProps {
  merkleTree: any
  walletAddress: string
  setPendingWalletAction: Function
  onSuccess: Function
  eligibilityStatus: EligibilityStatus
  reveal: boolean
}

const removeAddressFromLocalStorage = (address: string) => {
  const savedItems = JSON.parse(localStorage.getItem(LocalStorage.NFTAirdrop) ?? "[]");
  const addressIndex = savedItems.indexOf(address);
  if (addressIndex > -1) {
    savedItems.splice(addressIndex, 1);
  }
  localStorage.setItem(LocalStorage.NFTAirdrop, JSON.stringify(savedItems));
}

export default function Redeem({ merkleTree, walletAddress, setPendingWalletAction, onSuccess, eligibilityStatus, reveal }: IProps) {
  const dispatch = useDispatch();
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);
  const [revealed, setRevealed] = useState((eligibilityStatus === EligibilityStatus.REDEEMED || reveal) ? true : false);
  const [nftData, setNftData] = useState<IAirdropElement>();
  const eligibleTokens = useSelector((state: RootState) => state.dataReducer.airdropEligibleTokens) as EligibleTokens;
  const nftIndex = Object.keys(eligibleTokens).find(key => eligibleTokens[key] === walletAddress);
  const [deadline, setDeadline] = useState<string>();
  const [redeemable, setRedeemable] = useState(false);

  useEffect(() => {
    (async () => {
      const deadline = await getDeadline();
      setDeadline(deadline);
      setRedeemable(isDateBefore(deadline));
    })();
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const tokenBaseURI = await getBaseURI();
        const data = await axios.get(`${IPFS_PREFIX}${tokenBaseURI.substring(7)}${nftIndex}`);
        setNftData(data.data);
      } catch (error) {
        console.error(error);
        // TODO: show error
      }
    })();
  }, [nftIndex])

  const redeem = async () => {
    const proof = merkleTree.getHexProof(hashToken(nftIndex ?? "", walletAddress));
    setPendingWalletAction(true);
    await createTransaction(
      async () => nftAirdropRedeem(walletAddress, nftIndex ?? "", proof),
      () => { },
      () => { removeAddressFromLocalStorage(walletAddress); setPendingWalletAction(false); onSuccess(); },
      () => { setPendingWalletAction(false); },
      dispatch,
      "NFT Airdrop redeemed successfully"
    );
  }

  return (
    <div className="redeem-wrapper">
      <div className="nft-image-container">
        {!revealed ? (
          <img
            className="question-mark"
            src={QuestionIcon} width="200px"
            height="200px"
            alt="question mark" />
        ) : (
          <Image
            source={`${IPFS_PREFIX}${nftData?.image.substring(7)}`}
            alt="nft"
            className="nft-image" />
        )}
      </div>
      {revealed && deadline && eligibilityStatus !== EligibilityStatus.REDEEMED && (
        <div className="redeem-wrapper__countdown-container">
          {redeemable ? <span className="redeem-text">Redeem is available for:</span> : <span className="redeem-passed-text">Redeem period has passed</span>}
          {redeemable && <Countdown endDate={deadline} compactView />}
        </div>
      )}
      {eligibilityStatus !== EligibilityStatus.REDEEMED && (
        <>
          {revealed && <button disabled={!isProviderAndNetwork(provider) || !redeemable} className="action-btn redeem-btn" onClick={redeem}>REDEEM</button>}
          {!revealed && <button className="action-btn reveal-btn" onClick={() => setRevealed(true)}>REVEAL</button>}
        </>
      )}
    </div>
  )
}
