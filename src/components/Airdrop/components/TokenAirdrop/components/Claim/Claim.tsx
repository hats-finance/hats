import { ChainId } from "@usedapp/core";
import Logo from "assets/icons/logo.icon";
import classNames from "classnames";
import { REWARDS_TOKEN, IDelegateeData } from "components/Airdrop/constants";
import { hashToken } from "components/Airdrop/utils";
import { IPFS_PREFIX } from "constants/constants";
import { useClaimToken } from "hooks/contractHooks";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { CHAINID } from "settings";
import { TokenAirdropET } from "types/types";
import { formatWei } from "utils";
import { Stage, TokenAirdropContext } from "../../TokenAirdrop";
import "./index.scss";

interface IProps {
  delegateeData: IDelegateeData
  address: string
  tokenAmount: number
  eligibleTokens: TokenAirdropET
}

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

export default function Claim({ delegateeData, address, tokenAmount, eligibleTokens }: IProps) {
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const { setStage } = useContext(TokenAirdropContext);
  const [merkleTree, setMerkleTree] = useState();

  useEffect(() => {
    try {
      setMerkleTree(new MerkleTree(Object.entries(eligibleTokens).map(token => hashToken(...token)), keccak256, { sortPairs: true }));
    } catch (error) {
      console.error(error);
    }
  }, [eligibleTokens])
  

  const { send: claimToken, state: claimTokenState } = useClaimToken();
  const claim = async () => {
    const proof = (merkleTree as any).getHexProof(hashToken(address, tokenAmount));
    claimToken(delegateeData.address, tokenAmount, proof, CHAINID === ChainId.Mainnet ? rewardsToken : REWARDS_TOKEN);
  }

  useEffect(() => {
    if (claimTokenState.status === "Success") {
      setStage(Stage.Success);
    }
  }, [claimTokenState.status, setStage])

  return (
    <div className={classNames({ "claim-wrapper": true, "disabled": claimTokenState.status === "Mining" })}>
      <h3>{t("Airdrop.TokenAirdrop.Claim.review")}</h3>
      <div className="claim-review-container">

        <div className="review-amount">
          <span>{t("Airdrop.TokenAirdrop.Claim.claim-amount")}</span>
          <div className="amount-container">
            <Logo /> {formatWei(tokenAmount)} HATS
          </div>
        </div>

        <div className="review-delegatee">
          <span>{t("Airdrop.TokenAirdrop.Claim.chosen-delegatee")}</span>
          <div className="delegatee-info-wrapper">
            {!delegateeData.self && <img src={`${delegateeData.image.replace("ipfs://", `${IPFS_PREFIX}/`)}`} alt="delegatee avatar" />}
            <div className="delegatee-info">
              <div className="delegatee-name">{delegateeData?.self ? "Yourself" : delegateeData.name}</div>
              {!delegateeData.self && (
                <>
                  <div className="delegatee-username-votes">{`${delegateeData.tweeter_username} · ${delegateeData.votes} Votes`}</div>
                  <div className="delegatee-role">{delegateeData.role}</div>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
      <span>{t("Airdrop.TokenAirdrop.Claim.claim-tx-notice")}</span>
      <div className="actions-wrapper">
        <button onClick={() => setStage(Stage.ChooseDelegatee)}>BACK</button>
        <button className="fill" onClick={claim}>CLAIM</button>
      </div>
    </div>
  )
}
