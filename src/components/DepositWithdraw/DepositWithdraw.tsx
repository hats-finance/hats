import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateActualWithdrawValue, calculateAmountAvailableToWithdraw, fetchWalletBalance, fromWei, getNetworkNameByChainId, isDigitsOnly, toWei } from "../../utils";
import Loading from "../Shared/Loading";
import InfoIcon from "../../assets/icons/info.icon";
import "../../styles/DepositWithdraw/DepositWithdraw.scss";
import * as contractsActions from "../../actions/contractsActions";
import { IPoolWithdrawRequest, IVault } from "../../types/types";
import { getBeneficiaryWithdrawRequests, getStakerData } from "../../graphql/subgraph";
import { useQuery } from "@apollo/client";
import { BigNumber } from "@ethersproject/bignumber";
import { RootState } from "../../reducers";
import Tooltip from "rc-tooltip";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE, MINIMUM_DEPOSIT, TERMS_OF_USE } from "../../constants/constants";
import millify from "millify";
import classNames from "classnames";
import { DATA_POLLING_INTERVAL } from "../../settings";
import moment from "moment";
import Countdown from "../Shared/Countdown/Countdown";
import humanizeDuration from "humanize-duration";
import ApproveToken from "./ApproveToken";

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
      <Countdown
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
  expiryTime: string
  setIsPendingWithdraw: Function
  setIsWithdrawable: Function
}

const PendingWithdraw = (props: IPendingWithdrawProps) => {
  const { withdrawEnableTime, expiryTime, setIsPendingWithdraw, setIsWithdrawable } = props;
  const diff = moment.unix(Number(expiryTime)).diff(moment.unix(Number(withdrawEnableTime)), "milliseconds");
  return (
    <div className="pending-withdraw-timer-wrapper">
      <span>
        WITHDRAWAL REQUEST HASE BEEN SENT.<br /><br />
        YOU WILL BE ABLE TO MAKE A WITHDRAWAL FOR <span>{humanizeDuration(Number(diff), { units: ["d", "h", "m"] })} PERIOD</span><br /><br />
      WITHDRAWAL AVAILABLE WITHIN:
      </span>
      <Countdown
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
  const { id, pid, master, stakingToken, tokenPrice, apy, stakingTokenDecimals, honeyPotBalance, totalUsersShares, stakingTokenSymbol, committeeCheckedIn, depositPause } = props.data.parentVault;
  const { parentDescription, isGuest, description } = props.data;
  const [tab, setTab] = useState<Tab>("deposit");
  const [userInput, setUserInput] = useState("");
  const [showUnlimitedMessage, setShowUnlimitedMessage] = useState(false);
  const inTransaction = useSelector((state: RootState) => state.layoutReducer.inTransaction);
  const [pendingWalletAction, setPendingWalletAction] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("0");
  const notEnoughBalance = parseInt(userInput) > parseInt(tokenBalance);
  const isAboveMinimumDeposit = !userInput ? false : toWei(userInput, stakingTokenDecimals).gte(BigNumber.from(MINIMUM_DEPOSIT));
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);
  const { loading, error, data } = useQuery(getStakerData(id, selectedAddress), { pollInterval: DATA_POLLING_INTERVAL });
  const { loading: loadingWithdrawRequests, error: errorWithdrawRequests, data: dataWithdrawRequests } = useQuery(getBeneficiaryWithdrawRequests(pid, selectedAddress), { pollInterval: DATA_POLLING_INTERVAL });
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
    if (!loadingWithdrawRequests && !errorWithdrawRequests && dataWithdrawRequests && dataWithdrawRequests.parentVaults) {
      const withdrawRequest: IPoolWithdrawRequest = dataWithdrawRequests.parentVaults[0]?.withdrawRequests[0];
      setWithdrawRequests(withdrawRequest);
      setIsWithdrawable(moment().isBetween(moment.unix(Number(withdrawRequest?.withdrawEnableTime)), moment.unix(Number(withdrawRequest?.expiryTime))));
      setIsPendingWithdraw(moment().isBefore(moment.unix(Number(withdrawRequest?.withdrawEnableTime))));
    }
  }, [loadingWithdrawRequests, errorWithdrawRequests, dataWithdrawRequests])

  const canWithdraw = availableToWithdraw && Number(fromWei(availableToWithdraw, stakingTokenDecimals)) >= Number(userInput);

  useEffect(() => {
    const getTokenData = async () => {
      setTokenBalance(await contractsActions.getTokenBalance(stakingToken, selectedAddress, stakingTokenDecimals));
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

  const approveToken = async (amountToSpend?: BigNumber) => {
    setPendingWalletAction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.approveToken(stakingToken, master.address, amountToSpend),
      () => { },
      async () => {
        setPendingWalletAction(false);
      },
      () => { setPendingWalletAction(false); }, dispatch, `Spending ${stakingTokenSymbol} approved`);
  }

  const tryDeposit = async () => {
    if (!await contractsActions.hasAllowance(stakingToken, selectedAddress, master.address, userInput, stakingTokenDecimals)) {
      setShowUnlimitedMessage(true);
    }
    else {
      depositAndClaim();
    }
  }

  const depositAndClaim = async () => {
    setPendingWalletAction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.depositAndClaim(pid, master.address, userInput, stakingTokenDecimals),
      () => { if (props.setShowModal) { props.setShowModal(false); } },
      async () => {
        setUserInput("");
        fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
      }, () => { setPendingWalletAction(false); }, dispatch, `Deposited ${userInput} ${stakingTokenSymbol} ${pendingReward.eq(0) ? "" : `and Claimed ${millify(Number(fromWei(pendingReward)))} HATS`}`);
  }

  const withdrawAndClaim = async () => {
    setPendingWalletAction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.withdrawAndClaim(pid, master.address, calculateActualWithdrawValue(availableToWithdraw, userInput, userShares, stakingTokenDecimals)),
      () => { if (props.setShowModal) { props.setShowModal(false); } },
      async () => {
        setWithdrawRequests(undefined);
        setUserInput("");
        fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
      }, () => { setPendingWalletAction(false); }, dispatch, `Withdrawn ${userInput} ${stakingTokenSymbol} ${pendingReward.eq(0) ? "" : `and Claimed ${millify(Number(fromWei(pendingReward)))} HATS`}`);
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
  }

  const claim = async () => {
    setPendingWalletAction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.claim(pid, master.address),
      () => { if (props.setShowModal) { props.setShowModal(false); } },
      async () => {
        setUserInput("");
        fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
      }, () => { setPendingWalletAction(false); }, dispatch, `Claimed ${millify(Number(fromWei(pendingReward)))} HATS`);
  }

  const depositWithdrawWrapperClass = classNames({
    "deposit-wrapper": true,
    "disabled": pendingWalletAction
  })

  const amountWrapperClass = classNames({
    "amount-wrapper": true,
    "disabled": (tab === "withdraw" && ((isPendingWithdraw || withdrawSafetyPeriodData.isSafetyPeriod) || (!isPendingWithdraw && !isWithdrawable)))
  })

  return (
    <div className={depositWithdrawWrapperClass}>
      <div className="tabs-wrapper">
        <button className={tab === "deposit" ? "tab selected" : "tab"} onClick={() => { setTab("deposit"); setUserInput(""); }}>DEPOSIT</button>
        <button className={tab === "withdraw" ? "tab selected" : "tab"} onClick={() => { setTab("withdraw"); setUserInput(""); }}>WITHDRAW</button>
      </div>
      {tab === "withdraw" && isPendingWithdraw &&
        <PendingWithdraw
          withdrawEnableTime={withdrawRequests?.withdrawEnableTime || ""}
          expiryTime={withdrawRequests?.expiryTime || ""}
          setIsPendingWithdraw={setIsPendingWithdraw}
          setIsWithdrawable={setIsWithdrawable}
        />}
      <div style={{ display: `${isPendingWithdraw && tab === "withdraw" ? "none" : ""}` }}>
        <div className="balance-wrapper">
          {tab === "deposit" && `Balance: ${!tokenBalance ? "-" : millify(Number(tokenBalance))} ${stakingTokenSymbol}`}
          {tab === "withdraw" && `Balance to withdraw: ${!availableToWithdraw ? "-" : millify(Number(fromWei(availableToWithdraw, stakingTokenDecimals)))} ${stakingTokenSymbol}`}
          <button
            className="max-button"
            disabled={!committeeCheckedIn}
            onClick={() => setUserInput(tab === "deposit" ? tokenBalance : fromWei(availableToWithdraw, stakingTokenDecimals))}>(Max)</button>
        </div>
        <div>
          <div className={amountWrapperClass}>
            <div className="top">
              <span>Vault token</span>
              <span>&#8776; {!tokenPrice ? "-" : `$${millify(tokenPrice, { precision: 3 })}`}</span>
            </div>
            <div className="input-wrapper">
              {/* TODO: handle project-metadata and Project-metadata */}
              <div className="pool-token">{props.isPool ? null : <img width="30px" src={isGuest ? parentDescription?.["project-metadata"]?.tokenIcon : description?.["project-metadata"]?.tokenIcon ?? description?.["Project-metadata"]?.tokenIcon} alt="token logo" />}<span>{stakingTokenSymbol}</span></div>
              <input disabled={!committeeCheckedIn} placeholder="0.0" type="number" value={userInput} onChange={(e) => { isDigitsOnly(e.target.value) && setUserInput(e.target.value) }} min="0" onClick={(e) => (e.target as HTMLInputElement).select()} />
            </div>
            {tab === "deposit" && !isAboveMinimumDeposit && userInput && <span className="input-error">{`Minimum deposit is ${fromWei(String(MINIMUM_DEPOSIT), stakingTokenDecimals)}`}</span>}
            {tab === "deposit" && notEnoughBalance && <span className="input-error">Insufficient funds</span>}
            {tab === "withdraw" && !canWithdraw && <span className="input-error">Can't withdraw more than available</span>}
          </div>
        </div>
        <div className="staked-wrapper">
          <div>
            <span>Staked</span>
            <span>{fromWei(deposited, stakingTokenDecimals)}</span>
          </div>
          <div>
            <span>Withdrawn</span>
            <span>{fromWei(withdrawAmount, stakingTokenDecimals)}</span>
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
      {tab === "withdraw" && isWithdrawable && !isPendingWithdraw && <WithdrawTimer expiryTime={withdrawRequests?.expiryTime || ""} setIsWithdrawable={setIsWithdrawable} />}
      {tab === "deposit" && (
        <div className={`terms-of-use-wrapper ${(!userInput || userInput === "0") && "disabled"}`}>
          <input type="checkbox" checked={termsOfUse} onChange={() => setTermsOfUse(!termsOfUse)} disabled={!userInput || userInput === "0"} />
          <label>I UNDERSTAND AND AGREE TO THE <u><a target="_blank" rel="noopener noreferrer" href={TERMS_OF_USE}>TERMS OF USE</a></u></label>
        </div>
      )}
      {!committeeCheckedIn && <span className="extra-info-wrapper">COMMITTEE IS NOT CHECKED IN YET!</span>}
      {depositPause && <span className="extra-info-wrapper">DEPOSIT PAUSE IS IN EFFECT!</span>}
      {tab === "withdraw" && withdrawSafetyPeriodData.isSafetyPeriod && isWithdrawable && !isPendingWithdraw && <span className="extra-info-wrapper">SAFE PERIOD IS ON. WITHDRAWAL IS NOT AVAILABLE DURING SAFE PERIOD</span>}
      {tab === "deposit" && (isWithdrawable || isPendingWithdraw) && <span className="extra-info-wrapper">DEPOSIT WILL CANCEL THE WITHDRAWAL REQUEST</span>}
      <div className="action-btn-wrapper">
        {tab === "deposit" && showUnlimitedMessage &&
          <ApproveToken
            approveToken={approveToken}
            depositAndClaim={depositAndClaim}
            userInput={userInput}
            setShowUnlimitedMessage={setShowUnlimitedMessage}
            stakingTokenDecimals={stakingTokenDecimals} />}
        {tab === "deposit" &&
          <button
            disabled={notEnoughBalance || !userInput || userInput === "0" || !termsOfUse || !isAboveMinimumDeposit || !committeeCheckedIn || depositPause}
            className="action-btn"
            onClick={async () => await tryDeposit()}>{`DEPOSIT ${pendingReward.eq(0) ? "" : `AND CLAIM ${amountToClaim} HATS`}`}
          </button>}
        {tab === "withdraw" && withdrawRequests && isWithdrawable && !isPendingWithdraw &&
          <button
            disabled={!canWithdraw || !userInput || userInput === "0" || withdrawSafetyPeriodData.isSafetyPeriod || !committeeCheckedIn}
            className="action-btn"
            onClick={async () => await withdrawAndClaim()}>{`WITHDRAW ${pendingReward.eq(0) ? "" : `AND CLAIM ${amountToClaim} HATS`}`}
          </button>}
        {tab === "withdraw" && !isPendingWithdraw && !isWithdrawable &&
          <button
            disabled={!canWithdraw || availableToWithdraw.eq(0) || !committeeCheckedIn}
            className="action-btn"
            onClick={async () => await withdrawRequest()}>WITHDRAWAL REQUEST</button>}
        <button onClick={async () => await claim()} disabled={pendingReward.eq(0)} className="action-btn claim-btn fill">{`CLAIM ${amountToClaim} HATS`}</button>
      </div>
      {pendingWalletAction && <Loading />}
    </div>
  )
}
