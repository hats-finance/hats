import { useState, useEffect, useCallback, useRef, MutableRefObject } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { BigNumber } from "@ethersproject/bignumber";
import humanizeDuration from "humanize-duration";
import moment from "moment";
import millify from "millify";
import classNames from "classnames";
import Tooltip from "rc-tooltip";
import { formatUnits, formatEther, parseUnits } from "@ethersproject/units";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { calculateApy, isDigitsOnly } from "../../utils";
import Loading from "../Shared/Loading";
import InfoIcon from "../../assets/icons/info.icon";
import { IPoolWithdrawRequest, IVault, IVaultDescription } from "../../types/types";
import { getBeneficiaryWithdrawRequests, getStakerData } from "../../graphql/subgraph";
import { RootState } from "../../reducers";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE, MINIMUM_DEPOSIT, TERMS_OF_USE, MAX_SPENDING } from "../../constants/constants";
import Countdown from "../Shared/Countdown/Countdown";
import ApproveToken from "./ApproveToken";
import { useCheckIn, useClaimReward, useDepositAndClaim, usePendingReward, useTokenApprove, useWithdrawAndClaim, useWithdrawRequest } from "hooks/contractHooks";
import "../../styles/DepositWithdraw/DepositWithdraw.scss";
import { POLL_INTERVAL } from "settings";

interface IProps {
  data: IVault
  setShowModal: Function
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
  const { id, pid, master, stakingToken, stakingTokenDecimals, honeyPotBalance, totalUsersShares, stakingTokenSymbol,
    committeeCheckedIn, depositPause } = props.data;
  const { description } = props.data;
  const { setShowModal } = props;
  const [tab, setTab] = useState<Tab>("deposit");
  const [userInput, setUserInput] = useState("");
  const [showApproveSpendingModal, setShowApproveSpendingModal] = useState(false);
  const { account } = useEthers()
  const { data: staker } = useQuery(
    getStakerData(id, account!), { pollInterval: POLL_INTERVAL });
  const { data: withdrawRequests } = useQuery(
    getBeneficiaryWithdrawRequests(pid, account!), { pollInterval: POLL_INTERVAL });
  const { dataReducer: { withdrawSafetyPeriod, hatsPrice } } = useSelector((state: RootState) => state);
  const [termsOfUse, setTermsOfUse] = useState(false);
  const tokenPrice = useSelector((state: RootState) => state.dataReducer.tokenPrices)?.[stakingToken]?.['usd'];
  const apy = hatsPrice && tokenPrice ? calculateApy(props.data, hatsPrice, tokenPrice) : 0;

  const withdrawRequest = withdrawRequests?.vaults[0]?.withdrawRequests[0] as IPoolWithdrawRequest;
  const [isWithdrawable, setIsWithdrawable] = useState<boolean>()
  const [isPendingWithdraw, setIsPendingWithdraw] = useState<boolean>();

  useEffect(() => {
    if (withdrawRequest) {
      setIsPendingWithdraw(moment().isBefore(moment.unix(Number(withdrawRequest?.withdrawEnableTime))));
      setIsWithdrawable(moment().isBetween(moment.unix(Number(withdrawRequest?.withdrawEnableTime)), moment.unix(Number(withdrawRequest?.expiryTime))))
    }
  }, [withdrawRequest]);

  const { shares, depositAmount, withdrawAmount } = staker?.stakers[0] || {};
  const availableToWithdraw = calculateAmountAvailableToWithdraw(shares, honeyPotBalance, totalUsersShares);
  const formatAvailableToWithdraw = availableToWithdraw ? formatUnits(availableToWithdraw, stakingTokenDecimals) : "-";

  let userInputValue: BigNumber | undefined = undefined;
  try {
    userInputValue = parseUnits(userInput!, stakingTokenDecimals);
  } catch {
    // TODO: do something
    // userInputValue = BigNumber.from(0);
  }
  const isAboveMinimumDeposit = userInputValue ? userInputValue.gte(BigNumber.from(MINIMUM_DEPOSIT)) : false;
  const canWithdraw = availableToWithdraw && Number(formatUnits(availableToWithdraw, stakingTokenDecimals)) >= Number(userInput);
  const tokenBalance = useTokenBalance(stakingToken, account)
  const formattedTokenBalance = tokenBalance ? formatUnits(tokenBalance, stakingTokenDecimals) : "-";
  const notEnoughBalance = userInputValue && tokenBalance ? userInputValue.gt(tokenBalance) : false;
  const pendingReward = usePendingReward(master.address, pid, account!)
  const pendingRewardFormat = pendingReward ? millify(Number(formatEther(pendingReward)), { precision: 3 }) : "-";

  const { send: approveToken, state: approveTokenState } = useTokenApprove(stakingToken);
  const handleApproveToken = async (amountToSpend?: BigNumber) => {
    approveToken(master.address, amountToSpend ?? MAX_SPENDING,);
  }

  const allowance = useTokenAllowance(stakingToken, account!, master.address)
  const hasAllowance = userInputValue ? allowance?.gte(userInputValue) : false;

  const { send: depositAndClaim, state: depositAndClaimState } = useDepositAndClaim(master.address);
  const handleDepositAndClaim = useCallback(async () => {
    depositAndClaim(pid, userInputValue);
  }, [pid, userInputValue, depositAndClaim])

  const tryDeposit = useCallback(async () => {
    if (!hasAllowance) {
      setShowApproveSpendingModal(true);
    }
    else {
      handleDepositAndClaim();
    }
  }, [setShowApproveSpendingModal, handleDepositAndClaim, hasAllowance])

  const { send: withdrawAndClaim, state: withdrawAndClaimState } = useWithdrawAndClaim(master.address);

  const handleWithdrawAndClaim = useCallback(async () => {
    withdrawAndClaim(pid, calculateActualWithdrawValue(availableToWithdraw, userInputValue, shares));
  }, [availableToWithdraw, userInputValue, shares, pid, withdrawAndClaim]);

  const { send: withdrawRequestCall, state: withdrawRequestState } = useWithdrawRequest(master.address);
  const handleWithdrawRequest = async () => {
    withdrawRequestCall(pid);
  }

  const { send: claimReward, state: claimRewardState } = useClaimReward(master.address);
  const handleClaimReward = async () => {
    claimReward(pid);
  }

  const { send: checkIn, state: checkInState } = useCheckIn(master.address)
  const handleCheckIn = () => {
    checkIn(pid)
  }

  const transactionStates = [
    approveTokenState,
    depositAndClaimState,
    withdrawAndClaimState,
    withdrawRequestState,
    claimRewardState,
    checkInState]

  const keepModalOpen = [withdrawRequestState, approveTokenState];
  const inTransaction = transactionStates.filter(state => !keepModalOpen.includes(state)).some(state => state.status === 'Mining')
  const pendingWallet = transactionStates.some(state => state.status === "PendingSignature");
  const prevApproveTokenState = usePrevious(approveTokenState);

  // after successful approve transaction immediatly call deposit and claim
  useEffect(() => {
    if (approveTokenState.status === "Success" && prevApproveTokenState?.status !== approveTokenState.status) {
      handleDepositAndClaim();
    }
  }, [approveTokenState, prevApproveTokenState, handleDepositAndClaim])

  useEffect(() => {
    if (inTransaction)
      setShowModal(false);
  }, [inTransaction, setShowModal]);

  const depositWithdrawWrapperClass = classNames({
    "deposit-wrapper": true,
    "disabled": pendingWallet
  })

  const amountWrapperClass = classNames({
    "amount-wrapper": true,
    "disabled": (tab === "withdraw" && ((isPendingWithdraw || withdrawSafetyPeriod.isSafetyPeriod) || (!isPendingWithdraw && !isWithdrawable)))
  })

  const multisigAddress = (description as IVaultDescription)?.committee?.["multisig-address"];
  const isCommitteMultisig = multisigAddress === account;

  return (
    <div className={depositWithdrawWrapperClass}>
      <div className="tabs-wrapper">
        <button className={tab === "deposit" ? "tab selected" : "tab"} onClick={() => { setTab("deposit"); setUserInput(""); }}>DEPOSIT</button>
        <button className={tab === "withdraw" ? "tab selected" : "tab"} onClick={() => { setTab("withdraw"); setUserInput(""); }}>WITHDRAW</button>
      </div>
      {tab === "withdraw" && isPendingWithdraw &&
        <PendingWithdraw
          withdrawEnableTime={withdrawRequest?.withdrawEnableTime || ""}
          expiryTime={withdrawRequest?.expiryTime || ""}
          setIsPendingWithdraw={setIsPendingWithdraw}
          setIsWithdrawable={setIsWithdrawable}
        />}
      <div style={{ display: `${isPendingWithdraw && tab === "withdraw" ? "none" : ""}` }}>
        <div className="balance-wrapper">
          {tab === "deposit" && `Balance: ${!tokenBalance ? "-" : millify(Number(formattedTokenBalance))} ${stakingTokenSymbol}`}
          {tab === "withdraw" && `Balance to withdraw: ${!availableToWithdraw ? "-" : millify(Number(formatUnits(availableToWithdraw, stakingTokenDecimals)))} ${stakingTokenSymbol}`}
          <button
            className="max-button"
            disabled={!committeeCheckedIn}
            onClick={() => setUserInput(
              tab === "deposit" ?
                formattedTokenBalance :
                formatAvailableToWithdraw)}>
            (Max)
          </button>
        </div>
        <div>
          <div className={amountWrapperClass}>
            <div className="top">
              <span>Vault token</span>
              <span>&#8776; {!tokenPrice ? "-" : `$${millify(tokenPrice, { precision: 3 })}`}</span>
            </div>
            <div className="input-wrapper">
              <div className="pool-token">{props.isPool ? null : <img width="30px" src={description?.["project-metadata"]?.tokenIcon} alt="token logo" />}<span>{stakingTokenSymbol}</span></div>
              <input disabled={!committeeCheckedIn} placeholder="0.0" type="number" value={userInput} onChange={(e) => { isDigitsOnly(e.target.value) && setUserInput(e.target.value) }} min="0" onClick={(e) => (e.target as HTMLInputElement).select()} />
            </div>
            {tab === "deposit" && !isAboveMinimumDeposit && userInput && <span className="input-error">{`Minimum deposit is ${formatUnits(String(MINIMUM_DEPOSIT), stakingTokenDecimals)}`}</span>}
            {tab === "deposit" && notEnoughBalance && <span className="input-error">Insufficient funds</span>}
            {tab === "withdraw" && !canWithdraw && <span className="input-error">Can't withdraw more than available</span>}
          </div>
        </div>
        <div className="staked-wrapper">
          <div>
            <span>Staked</span>
            <span>{depositAmount ? formatUnits(depositAmount, stakingTokenDecimals) : "-"}</span>
          </div>
          <div>
            <span>Withdrawn</span>
            <span>{withdrawAmount ? formatUnits(withdrawAmount, stakingTokenDecimals) : "-"}</span>
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
      {tab === "withdraw" && isWithdrawable && !isPendingWithdraw &&
        <WithdrawTimer
          expiryTime={withdrawRequest?.expiryTime || ""}
          setIsWithdrawable={setIsWithdrawable} />}
      {tab === "deposit" && (
        <div className={`terms-of-use-wrapper ${(!userInput || userInput === "0") && "disabled"}`}>
          <input type="checkbox" checked={termsOfUse} onChange={() => setTermsOfUse(!termsOfUse)} disabled={!userInput || userInput === "0"} />
          <label>I UNDERSTAND AND AGREE TO THE <u><a target="_blank" rel="noopener noreferrer" href={TERMS_OF_USE}>TERMS OF USE</a></u></label>
        </div>
      )}
      {!committeeCheckedIn && <span className="extra-info-wrapper">COMMITTEE IS NOT CHECKED IN YET!</span>}
      {depositPause && <span className="extra-info-wrapper">DEPOSIT PAUSE IS IN EFFECT!</span>}
      {tab === "withdraw" && withdrawSafetyPeriod.isSafetyPeriod && isWithdrawable && !isPendingWithdraw && <span className="extra-info-wrapper">SAFE PERIOD IS ON. WITHDRAWAL IS NOT AVAILABLE DURING SAFE PERIOD</span>}
      {tab === "deposit" && (isWithdrawable || isPendingWithdraw) && <span className="extra-info-wrapper">DEPOSIT WILL CANCEL THE WITHDRAWAL REQUEST</span>}
      <div className="action-btn-wrapper">
        {tab === "deposit" && showApproveSpendingModal &&
          <ApproveToken
            approveToken={handleApproveToken}
            userInput={userInput}
            hideApproveSpending={() => setShowApproveSpendingModal(false)}
            stakingTokenDecimals={stakingTokenDecimals} />}
        {tab === "deposit" &&
          <button
            disabled={notEnoughBalance || !userInput || userInput === "0" || !termsOfUse || !isAboveMinimumDeposit || !committeeCheckedIn || depositPause}
            className="action-btn"
            onClick={async () => await tryDeposit()}>
            {`DEPOSIT ${!pendingReward || pendingReward.eq(0) ? "" : `AND CLAIM ${pendingRewardFormat} HATS`}`}
          </button>}
        {tab === "withdraw" && withdrawRequest && isWithdrawable && !isPendingWithdraw &&
          <button
            disabled={!canWithdraw || !userInput || userInput === "0" || withdrawSafetyPeriod.isSafetyPeriod || !committeeCheckedIn}
            className="action-btn"
            onClick={async () => await handleWithdrawAndClaim()}>
            {`WITHDRAW ${!pendingReward || pendingReward.eq(0) ?
              "" : `AND CLAIM ${pendingRewardFormat} HATS`}`}
          </button>}
        {tab === "withdraw" && !isPendingWithdraw && !isWithdrawable &&
          <button
            disabled={!canWithdraw || availableToWithdraw.eq(0) || !committeeCheckedIn}
            className="action-btn"
            onClick={async () => await handleWithdrawRequest()}>WITHDRAWAL REQUEST</button>}
        {isCommitteMultisig && !committeeCheckedIn && <button onClick={handleCheckIn} className="action-btn">CHECK IN</button>}
        <button
          onClick={async () => await handleClaimReward()}
          disabled={!pendingReward || pendingReward.eq(0)}
          className="action-btn claim-btn fill">
          {`CLAIM ${pendingRewardFormat} HATS`}
        </button>
      </div>
      {pendingWallet && <Loading />}
    </div>
  )
}

function usePrevious<T>(
  value: T,
): MutableRefObject<T | undefined>['current'] {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


/**
 * Calculates how much available to withdraw considring the userShares, poolBalance and totalUsersShares
 * @param {string} userShares
 * @param {string} poolBalance
 * @param {string} totalUsersShares
 */
const calculateAmountAvailableToWithdraw = (
  userShares?: string,
  poolBalance?: string,
  totalUsersShares?: string
) => {
  if (!userShares || !poolBalance || !totalUsersShares) return undefined;
  return BigNumber.from(userShares)
    .mul(BigNumber.from(poolBalance))
    .div(BigNumber.from(totalUsersShares));
};

/**
 * Calculates the value we send to the contract when a user wants to withdraw
 * @param {BigNumber} amountAvailableToWithdraw
 * @param {string} userInput The actual number the user insterted
 * @param {BigNumber} userShares
 * @param {string} decimals
 */
const calculateActualWithdrawValue = (
  amountAvailableToWithdraw?: BigNumber,
  userInput?: BigNumber,
  userShares?: BigNumber
) => {
  if (!amountAvailableToWithdraw || !userInput || !userShares) return undefined;
  return userInput.mul(userShares)
    .div(amountAvailableToWithdraw)
    .toString();
};
