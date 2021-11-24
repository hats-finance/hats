import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Colors, IPFS_PREFIX } from "../../constants/constants";
import { RootState } from "../../reducers";
import "./NFTAirdrop.scss";
import { isAddress } from "ethers/lib/utils";
import Loading from "../Shared/Loading";
import classNames from "classnames";
import CloseIcon from "../../assets/icons/close.icon";
import Redeem from "./Redeem";

const IPFS_ELIGIBLE_TOKENS = "QmeSeXF3k1sA2UNCNSXesVdFpzg3UfcAiV5N4ymMbSZurD";

export default function NFTAirdrop() {
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [eligibleTokens, setEligibleTokens] = useState<String[]>([]);
  const [isEligible, setIsEligible] = useState(false);
  const notEligible = userInput !== "" && isAddress(userInput) && !isEligible;


  const handleChange = (input: string) => {
    setUserInput(input);
    if (isAddress(input)) {
      if (eligibleTokens.includes(input)) {
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
        const tokens = await axios.get(`${IPFS_PREFIX}${IPFS_ELIGIBLE_TOKENS}`);
        setEligibleTokens(Object.values(tokens.data));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // TODO: show error
      }
    })();
  }, [])


  const addressInputClass = classNames({
    "address-input": true,
    "inputError": userInput !== "" && !isAddress(userInput)
  })

  return (
    <div className="content nft-airdrop-wrapper">
      {loading && <Loading />}

      <div className="nft-airdrop-search">
        <h2>{isEligible ? "Congrats!" : notEligible ? "Ho no!" : "Hello"}</h2>
        <span>{`Please connect to wallet or enter wallet address to check your eligibility for the NFT airdrop "The crow clan"`}</span>
        <div className="input-container">
          <input className={addressInputClass} type="text" value={userInput} placeholder="Enter wallet address" onChange={(e) => handleChange(e.target.value)} />
          <button className="clear-input" onClick={() => handleChange("")}><CloseIcon width="10" height="10" fill={Colors.gray} /></button>
        </div>

        {userInput !== "" && !isAddress(userInput) && <span className="error-label">Please enter a valid address</span>}
        {notEligible && <span>This address is not part of the airdrop. Please check  the eligibility requirements here.</span>}
      </div>
      {isEligible && <Redeem />}
    </div>
  )
}
