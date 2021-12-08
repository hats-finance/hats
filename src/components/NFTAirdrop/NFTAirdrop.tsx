import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Colors } from "../../constants/constants";
import { RootState } from "../../reducers";
import "./NFTAirdrop.scss";
import { isAddress } from "ethers/lib/utils";
import classNames from "classnames";
import CloseIcon from "../../assets/icons/close.icon";
import Redeem from "./Redeem";
import { EligibleTokens } from "../../types/types";
import { hashToken, normalizeAddress } from "../../utils";
import { useLocation } from "react-router-dom";
import Loading from "../Shared/Loading";
import { isRedeemed } from "../../actions/contractsActions";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

enum EligibilityStatus {
  ELIGIBLE = 0,
  NOT_ELIGIBLE = 1,
  REDEEMED = 2,
  PENDING = 3
}

export default function NFTAirdrop() {
  const location = useLocation();
  const [userInput, setUserInput] = useState("");
  const [pendingWalletAction, setPendingWalletAction] = useState(false);
  const eligibleTokens = useSelector((state: RootState) => state.dataReducer.airdropEligibleTokens) as EligibleTokens;
  const [eligibilityStatus, setEligibilityStatus] = useState<EligibilityStatus>(EligibilityStatus.PENDING);
  const [merkleTree, setMerkleTree] = useState<any>();

  const handleChange = useCallback(async (input: string) => {
    setUserInput(input);
    if (isAddress(input)) {
      if (Object.values(eligibleTokens).includes(normalizeAddress(input))) {
        const ipfsLink = Object.keys(eligibleTokens).find(key => eligibleTokens[key] === input);
        if (await isRedeemed(ipfsLink ?? "", input)) {
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
        <h2>{eligibilityStatus === EligibilityStatus.ELIGIBLE ? "Congrats!" : eligibilityStatus === EligibilityStatus.NOT_ELIGIBLE ? "Ho no!" : "Hello"}</h2>
        <span>{`Please connect to wallet or enter wallet address to check your eligibility for the NFT airdrop "The crow clan"`}</span>
        <div className={inputContainerClass}>
          <input className="address-input" type="text" value={userInput} placeholder="Enter wallet address" onChange={(e) => handleChange(e.target.value)} />
          <button className="clear-input" onClick={() => handleChange("")}><CloseIcon width="10" height="10" fill={Colors.gray} /></button>
        </div>

        {userInput !== "" && !isAddress(userInput) && <span className="error-label">Please enter a valid address</span>}
        {eligibilityStatus === EligibilityStatus.NOT_ELIGIBLE && <div className="info-label">This address is not part of the airdrop. Please check  the eligibility requirements here.</div>}
        {eligibilityStatus === EligibilityStatus.ELIGIBLE  && <div className="info-label">You are part of the hats first airdrop “The crow clan”. Reedeem your NFT and join the clan.</div>}
        {eligibilityStatus === EligibilityStatus.REDEEMED  && <span>Already Redeemed!</span>}
      </div>
      {eligibilityStatus === EligibilityStatus.ELIGIBLE  && <Redeem merkleTree={merkleTree} walletAddress={userInput} setPendingWalletAction={setPendingWalletAction} />}
      {pendingWalletAction && <Loading />}
    </div>
  )
}
