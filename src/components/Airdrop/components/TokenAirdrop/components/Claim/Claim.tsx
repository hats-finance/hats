import { claimToken, createTransaction } from "actions/contractsActions";
import Logo from "assets/icons/logo.icon";
import classNames from "classnames";
import { hashToken } from "components/Airdrop/utils";
import Loading from "components/Shared/Loading";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reducers";
import { TokenAirdropET } from "types/types";
import { truncatedAddress } from "utils";
import { Stage, TokenAirdropContext } from "../../TokenAirdrop";
import "./index.scss";

interface IProps {
  delegatee: string
  address: string
  tokenAmount: number
  eligibleTokens: TokenAirdropET
}

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

export default function Claim({ delegatee, address, tokenAmount, eligibleTokens }: IProps) {
  const dispatch = useDispatch();
  const { setStage } = useContext(TokenAirdropContext);
  const [pendingWallet, setPendingWallet] = useState(false);
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
    setPendingWallet(true);

    /** 
     * TODO: 0x8C75dB6367e6eE1980d1999598bd38cbfD690A2A is temporary until we fetch it from the subgraph
     */
    await createTransaction(
      async () => claimToken(delegatee, tokenAmount, proof, "0x8C75dB6367e6eE1980d1999598bd38cbfD690A2A", chainId),
      () => { },
      () => { setPendingWallet(false); }, // TODO: change to success stage
      () => { setPendingWallet(false); },
      dispatch,
      t("Airdrop.TokenAirdrop.Claim.claim-success")
    );
  }

  return (
    <div className={classNames({ "claim-wrapper": true, "disabled": pendingWallet })}>
      <span>You chose {truncatedAddress(delegatee)} as your delegatee</span>
      <div className="amount-container">
        <Logo /> {tokenAmount} HATS
      </div>
      <div className="actions-wrapper">
        <button onClick={() => setStage(Stage.ChooseDelegatee)}>BACK</button>
        <button className="fill" onClick={claim}>CLAIM</button>
      </div>

      {pendingWallet && <Loading />}
    </div>
  )
}
