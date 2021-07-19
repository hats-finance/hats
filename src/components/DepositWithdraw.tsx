import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateActualWithdrawValue, calculateAmountAvailableToWithdraw, fetchWalletBalance, fromWei, getNetworkNameByChainId, isDigitsOnly } from "../utils";
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
import { Colors, RoutePaths, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../constants/constants";
import millify from "millify";
import classNames from "classnames";
import { DATA_POLLING_INTERVAL } from "../settings";
import { toggleInTransaction } from "../actions";
import moment from "moment";
import WithdrawCountdown from "./WithdrawCountdown";
import humanizeDuration from "humanize-duration";

interface IProps {
  data: IVault
  setShowModal?: Function
  isPool?: boolean
}

type Tab = "deposit" | "withdraw";

interface IWithdrawTimerProps {
  expiryTime: string
  setIsWithdrawable: Function
}

const WithdrawTimer = (props: IWithdrawTimerProps) => {
  return (
    <div className="withdraw-timer-wrapper">
      <span>WITHDRAWAL AVAILABLE FOR:</span>
      <WithdrawCountdown
        endDate={props.expiryTime}
        compactView={true}
        onEnd={() => {
          props.setIsWithdrawable(false);
        }} />
    </div>
  )
}

interface IPendingWithdrawProps {
  withdrawEnableTime: string
  createdAt: string
  expiryTime: string
  setIsPendingWithdraw: Function
  setIsWithdrawable: Function
}

const PendingWithdraw = (props: IPendingWithdrawProps) => {
  const { withdrawEnableTime, createdAt, expiryTime, setIsPendingWithdraw, setIsWithdrawable } = props;
  const diff = moment.unix(Number(expiryTime)).diff(moment.unix(Number(createdAt)), "milliseconds");
  return (
    <div className="pending-withdraw-timer-wrapper">
      <span>
        WITHDRAWAL REQUEST HASE BEEN SENT.<br /><br />
        YOU WILL BE ABLE TO MAKE A WITHDRAWAL FOR <span>{humanizeDuration(Number(diff), { units: ["d", "h", "m"] })} PERIOD</span><br /><br />
        WITHDRAWAL AVAILABLE WITHIN:
      </span>
      <WithdrawCountdown
        endDate={withdrawEnableTime}
        onEnd={() => {
          setIsPendingWithdraw(false);
          setIsWithdrawable(true);
        }}
        textColor={Colors.yellow} />
    </div>
  )
}

export default function DepositWithdraw(props: IProps) {
  const dispatch = useDispatch();
  const { id, pid, master, stakingToken, name, tokenPrice, apy, stakingTokenDecimals, honeyPotBalance, totalUsersShares } = props.data;
  const [tab, setTab] = useState<Tab>("deposit");
  const [userInput, setUserInput] = useState("0");
  const [isApproved, setIsApproved] = useState(false);
  const inTransaction = useSelector((state: RootState) => state.layoutReducer.inTransaction);
  const [pendingWalletAction, setPendingWalletAction] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("0");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const notEnoughBalance = parseInt(userInput) > parseInt(tokenBalance);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);
  const { loading, error, data } = useQuery(getStakerData(id, selectedAddress), { pollInterval: DATA_POLLING_INTERVAL });
  const { loading: loadingWithdrawRequests, error: errorWithdrawRequests, data: dataWithdrawRequests } = useQuery(getBeneficiaryWithdrawRequests(pid, selectedAddress), { pollInterval: DATA_POLLING_INTERVAL });
  const description = props.isPool ? null : JSON.parse(props.data?.description as any);
  const withdrawSafetyPeriodData = useSelector((state: RootState) => state.dataReducer.withdrawSafetyPeriod);
  const [withdrawRequests, setWithdrawRequests] = useState<IPoolWithdrawRequest>();
  const [isWithdrawable, setIsWithdrawable] = useState(false);
  const [isPendingWithdraw, setIsPendingWithdraw] = useState(false);
  const [termsOfUse, setTermsOfUse] = useState(false);

  const [deposited, setDeposited] = useState(BigNumber.from(0));
  const [availableToWithdraw, setAvailableToWithdraw] = useState(BigNumber.from(0));
  const [withdrawAmount, setWithdrawAmount] = useState(BigNumber.from(0));
  const [userShares, setUserShares] = useState(BigNumber.from(0));

  useEffect(() => {
    if (!loading && !error && data && data.stakers && data.stakers.length > 0) {
      setDeposited(data.stakers[0]?.depositAmount);
      setAvailableToWithdraw(calculateAmountAvailableToWithdraw(data.stakers[0]?.shares, honeyPotBalance, totalUsersShares));
      setWithdrawAmount(data.stakers[0]?.withdrawAmount);
      setUserShares(BigNumber.from(data.stakers[0]?.shares));
    }
  }, [loading, error, data, honeyPotBalance, totalUsersShares])

  useEffect(() => {
    if (!loadingWithdrawRequests && !errorWithdrawRequests && dataWithdrawRequests && dataWithdrawRequests.vaults) {
      const withdrawRequest: IPoolWithdrawRequest = dataWithdrawRequests.vaults[0]?.withdrawRequests[0];
      setWithdrawRequests(withdrawRequest);
      setIsWithdrawable(moment().isBetween(moment.unix(Number(withdrawRequest?.withdrawEnableTime)), moment.unix(Number(withdrawRequest?.expiryTime))));
      setIsPendingWithdraw(moment().isBefore(moment.unix(Number(withdrawRequest?.withdrawEnableTime))));
    }
  }, [loadingWithdrawRequests, errorWithdrawRequests, dataWithdrawRequests])

  const canWithdraw = availableToWithdraw && Number(fromWei(availableToWithdraw, stakingTokenDecimals)) >= Number(userInput);

  useEffect(() => {
    const checkIsApproved = async () => {
      setIsApproved(await contractsActions.isApproved(stakingToken, selectedAddress, master.address));
    }
    checkIsApproved();
  }, [stakingToken, selectedAddress, master.address]);

  useEffect(() => {
    const getTokenData = async () => {
      setTokenBalance(await contractsActions.getTokenBalance(stakingToken, selectedAddress, stakingTokenDecimals));
      setTokenSymbol(await contractsActions.getTokenSymbol(stakingToken));
    }
    getTokenData();
  }, [stakingToken, selectedAddress, inTransaction, stakingTokenDecimals]);

  const [pendingReward, setPendingReward] = useState(BigNumber.from(0));
  const amountToClaim = millify(Number(fromWei(pendingReward)), { precision: 3 });

  useEffect(() => {
    const getPendingReward = async () => {
      setPendingReward(await contractsActions.getPendingReward(master.address, pid, selectedAddress));
    }
    getPendingReward();
  }, [master.address, selectedAddress, pid, inTransaction])

  const approveToken = async () => {
    setPendingWalletAction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.approveToken(stakingToken, master.address),
      () => { },
      async () => {
        setIsApproved(true);
        setPendingWalletAction(false);
      },
      () => { setPendingWalletAction(false); }, dispatch, `Spending ${tokenSymbol} approved`);
    dispatch(toggleInTransaction(false));
  }

  const depositAndClaim = async () => {
    setPendingWalletAction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.depositAndClaim(pid, master.address, userInput, stakingTokenDecimals),
      () => { if (props.setShowModal) { props.setShowModal(false); } },
      async () => {
        setUserInput("0");
        fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
      }, () => { setPendingWalletAction(false); }, dispatch, `Deposited ${userInput} ${tokenSymbol} ${pendingReward.eq(0) ? "" : `and Claimed ${millify(Number(fromWei(pendingReward)))} HATS`}`);
    dispatch(toggleInTransaction(false));
  }

  const withdrawAndClaim = async () => {
    setPendingWalletAction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.withdrawAndClaim(pid, master.address, calculateActualWithdrawValue(availableToWithdraw, userInput, userShares, stakingTokenDecimals)),
      () => { if (props.setShowModal) { props.setShowModal(false); } },
      async () => {
        setWithdrawRequests(undefined);
        setUserInput("0");
        fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
      }, () => { setPendingWalletAction(false); }, dispatch, `Withdrawn ${userInput} ${tokenSymbol} ${pendingReward.eq(0) ? "" : `and Claimed ${millify(Number(fromWei(pendingReward)))} HATS`}`);
    dispatch(toggleInTransaction(false));
  }

  const withdrawRequest = async () => {
    setPendingWalletAction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.withdrawRequest(pid, master.address),
      () => { },
      async () => { setPendingWalletAction(false); },
      () => { setPendingWalletAction(false); },
      dispatch,
      "Withdrawal Request succeeded");
    dispatch(toggleInTransaction(false));
  }

  const claim = async () => {
    setPendingWalletAction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.claim(pid, master.address),
      () => { if (props.setShowModal) { props.setShowModal(false); } },
      async () => {
        setUserInput("0");
        fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
      }, () => { setPendingWalletAction(false); }, dispatch, `Claimed ${millify(Number(fromWei(pendingReward)))} HATS`);
    dispatch(toggleInTransaction(false));
  }

  const depositWithdrawWrapperClass = classNames({
    "deposit-wrapper": true,
    "disabled": pendingWalletAction
  })

  const amountWrapperClass = classNames({
    "amount-wrapper": true,
    "disabled": !isApproved || (tab === "withdraw" && ((isPendingWithdraw || withdrawSafetyPeriodData.isSafetyPeriod) || (!isPendingWithdraw && !isWithdrawable)))
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
        createdAt={withdrawRequests?.createdAt || ""}
        expiryTime={withdrawRequests?.expiryTime || ""}
        setIsPendingWithdraw={setIsPendingWithdraw}
        setIsWithdrawable={setIsWithdrawable}
      />}
    <div style={{ display: `${isPendingWithdraw && tab === "withdraw" ? "none" : ""}` }}>
      <div className="balance-wrapper">
        {`${tokenSymbol} Balance: ${!tokenBalance ? "-" : millify(Number(tokenBalance))}`}
      </div>
      <div>
        <div className={amountWrapperClass}>
          <div className="top">
            <span>Vault token</span>
            <span>&#8776; {!tokenPrice ? "-" : `$${millify(tokenPrice)}`}</span>
          </div>
          <div className="input-wrapper">
            <div className="pool-token">{props.isPool ? null : <img width="30px" src={description?.["Project-metadata"].icon} alt="project logo" />}<span>{name}</span></div>
            <input type="number" value={userInput} onChange={(e) => { isDigitsOnly(e.target.value) && setUserInput(e.target.value) }} min="0" autoFocus />
          </div>
          {tab === "deposit" && notEnoughBalance && <span className="input-error">Insufficient funds</span>}
          {tab === "withdraw" && !canWithdraw && <span className="input-error">Can't withdraw more than available</span>}
        </div>
      </div>
      <div className="staked-wrapper">
        <div>
          <span>You deposited</span>
          <span>{fromWei(deposited, stakingTokenDecimals)}</span>
        </div>
        <div>
          <span>You withdrawn</span>
          <span>{fromWei(withdrawAmount, stakingTokenDecimals)}</span>
        </div>
        <div>
          <span>Available to withdraw</span>
          <span>{fromWei(availableToWithdraw, stakingTokenDecimals)}</span>
        </div>
      </div>
      <div className="apy-wrapper">
        <span>
          APY
          <Tooltip
            overlayClassName="tooltip"
            overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
            overlay="Estimated yearly earnings based on total staked amount and rate reward">
            <div style={{ display: "flex", marginLeft: "10px" }}><InfoIcon /></div>
          </Tooltip>
        </span>
        <span>{apy ? `${millify(apy, { precision: 3 })}%` : "-"}</span>
      </div>
    </div>
    <div className="seperator" />
    {tab === "withdraw" && isWithdrawable && !isPendingWithdraw && <WithdrawTimer expiryTime={withdrawRequests?.expiryTime || ""} setIsWithdrawable={setIsWithdrawable} />}
    {tab === "deposit" && isApproved && (
      <div className={`terms-of-use-wrapper ${(!userInput || userInput === "0") && "disabled"}`}>
        <input type="checkbox" checked={termsOfUse} onChange={() => setTermsOfUse(!termsOfUse)} disabled={!userInput || userInput === "0"} />
        <label>I UNDERSTAND AND AGREE TO THE <u><a target="_blank" rel="noopener noreferrer" href={RoutePaths.terms_of_service}>TERMS OF USE</a></u></label>
      </div>
    )}
    {tab === "withdraw" && withdrawSafetyPeriodData.isSafetyPeriod && isWithdrawable && !isPendingWithdraw && <span className="extra-info-wrapper">SAFE PERIOD IS ON. WITHDRAWAL IS NOT AVAILABLE DURING SAFE PERIOD</span>}
    {tab === "deposit" && (isWithdrawable || isPendingWithdraw) && <span className="extra-info-wrapper">DEPOSIT WILL CANCEL THE WITHDRAWAL REQUEST</span>}
    <div className="action-btn-wrapper">
      {!isApproved && tab === "deposit" &&
        <button
          className="action-btn"
          onClick={async () => await approveToken()}>{`ENABLE SPENDING ${tokenSymbol}`}
        </button>}
      {isApproved && tab === "deposit" &&
        <button
          disabled={notEnoughBalance || !userInput || userInput === "0" || !termsOfUse}
          className="action-btn"
          onClick={async () => await depositAndClaim()}>{`DEPOSIT ${pendingReward.eq(0) ? "" : `AND CLAIM ${amountToClaim} HATS`}`}
        </button>}
      {tab === "withdraw" && withdrawRequests && isWithdrawable && !isPendingWithdraw &&
        <button
          disabled={!canWithdraw || !userInput || userInput === "0" || withdrawSafetyPeriodData.isSafetyPeriod}
          className="action-btn"
          onClick={async () => await withdrawAndClaim()}>{`WITHDRAW ${pendingReward.eq(0) ? "" : `AND CLAIM ${amountToClaim} HATS`}`}
        </button>}
      {tab === "withdraw" && !isPendingWithdraw && !isWithdrawable &&
        <button
          disabled={!isApproved || !canWithdraw}
          className="action-btn"
          onClick={async () => await withdrawRequest()}>WITHDRAWAL REQUEST</button>}
      <button onClick={async () => await claim()} disabled={!isApproved || pendingReward.eq(0)} className="action-btn claim-btn">{`CLAIM ${amountToClaim} HATS`}</button>
    </div>
    {pendingWalletAction && <Loading />}
  </div>
}
