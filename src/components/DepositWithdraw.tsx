import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWalletBalance, fromWei, getNetworkNameByChainId, isDigitsOnly, isWithdrawSafetyPeriod, numberWithCommas } from "../utils";
import Loading from "./Shared/Loading";
import InfoIcon from "../assets/icons/info.icon";
import "../styles/DepositWithdraw.scss";
import * as contractsActions from "../actions/contractsActions";
import { IPoolWithdrawRequest, IVault } from "../types/types";
import { getBeneficiaryWithdrawRequests, getStakerData } from "../graphql/subgraph";
import { useQuery } from "@apollo/react-hooks";
import { BigNumber } from "@ethersproject/bignumber";
import { RootState } from "../reducers";
import Tooltip from "rc-tooltip";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../constants/constants";
import millify from "millify";
import classNames from "classnames";
import { DATA_POLLING_INTERVAL } from "../settings";
import { toggleInTransaction } from "../actions";
import moment from "moment";
import WithdrawCountdown from "./WithdrawCountdown";

interface IProps {
  data: IVault
  isPool?: boolean
}

type Tab = "deposit" | "withdraw";

interface IWithdrawTimerProps {
  expiryTime: string
}

const WithdrawTimer = (props: IWithdrawTimerProps) => {
  return (
    <div className="withdraw-timer-wrapper">
      <span>WITHDRAWAL AVAILABLE FOR:</span>
      <WithdrawCountdown endDate={props.expiryTime} compactView={true} />
    </div>
  )
}

interface IPendingWithdrawProps {
  withdrawEnableTime: string
  withdrawRequestEnablePeriod: string
  setIsPendingWithdraw: Function
  setIsWithdrawable: Function
}

//{humanizeDuration(withdrawRequestEnablePeriod, { units: ["d", "h", "m"] })}
const PendingWithdraw = (props: IPendingWithdrawProps) => {
  const { withdrawEnableTime, withdrawRequestEnablePeriod, setIsPendingWithdraw, setIsWithdrawable } = props;
  return (
    <div className="pending-withdraw-timer-wrapper">
      <span>
        WITHDRAWAL REQUEST HASE BEEN SENT.<br /><br />
        YOU WILL BE ABLE TO MAKE A WITHDRAWAL FOR ??? PERIOD.<br /><br />
        WITHDRAWAL AVAILABLE WITHIN:
      </span>
      <WithdrawCountdown
        endDate={withdrawEnableTime}
        onEnd={() => {
          setIsPendingWithdraw(false);
          setIsWithdrawable(true);
        }} />
    </div>
  )
}

const checkIfWithdrawable = (withdrawEnableTime: string, expiryTime: string) => {
  const currentTime = moment().unix();
  return (currentTime >= Number(withdrawEnableTime) && currentTime < Number(expiryTime));
}

const checkIfPendingWithdraw = (withdrawEnableTime: string) => {
  const currentTime = moment().unix();
  return currentTime < Number(withdrawEnableTime);
}

export default function DepositWithdraw(props: IProps) {
  const dispatch = useDispatch();
  const { id, pid, master, stakingToken, name, apy, tokenPrice } = props.data;
  const [tab, setTab] = useState<Tab>("deposit");
  const [userInput, setUserInput] = useState("0");
  const [isApproved, setIsApproved] = useState(false);
  const inTransaction = useSelector((state: RootState) => state.layoutReducer.inTransaction);
  const [tokenBalance, setTokenBalance] = useState("0");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const notEnoughBalance = parseInt(userInput) > parseInt(tokenBalance);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const hatsPrice = useSelector((state: RootState) => state.dataReducer.hatsPrice);
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);
  const { loading, error, data } = useQuery(getStakerData(id, selectedAddress), { pollInterval: DATA_POLLING_INTERVAL });
  const { loading: loadingWithdrawRequests, error: errorWithdrawRequests, data: dataWithdrawRequests } = useQuery(getBeneficiaryWithdrawRequests(pid, selectedAddress), { pollInterval: DATA_POLLING_INTERVAL });
  const description = props.isPool ? null : JSON.parse(props.data?.description as any);
  const [withdrawSafetyPeriod, setWithdrawSafetyPeriod] = useState(true);
  const [withdrawRequests, setWithdrawRequests] = useState<IPoolWithdrawRequest>();
  const [isWithdrawable, setIsWithdrawable] = useState(false);
  const [isPendingWithdraw, setIsPendingWithdraw] = useState(false);

  const stakedAmount: BigNumber = useMemo(() => {
    if (!loading && !error && data && data.stakers) {
      return data.stakers[0]?.amount ?? BigNumber.from(0);
    }
    return BigNumber.from(0);
  }, [loading, error, data])

  useEffect(() => {
    if (!loadingWithdrawRequests && !errorWithdrawRequests && dataWithdrawRequests && dataWithdrawRequests.vaults) {
      const withdrawRequest: IPoolWithdrawRequest = dataWithdrawRequests.vaults[0]?.withdrawRequests[0];
      setWithdrawRequests(withdrawRequest);
      setIsWithdrawable(checkIfWithdrawable(withdrawRequest?.withdrawEnableTime, withdrawRequest?.expiryTime));
      setIsPendingWithdraw(checkIfPendingWithdraw(withdrawRequest?.withdrawEnableTime));
    }
  }, [loadingWithdrawRequests, errorWithdrawRequests, dataWithdrawRequests])

  useEffect(() => {
    const checksIsWithdrawSafetyPeriod = async () => {
      setWithdrawSafetyPeriod(await isWithdrawSafetyPeriod(master.withdrawPeriod, master.safetyPeriod));
    }
    checksIsWithdrawSafetyPeriod();
  }, [master.withdrawPeriod, master.safetyPeriod]);

  const canWithdraw = stakedAmount && Number(fromWei(stakedAmount)) >= Number(userInput);

  useEffect(() => {
    const checkIsApproved = async () => {
      setIsApproved(await contractsActions.isApproved(stakingToken, selectedAddress, master.address));
    }
    checkIsApproved();
  }, [stakingToken, selectedAddress, master.address]);

  useEffect(() => {
    const getTokenData = async () => {
      setTokenBalance(await contractsActions.getTokenBalance(stakingToken, selectedAddress));
      setTokenSymbol(await contractsActions.getTokenSymbol(stakingToken));
    }
    getTokenData();
  }, [stakingToken, selectedAddress, inTransaction]);

  const [pendingReward, setPendingReward] = useState(BigNumber.from(0));
  const amountToClaim = millify(Number(fromWei(pendingReward)));

  useEffect(() => {
    const getPendingReward = async () => {
      setPendingReward(await contractsActions.getPendingReward(master.address, pid, selectedAddress));
    }
    getPendingReward();
  }, [master.address, selectedAddress, pid, inTransaction])

  const yearlyEarnings = React.useMemo(() => {
    if (apy && tokenPrice && hatsPrice) {
      return apy * Number(fromWei(stakedAmount)) * tokenPrice;
    }
    return 0;
  }, [apy, tokenPrice, hatsPrice, stakedAmount])

  const approveToken = async () => {
    dispatch(toggleInTransaction(true));
    await contractsActions.createTransaction(
      async () => contractsActions.approveToken(stakingToken, master.address),
      async () => {
        setIsApproved(true);
      },
      () => { }, dispatch, `Spending ${tokenSymbol} approved`);
    dispatch(toggleInTransaction(false));
  }

  const depositAndClaim = async () => {
    dispatch(toggleInTransaction(true));
    await contractsActions.createTransaction(
      async () => contractsActions.depositAndClaim(pid, master.address, userInput),
      async () => {
        setUserInput("0");
        fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
      }, () => { }, dispatch, `Deposited ${userInput} ${tokenSymbol} ${pendingReward.eq(0) ? "" : `and Claimed ${millify(Number(fromWei(pendingReward)))} HATS`}`);
    dispatch(toggleInTransaction(false));
  }

  const withdrawAndClaim = async () => {
    dispatch(toggleInTransaction(true));
    await contractsActions.createTransaction(
      async () => contractsActions.withdrawAndClaim(pid, master.address, userInput),
      async () => {
        setWithdrawRequests(undefined);
        setUserInput("0");
        fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
      }, () => { }, dispatch, `Withdrawn ${userInput} ${tokenSymbol} ${pendingReward.eq(0) ? "" : `and Claimed ${millify(Number(fromWei(pendingReward)))} HATS`}`);
    dispatch(toggleInTransaction(false));
  }

  const withdrawRequest = async () => {
    dispatch(toggleInTransaction(true));
    await contractsActions.createTransaction(
      async () => contractsActions.withdrawRequest(pid, master.address),
      async () => { }, () => { }, dispatch, "Withdrawal Request succeeded");
    dispatch(toggleInTransaction(false));
  }

  const claim = async () => {
    dispatch(toggleInTransaction(true));
    await contractsActions.createTransaction(
      async () => contractsActions.claim(pid, master.address),
      async () => {
        setUserInput("0");
        fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
      }, () => { }, dispatch, `Claimed ${millify(Number(fromWei(pendingReward)))} HATS`);
    dispatch(toggleInTransaction(false));
  }

  const depositWithdrawWrapperClass = classNames({
    "deposit-wrapper": true,
    "disabled": inTransaction
  })

  const amountWrapperClass = classNames({
    "amount-wrapper": true,
    "disabled": !isApproved || (tab === "withdraw" && (!withdrawRequests || isPendingWithdraw || withdrawSafetyPeriod))
  })

  return <div className={depositWithdrawWrapperClass}>
    {props.isPool &&
      <div className="pool-wrapper">
        <div className="pool-title-wrapper">
          <img src={require("../assets/icons/vaults/uniswap.svg").default} alt="uniswap logo" width="40px" />
          <span className="pool-name">{name.split(' ')[0]}</span>
        </div>
        <div>
          <img src={require("../assets/icons/vaults/hats.svg").default} alt="hats logo" width="40px" />
          <img src={require("../assets/icons/vaults/etherum.svg").default} alt="etherum logo" width="40px" />
        </div>
      </div>}
    <div className="tabs-wrapper">
      <button className={tab === "deposit" ? "tab selected" : "tab"} onClick={() => { setTab("deposit"); setUserInput("0"); }}>DEPOSIT</button>
      <button className={tab === "withdraw" ? "tab selected" : "tab"} onClick={() => { setTab("withdraw"); setUserInput("0"); }}>WITHDRAW</button>
    </div>
    {tab === "withdraw" && isPendingWithdraw &&
      <PendingWithdraw
        withdrawEnableTime={withdrawRequests?.withdrawEnableTime || ""}
        setIsPendingWithdraw={setIsPendingWithdraw}
        setIsWithdrawable={setIsWithdrawable}
        withdrawRequestEnablePeriod={master.withdrawRequestEnablePeriod}
      />}
    <div style={{ display: `${isPendingWithdraw && tab === "withdraw" ? "none" : ""}` }}>
      <div className="balance-wrapper">
        <span style={{ color: "white" }}>Amount</span>
        {!tokenBalance ? <div style={{ position: "relative", minWidth: "50px" }}><Loading /></div> : <span>{`${tokenSymbol} Balance: ${millify(Number(tokenBalance))}`}</span>}
      </div>
      <div>
        <div className={amountWrapperClass}>
          <div className="top">
            <span>Pool token</span>
            <span>&#8776; {!tokenPrice ? "-" : `$${millify(tokenPrice)}`}</span>
          </div>
          <div className="input-wrapper">
            <div className="pool-token">{props.isPool ? null : <img width="30px" src={description["Project-metadata"].icon} alt="project logo" />}<span>{name}</span></div>
            <input type="number" value={userInput} onChange={(e) => { isDigitsOnly(e.target.value) && setUserInput(e.target.value) }} min="0" />
          </div>
          {tab === "deposit" && notEnoughBalance && <span className="input-error">Insufficient funds</span>}
          {tab === "withdraw" && !canWithdraw && <span className="input-error">Can't withdraw more than staked</span>}
        </div>
      </div>
      <div className="staked-wrapper">
        <span>You staked</span>
        <div style={{ position: "relative" }}>{loading ? <Loading /> : <span>{numberWithCommas(Number(fromWei(stakedAmount)))}</span>}</div>
      </div>
      <div className="earnings-wrapper">
        <span>Monthly earnings &nbsp;
        <Tooltip
            overlay="Estimated monthly earnings based on total staked amount and rate reward"
            overlayClassName="tooltip"
            overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
            placement="top">
            <span><InfoIcon /></span>
          </Tooltip>
        </span>
        <span>{`${millify(yearlyEarnings / 12)}`} Hats</span>
        <span>&#8776; {`$${millify((yearlyEarnings / 12) * hatsPrice)}`}</span>
      </div>
      <div className="earnings-wrapper">
        <span>Yearly earnings &nbsp;
        <Tooltip
            overlay="Estimated yearly earnings based on total staked amount and rate reward"
            overlayClassName="tooltip"
            overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
            placement="top">
            <span><InfoIcon /></span>
          </Tooltip>
        </span>
        <span>{`${millify(yearlyEarnings)}`} Hats</span>
        <span>&#8776; {`$${millify(yearlyEarnings * hatsPrice)}`}</span>
      </div>
    </div>
    {tab === "withdraw" && isWithdrawable && !isPendingWithdraw && <WithdrawTimer expiryTime={withdrawRequests?.expiryTime || ""} />}
    <div className="action-btn-wrapper">
      {!isApproved && tab === "deposit" &&
        <button
          className="action-btn"
          onClick={async () => await approveToken()}>{`ENABLE SPENDING ${tokenSymbol}`}
        </button>}
      {isApproved && tab === "deposit" &&
        <button
          disabled={notEnoughBalance || !userInput || userInput === "0"}
          className="action-btn"
          onClick={async () => await depositAndClaim()}>{`DEPOSIT ${pendingReward.eq(0) ? "" : `AND CLAIM ${amountToClaim} HATS`}`}
        </button>}
      {tab === "withdraw" && withdrawRequests && isWithdrawable && !isPendingWithdraw &&
        <button
          disabled={!canWithdraw || !userInput || userInput === "0" || withdrawSafetyPeriod}
          className="action-btn"
          onClick={async () => await withdrawAndClaim()}>{`WITHDRAW ${pendingReward.eq(0) ? "" : `AND CLAIM ${amountToClaim} HATS`}`}
        </button>}
      {tab === "withdraw" && withdrawSafetyPeriod && isWithdrawable && !isPendingWithdraw && <span className="safety-period-info">Please wait until withdrawSafetyPeriod finishes</span>}
      {tab === "withdraw" && (!withdrawRequests) &&
        <button
          disabled={!isApproved || !canWithdraw}
          className="action-btn"
          onClick={async () => await withdrawRequest()}>WITHDRAWAL REQUEST</button>}
      <button onClick={async () => await claim()} disabled={!isApproved || pendingReward.eq(0)} className="action-btn claim-btn">{`CLAIM ${amountToClaim} HATS`}</button>
    </div>
    {inTransaction && <Loading />}
  </div>
}
