import classNames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, uniswapSafeTransferFrom, uniswapStake, uniswapUnstake, uniswapWithdrawToken } from "../../actions/contractsActions";
import { UNISWAP_V3_APP } from "../../constants/constants";
import { RootState } from "../../reducers";
import { IIncentive, IPosition } from "../../types/types";
import Loading from "../Shared/Loading";
import "./Positions.scss";

interface IProps {
  incentive: IIncentive
  positions: IPosition[]
  setShowModal: Function
}

export default function Positions(props: IProps) {
  const dispatch = useDispatch();
  const { incentive, positions, setShowModal } = props;
  const [selectedPosition, setSelectedPosition] = useState<IPosition>();
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const [pendingWalletAction, setPendingWalletAction] = useState(false);

  const positionsElements = positions.map((position: IPosition) => {
    const positionClassname = selectedPosition?.id === position.id ? "position selected" : "position";
    return (
      <div key={position.id} className={positionClassname} onClick={() => setSelectedPosition(position)}>
        <div className="nft-label">NFT</div>
        {position.tokenId}
        {position.canWithdraw && <span className="withdrawable-label">(withdrawable)</span>}
      </div>
    )
  })

  const stake = async (tokenId: string) => {
    setPendingWalletAction(true);
    await createTransaction(
      selectedPosition?.canWithdraw ?
        async () => uniswapStake(tokenId, incentive) :
        async () => uniswapSafeTransferFrom(selectedAddress, tokenId, incentive),
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
      <span className="sub-title">{positionsElements.length === 0 ? "It seems you do not have any HAT-ETH 1% LP NFTs" : "Your HAT-ETH LP NFTs"}</span>
      <div className="positions-list">{positionsElements}</div>
      {positionsElements.length === 0 ? <span>Uniswap V3 uses NFT tokens to represent LP positions, If you would like to participate in this inventive pool, first go to <a target="_blank" rel="noopener noreferrer" href={UNISWAP_V3_APP}>Uniswap</a> and create a position.</span> : "Select NFT:"}

      <div className="position-actions-wrapper">
        {selectedPosition && <button onClick={async () => { selectedPosition.staked ? await unstake(selectedPosition.tokenId) : await stake(selectedPosition.tokenId) }}>{selectedPosition.staked ? "UNSTAKE" : "STAKE"}</button>}
        {selectedPosition?.canWithdraw && <button className="lp-action-btn withdraw" onClick={async () => await withdraw(selectedPosition.tokenId)}>WITHDRAW TOKEN</button>}
      </div>

      {pendingWalletAction && <Loading />}
    </div>
  )
}
