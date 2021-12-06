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

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

export default function NFTAirdrop() {
  const location = useLocation();
  const [userInput, setUserInput] = useState("");
  const [pendingWalletAction, setPendingWalletAction] = useState(false);
  const eligibleTokens = useSelector((state: RootState) => state.dataReducer.airdropEligibleTokens) as EligibleTokens;
  const [isEligible, setIsEligible] = useState(false);
  const notEligible = userInput !== "" && isAddress(userInput) && !isEligible;
  const [merkleTree, setMerkleTree] = useState<any>();

  const handleChange = useCallback((input: string) => {
    setUserInput(input);
    if (isAddress(input)) {
      const normalizedValues = Object.values(eligibleTokens as EligibleTokens).map((value: string) => {
        return normalizeAddress(value);
      })

      if (Object.values(normalizedValues).includes(normalizeAddress(input))) {
        setIsEligible(true);
      } else {
        setIsEligible(false);
      }
    } else {
      setIsEligible(false);
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
      handleChange(normalizeAddress(params.walletAddress) ?? "");
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
        <h2>{isEligible ? "Congrats!" : notEligible ? "Ho no!" : "Hello"}</h2>
        <span>{`Please connect to wallet or enter wallet address to check your eligibility for the NFT airdrop "The crow clan"`}</span>
        <div className={inputContainerClass}>
          <input className="address-input" type="text" value={userInput} placeholder="Enter wallet address" onChange={(e) => handleChange(e.target.value)} />
          <button className="clear-input" onClick={() => handleChange("")}><CloseIcon width="10" height="10" fill={Colors.gray} /></button>
        </div>

        {userInput !== "" && !isAddress(userInput) && <span className="error-label">Please enter a valid address</span>}
        {notEligible && <span>This address is not part of the airdrop. Please check  the eligibility requirements here.</span>}
      </div>
      {isEligible && <Redeem merkleTree={merkleTree} walletAddress={userInput} setPendingWalletAction={setPendingWalletAction} />}
      {pendingWalletAction && <Loading />}
    </div>
  )
}
