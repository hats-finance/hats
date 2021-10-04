import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, uniswapStake, uniswapUnstake, uniswapWithdrawToken } from "../../actions/contractsActions";
import { LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT, UNISWAP_V3_APP } from "../../constants/constants";
import { getPositions } from "../../graphql/subgraph";
import { RootState } from "../../reducers";
import { DATA_POLLING_INTERVAL } from "../../settings";
import { IIncentive, IPosition } from "../../types/types";
import Loading from "../Shared/Loading";
import "./Positions.scss";

interface IProps {
  incentive: IIncentive
  setShowModal: Function
}

export default function Positions(props: IProps) {
  const dispatch = useDispatch();
  const { incentive, setShowModal } = props;
  const [selectedPosition, setSelectedPosition] = useState<IPosition>();
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  let { loading, error, data } = useQuery(getPositions(selectedAddress), { pollInterval: DATA_POLLING_INTERVAL, context: { clientName: LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT } });
  const [pendingWalletAction, setPendingWalletAction] = useState(false);

  let positions = [];

  if (!loading && !error && data && data.positions) {
    console.log(data);
    positions = data.positions.map((position: IPosition) => {
      const positionClassname = selectedPosition?.id === position.id ? "position selected" : "position";
      return (
        <div key={position.id} className={positionClassname} onClick={() => setSelectedPosition(position)}>
          <div className="nft-label">NFT</div>
          {position.tokenId}
          {position.canWithdraw && <span className="withdrawable-label">(withdrawable)</span>}
        </div>
      )
    })
  }

  const stake = async (tokenId: string) => {
    setPendingWalletAction(true);
    await createTransaction(
      async () => uniswapStake(selectedAddress, tokenId, incentive),
      () => { setShowModal(false); },
      () => { setPendingWalletAction(false); },
      () => { setPendingWalletAction(false); },
      dispatch,
      "Staking Success!"
    )
  }

  const unstake = async (tokenId: string) => {
    setPendingWalletAction(true);
    await createTransaction(
      async () => uniswapUnstake(tokenId, incentive),
      () => { setShowModal(false); },
      () => { setPendingWalletAction(false); },
      () => { setPendingWalletAction(false); },
      dispatch,
      "Unstaking Success!"
    )
  }

  const withdraw = async (tokenId: string) => {
    setPendingWalletAction(true);
    await createTransaction(
      async () => uniswapWithdrawToken(tokenId, selectedAddress),
      () => { setShowModal(false); },
      () => { setPendingWalletAction(false); },
      () => { setPendingWalletAction(false); },
      dispatch,
      "Withdraw Token Success!"
    )
  }

  const positionsWrapperClass = classNames({
    "positions-wrapper": true,
    "disabled": pendingWalletAction
  })

  return (
    <div className={positionsWrapperClass}>
      <div>Uniswap V3 uses NFT tokens to represent LP positions. Your Uniswap V3 LP tokens eligible for Hats rewards are listed below.</div>

      {loading ? <span className="loading">loading...</span> : (
        <>
          <span className="sub-title">{positions.length === 0 ? "You do not have any HAT-ETH LP NFTs." : "Your HAT-ETH LP NFTs"}</span>
          <div className="positions-list">{positions}</div>
          {positions.length === 0 ? <span>Go to <a target="_blank" rel="noopener noreferrer" href={UNISWAP_V3_APP}>Uniswap</a> to create a position.</span> : "Select NFT to stake"}
        </>
      )}

      <div className="position-actions-wrapper">
        {selectedPosition && <button onClick={async () => { selectedPosition.staked ? await unstake(selectedPosition.tokenId) : await stake(selectedPosition.tokenId) }}>{selectedPosition.staked ? "UNSTAKE" : "STAKE"}</button>}
        {selectedPosition?.canWithdraw && <button className="lp-action-btn withdraw" onClick={async () => await withdraw(selectedPosition.tokenId)}>WITHDRAW TOKEN</button>}
      </div>

      {pendingWalletAction && <Loading />}
    </div>
  )
}
