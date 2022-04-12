import { claimToken, createTransaction } from "actions/contractsActions";
import Logo from "assets/icons/logo.icon";
import classNames from "classnames";
import { REWARDS_TOKEN, IDelegateeData } from "components/Airdrop/constants";
import { hashToken } from "components/Airdrop/utils";
import Loading from "components/Shared/Loading";
import { IPFS_PREFIX, Networks } from "constants/constants";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reducers";
import { NETWORK } from "settings";
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
  const dispatch = useDispatch();
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const { setStage } = useContext(TokenAirdropContext);
  const [pendingWallet, setPendingWallet] = useState(false);
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const [merkleTree, setMerkleTree] = useState();

  useEffect(() => {
    try {
      setMerkleTree(new MerkleTree(Object.entries(eligibleTokens).map(token => hashToken(...token)), keccak256, { sortPairs: true }));
    } catch (error) {
      console.error(error);
    }
  }, [eligibleTokens])

  const claim = async () => {
    const proof = (merkleTree as any).getHexProof(hashToken(address, tokenAmount));
    setPendingWallet(true);

    await createTransaction(
      async () => claimToken(delegateeData.address, tokenAmount, proof, NETWORK === Networks.main ? rewardsToken : REWARDS_TOKEN, chainId),
      () => { },
      () => { setPendingWallet(false); setStage(Stage.Success); },
      () => { setPendingWallet(false); },
      dispatch,
      t("Airdrop.TokenAirdrop.Claim.claim-success")
    );
  }

  return (
    <div className={classNames({ "claim-wrapper": true, "disabled": pendingWallet })}>
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

      {pendingWallet && <Loading />}
    </div>
  )
}
