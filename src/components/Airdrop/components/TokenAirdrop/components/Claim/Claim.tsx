import { claimToken, createTransaction } from "actions/contractsActions";
import { hashToken } from "components/Airdrop/utils";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reducers";
import { TokenAirdropET } from "types/types";

interface IProps {
  address: string
  tokenAmount: number
  eligibleTokens: TokenAirdropET
}

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

export default function Claim({ address, tokenAmount, eligibleTokens }: IProps) {
  const dispatch = useDispatch();
  //const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
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
    //setPendingWalletAction(true);

    /** 
     * TODO: the first param should be delegatee(!) not address - this is temporary until choosing the delegatee in the UI will be implemented
     * TODO: 0x8C75dB6367e6eE1980d1999598bd38cbfD690A2A is temporary until we fetch it from the subgraph
     */
    await createTransaction(
      async () => claimToken(address, tokenAmount, proof, "0x8C75dB6367e6eE1980d1999598bd38cbfD690A2A", chainId),
      () => { },
      () => { },
      () => { },
      dispatch,
      t("Airdrop.TokenAirdrop.claim-success")
    );
  }

  return (
    <div className="claim-wrapper">
      Claim
    </div>
  )
}
