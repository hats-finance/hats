import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Colors } from "../../constants/constants";
import { RootState } from "../../reducers";
import "./NFTAirdrop.scss";
import { isAddress } from "ethers/lib/utils";
import Loading from "../Shared/Loading";
import classNames from "classnames";
import CloseIcon from "../../assets/icons/close.icon";
import Redeem from "./Redeem";
import { ethers } from "ethers";
import { EligibleTokens } from "../../types/types";
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const hashToken = (tokenId: string, account: string) => {
  return Buffer.from(ethers.utils.solidityKeccak256(['string', 'address'], [tokenId, account]).slice(2), 'hex');
}

export default function NFTAirdrop() {
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const eligibleTokens = useSelector((state: RootState) => state.dataReducer.airdropEligibleTokens) as EligibleTokens;
  const [isEligible, setIsEligible] = useState(false);
  const notEligible = userInput !== "" && isAddress(userInput) && !isEligible;
  const [merkleTree, setMerkleTree] = useState<any>();

  const handleChange = (input: string) => {
    setUserInput(input);
    if (isAddress(input)) {
      if (Object.values(eligibleTokens).includes(input)) {
        setIsEligible(true);
      } else {
        setIsEligible(false);
      }
    } else {
      setIsEligible(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        setMerkleTree(new MerkleTree(Object.entries(eligibleTokens).map(token => hashToken(...token)), keccak256, { sortPairs: true }));
      } catch (error) {
        // TODO: show error
      }
    })();
  }, [eligibleTokens])

  useEffect(() => {
    if (merkleTree && isEligible) {
      const key = Object.keys(eligibleTokens).find(key => eligibleTokens[key] === userInput);
      const proof = merkleTree.getHexProof(hashToken(key ?? "", userInput));
      console.log(proof);
      // TODO: need new ABI for the redeem function.
      // await expect(this.registry.redeem(account, tokenId, proof))
    }
  }, [merkleTree, isEligible, eligibleTokens, userInput])


  const inputContainerClass = classNames({
    "input-container": true,
    "inputError": userInput !== "" && !isAddress(userInput)
  })

  return (
    <div className="content nft-airdrop-wrapper">
      {loading && <Loading />}

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
      {isEligible && <Redeem />}
    </div>
  )
}
