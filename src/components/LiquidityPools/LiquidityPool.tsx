import { useQuery } from "@apollo/client";
import { BigNumber } from "@ethersproject/bignumber";
import classNames from "classnames";
import moment from "moment";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, uniswapClaimReward, uniswapRewards } from "../../actions/contractsActions";
import { LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT } from "../../constants/constants";
import { getPositions } from "../../graphql/subgraph";
import { RootState } from "../../reducers";
import { DATA_POLLING_INTERVAL } from "../../settings";
import "../../styles/LiquidityPools.scss";
import { IIncentive, IPosition } from "../../types/types";
import { fetchWalletBalance, formatWei, getNetworkNameByChainId, isProviderAndNetwork } from "../../utils";
import Loading from "../Shared/Loading";
import Modal from "../Shared/Modal";
import Positions from "./Positions";

interface IProps {
  incentive: IIncentive
}

export default function LiquidityPool(props: IProps) {
  const dispatch = useDispatch();
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const { incentive } = props;
  const [showModal, setShowModal] = useState(false);
  const startTime = moment.unix(Number(incentive?.startTime)).local().format('DD-MM-YYYY HH:mm');
  const endTime = moment.unix(Number(incentive?.endTime)).local().format('DD-MM-YYYY HH:mm');
  const [pendingWalletAction, setPendingWalletAction] = useState(false);
  const [accruedRewards, setAccruedRewards] = useState(BigNumber.from(0));
  const { loading, error, data } = useQuery(getPositions(selectedAddress), { pollInterval: DATA_POLLING_INTERVAL, context: { clientName: LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT } });
  const [positions, setPositions] = useState<IPosition[]>([]);
  const [numberOfStakes, setNumberOfStakes] = useState("-");

  useEffect(() => {
    if (!loading && !error && data && data.positions) {
      setPositions(data.positions);
      setNumberOfStakes(data.positions.filter((position: IPosition) => position.staked).length);
    }
  }, [loading, error, data])

  const claim = async () => {
    setPendingWalletAction(true);
    await createTransaction(
      async () => uniswapClaimReward(incentive.rewardToken, selectedAddress),
      () => { },
      async () => {
        setPendingWalletAction(false);
        fetchWalletBalance(dispatch, getNetworkNameByChainId(chainId), selectedAddress, rewardsToken);
        setAccruedRewards(await uniswapRewards(incentive?.rewardToken, selectedAddress));
      },
      () => { setPendingWalletAction(false); },
      dispatch,
      "Claim Success!"
    )
  }

  useEffect(() => {
    (async () => {
      if (selectedAddress && incentive) {
        setAccruedRewards(await uniswapRewards(incentive?.rewardToken, selectedAddress));
      }
    })();
  }, [incentive, selectedAddress])

  const lpWrapperClass = classNames({
    "lp-wrapper": true,
    "disabled": pendingWalletAction
  })

  return (
    <div className={lpWrapperClass}>
      <div className="lp-top">
        <div className="lp-title">Uniswap V3 HAT-ETH</div>
        <div className="lp-active">{`Active ${startTime} to ${endTime}`}</div>
      </div>
      <div className="lp-incentive">
        <div className="sub-title">Pool Incentive:</div>
        <div className="data-container">
          <div className="data-element">
            <span className="element-value">{`${formatWei(incentive?.reward, 4)} HAT`}</span>
            <span>Total Rewared</span>
          </div>
          <div className="data-element">
            <span className="element-value">{`${formatWei(incentive?.totalRewardUnclaimed, 4)} HAT`}</span>
            <span>Total Available</span>
          </div>
        </div>
      </div>
      <div className="your-incentive">
        <div className="sub-title">Your Incentive:</div>
        <div className="data-container">
          <div className="data-element">
            <span className="element-value">{numberOfStakes}</span>
            <span>Staked Uniswap V3 NFTs</span>
          </div>
          <div className="data-element">
            <span className="element-value">??? HAT</span>
            <span>Pending Rewards</span>
          </div>
          <div className="data-element">
            <span className="element-value">{`${formatWei(accruedRewards, 4)} HAT`}</span>
            <span>Accrued Rewards</span>
          </div>
        </div>
      </div>
      <div className="lp-actions">
        <button className="lp-action-btn stake" onClick={() => setShowModal(true)} disabled={!isProviderAndNetwork(provider) || loading}>STAKE / UNSTAKE / WITHDRAW LP TOKENS</button>
        <button className="lp-action-btn claim" onClick={async () => await claim()} disabled={!isProviderAndNetwork(provider) || accruedRewards.eq(0)}>CLAIM ACCRUED REWARDS</button>
      </div>

      {pendingWalletAction && <Loading />}

      {showModal && (
        <Modal title="Uniswap v3 HAT-ETH" setShowModal={setShowModal} height="fit-content">
          <Positions incentive={incentive} positions={positions} setShowModal={setShowModal} />
        </Modal>
      )}
    </div>
  )
}
