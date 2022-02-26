import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { t } from "i18next";
import Logo from "assets/icons/logo.icon";
import { hashToken } from "components/Airdrop/utils";
import { TokenAirdropET } from "types/types";
import { claimToken, createTransaction } from "actions/contractsActions";
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
    await createTransaction(
      async () => claimToken(address, tokenAmount, proof),
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
    </div>
  )
}
