import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Colors, NFT_AIRDROP_ADDRESS } from "../../constants/constants";
import { RootState } from "../../reducers";
import "./NFTAirdrop.scss";
import { isAddress } from "ethers/lib/utils";
import classNames from "classnames";
import CloseIcon from "../../assets/icons/close.icon";
import Redeem from "./Redeem";
import { EligibleTokens } from "../../types/types";
import { hashToken, linkToTokenEtherscan, normalizeAddress } from "../../utils";
import { useLocation } from "react-router-dom";
import Loading from "../Shared/Loading";
import { getDeadline, isRedeemed } from "../../actions/contractsActions";
import OpenInIcon from "../../assets/icons/openIn.icon";
import moment from "moment";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

export enum EligibilityStatus {
  ELIGIBLE,
  NOT_ELIGIBLE,
  REDEEMED,
  PENDING
}

export default function NFTAirdrop() {
  const location = useLocation();
  const [userInput, setUserInput] = useState("");
  const [pendingWalletAction, setPendingWalletAction] = useState(false);
  const eligibleTokens = useSelector((state: RootState) => state.dataReducer.airdropEligibleTokens) as EligibleTokens;
  const [eligibilityStatus, setEligibilityStatus] = useState<EligibilityStatus>(EligibilityStatus.PENDING);
  const [merkleTree, setMerkleTree] = useState<any>();
  const [currentTokenID, setCurrentTokenID] = useState("");
  const [reveal, setReveal] = useState(false);
  const [deadline, setDeadline] = useState<number>();

  useEffect(() => {
    (async () => {
      setDeadline(await getDeadline())
    })();
  }, [])

  const handleChange = useCallback(async (input: string) => {
    setUserInput(input);
    if (isAddress(input)) {
      if (Object.values(eligibleTokens).includes(normalizeAddress(input))) {
        const tokenID = Object.keys(eligibleTokens).find(key => eligibleTokens[key] === input);
        setCurrentTokenID(tokenID ?? "");
        if (await isRedeemed(tokenID ?? "", input)) {
          setEligibilityStatus(EligibilityStatus.REDEEMED);
        } else {
          setEligibilityStatus(EligibilityStatus.ELIGIBLE);
        }
      } else {
        setEligibilityStatus(EligibilityStatus.NOT_ELIGIBLE);
      }
    } else {
      setEligibilityStatus(EligibilityStatus.PENDING);
    }
  }, [eligibleTokens]);

  useEffect(() => {
    (async () => {
      try {
        setMerkleTree(new MerkleTree(Object.entries(eligibleTokens).map(token => hashToken(...token)), keccak256, { sortPairs: true }));
      } catch (error) {
        console.error(error);
        // TODO: show error
      }
    })();
  }, [eligibleTokens])

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.walletAddress) {
      handleChange(params.walletAddress ?? "");
      setReveal(true);
    }
  }, [location.search, handleChange])


  const inputContainerClass = classNames({
    "input-container": true,
    "inputError": userInput !== "" && !isAddress(userInput)
  })

  const nftAirdropWrapperClass = classNames({
    "content": true,
    "nft-airdrop-wrapper": true,
    "disabled": pendingWalletAction
  })

  return (
    <div className={nftAirdropWrapperClass}>
      <div className="nft-airdrop-search">
        {deadline && <div className="deadline-label">Minting deadline: {moment.unix(deadline).local().format('DD-MM-YYYY HH:mm')}</div>}
        <h2>{eligibilityStatus === EligibilityStatus.ELIGIBLE ? "Congrats!" : eligibilityStatus === EligibilityStatus.NOT_ELIGIBLE ? "Ho no!" : "Hello"}</h2>
        <span>{`Please connect to wallet or enter wallet address to check your eligibility for the NFT airdrop "The crow clan"`}</span>
        <div className={inputContainerClass}>
          <input className="address-input" type="text" value={userInput} placeholder="Enter wallet address" onChange={(e) => handleChange(e.target.value)} />
          <button className="clear-input" onClick={() => handleChange("")}><CloseIcon width="10" height="10" fill={Colors.gray} /></button>
        </div>

        {userInput !== "" && !isAddress(userInput) && <span className="error-label">Please enter a valid address</span>}
        {eligibilityStatus === EligibilityStatus.NOT_ELIGIBLE && <div className="info-label">This address is not part of the airdrop. Please check  the eligibility requirements here.</div>}
        {eligibilityStatus === EligibilityStatus.ELIGIBLE && <div className="info-label">You are part of the hats first airdrop “The crow clan”. Reedeem your NFT and join the clan.</div>}
        {eligibilityStatus === EligibilityStatus.REDEEMED && (
          <span className="open-in-etherscan-wrapper">
            <span>Redeemed - View on Etherscan</span>
            <span className="open-in-icon" onClick={() => window.open(linkToTokenEtherscan(NFT_AIRDROP_ADDRESS, currentTokenID))}>
              <OpenInIcon />
            </span>
          </span>
        )}
      </div>
      {(eligibilityStatus === EligibilityStatus.ELIGIBLE || eligibilityStatus === EligibilityStatus.REDEEMED) && (
        <Redeem
          merkleTree={merkleTree}
          walletAddress={userInput}
          setPendingWalletAction={setPendingWalletAction}
          onSuccess={() => setEligibilityStatus(EligibilityStatus.REDEEMED)}
          eligibilityStatus={eligibilityStatus}
          reveal={reveal} />
      )}
      {pendingWalletAction && <Loading />}
    </div>
  )
}
