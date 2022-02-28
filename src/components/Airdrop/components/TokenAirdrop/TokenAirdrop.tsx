import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import Logo from "assets/icons/logo.icon";
import { hashToken } from "components/Airdrop/utils";
import { TokenAirdropET } from "types/types";
import { claimToken, createTransaction } from "actions/contractsActions";
import { RootState } from "reducers";
import "./index.scss";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

interface IProps {
  address: string
  tokenAmount: number
  eligibleTokens: TokenAirdropET
}

export default function TokenAirdrop({ address, tokenAmount, eligibleTokens }: IProps) {
  const dispatch = useDispatch();
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const [merkleTree, setMerkleTree] = useState();

  useEffect(() => {
    (async () => {
      try {
        setMerkleTree(new MerkleTree(Object.entries(eligibleTokens).map(token => hashToken(...token)), keccak256, { sortPairs: true }));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [eligibleTokens])

  const claim = async () => {
    const proof = (merkleTree as any).getHexProof(hashToken(address, tokenAmount));
    //setPendingWalletAction(true);

    /** TODO: the first param should be delegatee(!) not address - this is temporary until choosing the delegatee in the UI will be implemented */
    await createTransaction(
      async () => claimToken(address, tokenAmount, proof, rewardsToken, chainId),
      () => { },
      () => { },
      () => { },
      dispatch,
      t("Airdrop.TokenAirdrop.claim-success")
    );
  }

  return (
    <div className="token-airdrop-wrapper">
      <span>{t("Airdrop.TokenAirdrop.claim-amount")}</span>
      <div className="token-airdrop-wrapper__amount-container">
        <Logo /> {tokenAmount} HATS
      </div>
      <button onClick={claim}>Claim</button>
    </div>
  )
}
