import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { calculateActualWithdrawValue, calculateAmountAvailableToWithdraw, isDigitsOnly } from "../../utils";
import Loading from "../Shared/Loading";
import InfoIcon from "../../assets/icons/info.icon";
import "../../styles/DepositWithdraw/DepositWithdraw.scss";
//import * as contractsActions from "../../actions/contractsActions";
import { IPoolWithdrawRequest, IVault } from "../../types/types";
import { getBeneficiaryWithdrawRequests, getStakerData } from "../../graphql/subgraph";
import { useQuery } from "@apollo/client";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, formatEther, parseUnits } from "@ethersproject/units"
import { RootState } from "../../reducers";
import Tooltip from "rc-tooltip";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE, MINIMUM_DEPOSIT, TERMS_OF_USE, MAX_SPENDING } from "../../constants/constants";
import millify from "millify";
import classNames from "classnames";
import { DATA_POLLING_INTERVAL } from "../../settings";
import moment from "moment";
import Countdown from "../Shared/Countdown/Countdown";
import humanizeDuration from "humanize-duration";
import ApproveToken from "./ApproveToken";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { useAllowance, useApproveToken, useClaim, useDepositAndClaim, usePendingReward, useWithdrawAndClaim, useWithdrawRequest } from "hooks/contractHooks";

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
  const { id, pid, master, stakingToken, tokenPrice, apy, stakingTokenDecimals, honeyPotBalance, totalUsersShares, stakingTokenSymbol, committeeCheckedIn, depositPause } = props.data.parentVault;
  const { parentDescription, isGuest, description } = props.data;
  const [tab, setTab] = useState<Tab>("deposit");
  const [userInput, setUserInput] = useState("");
  const [showUnlimitedMessage, setShowUnlimitedMessage] = useState(false);
  const isAboveMinimumDeposit = !userInput ? false : parseUnits(userInput, stakingTokenDecimals).gte(BigNumber.from(MINIMUM_DEPOSIT));
  const { account } = useEthers()
  const { loading, error, data } = useQuery(getStakerData(id, account!), { pollInterval: DATA_POLLING_INTERVAL });
  const { loading: loadingWithdrawRequests, error: errorWithdrawRequests, data: dataWithdrawRequests } = useQuery(getBeneficiaryWithdrawRequests(pid, account!), { pollInterval: DATA_POLLING_INTERVAL });
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


  let userInputValue
  try {
    userInputValue = parseUnits(userInput!, stakingTokenDecimals)
  } catch {
    userInputValue = BigNumber.from(0)
  }


  const canWithdraw = availableToWithdraw && Number(formatUnits(availableToWithdraw, stakingTokenDecimals)) >= Number(userInput);

  const tokenBalance = formatUnits(useTokenBalance(stakingToken, account) ?? 0, stakingTokenDecimals);
  const notEnoughBalance = userInputValue > tokenBalance;

  const pendingReward = usePendingReward(master.address, pid, account!) ?? BigNumber.from(0)
  const amountToClaim = millify(Number(formatEther(pendingReward)), { precision: 3 });

  const { send: approveToken, state: approveTokenState } = useApproveToken(stakingToken)
  const handleApproveToken = async (amountToSpend?: BigNumber) => {
    approveToken(amountToSpend ?? MAX_SPENDING);
  }


  const allowance = useAllowance(stakingToken, account!, master.address)
  const hasAllowance = allowance?.gte(userInputValue);
  const tryDeposit = async () => {
    if (!hasAllowance) {
      setShowUnlimitedMessage(true);
    }
    else {
      handleDepositAndClaim();
    }
  }

  const { send: depositAndClaim, state: depositAndClaimState } = useDepositAndClaim(master.address)
  const handleDepositAndClaim = async () => {
    depositAndClaim(pid, userInputValue)
    // () => { if (props.setShowModal) { props.setShowModal(false); } },
    // async () => {
    //   setUserInput("");
    //   //fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
    // }, () => { setPendingWalletAction(false); }, dispatch, `Deposited ${userInput} ${stakingTokenSymbol} ${pendingReward.eq(0) ? "" : `and Claimed ${millify(Number(fromWei(pendingReward)))} HATS`}`);
  }

  const { send: withdrawAndClaim, state: withdrawAndClaimState } = useWithdrawAndClaim(master.address)

  const handleWithdrawAndClaim = async () => {
    withdrawAndClaim(pid, calculateActualWithdrawValue(availableToWithdraw, userInputValue, userShares, stakingTokenDecimals))
    // await contractsActions.createTransaction(
    //   async () => contractsActions.withdraw AndClaim(pid, master.address, ),
    //   () => { if (props.setShowModal) { props.setShowModal(false); } },
    //   async () => {
    //     setWithdrawRequests(undefined);
    //     setUserInput("");
    //     //fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
    //   }, () => { setPendingWalletAction(false); }, dispatch, `Withdrawn ${userInput} ${stakingTokenSymbol} ${pendingReward.eq(0) ? "" : `and Claimed ${millify(Number(fromWei(pendingReward)))} HATS`}`);
  }

  const { send: withdrawRequest, state: withdrawRequestState } = useWithdrawRequest(master.address)
  const handleWithdrawRequest = async () => {
    withdrawRequest(pid)
  }

  const { send: claim, state: claimState } = useClaim(master.address)
  const handleClaim = async () => {
    claim(pid)
    // () => { if (props.setShowModal) { props.setShowModal(false); } },
    // async () => {
    //   setUserInput("");
    //   //fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
    // }, () => { setPendingWalletAction(false); }, dispatch, `Claimed ${millify(Number(fromWei(pendingReward)))} HATS`);
  }

  const allStates = [approveTokenState, depositAndClaimState, withdrawAndClaimState, withdrawRequestState, claimState]

  const pendingWalletAction = allStates.some(state => state.status === 'PendingSignature' || state.status === 'Mining');

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
          {tab === "withdraw" && `Balance to withdraw: ${!availableToWithdraw ? "-" : millify(Number(formatUnits(availableToWithdraw, stakingTokenDecimals)))} ${stakingTokenSymbol}`}
          <button
            className="max-button"
            disabled={!committeeCheckedIn}
            onClick={() => setUserInput(tab === "deposit" ? tokenBalance : formatUnits(availableToWithdraw, stakingTokenDecimals))}>(Max)</button>
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
            {tab === "deposit" && !isAboveMinimumDeposit && userInput && <span className="input-error">{`Minimum deposit is ${parseUnits(String(MINIMUM_DEPOSIT), stakingTokenDecimals)}`}</span>}
            {tab === "deposit" && notEnoughBalance && <span className="input-error">Insufficient funds</span>}
            {tab === "withdraw" && !canWithdraw && <span className="input-error">Can't withdraw more than available</span>}
          </div>
        </div>
        <div className="staked-wrapper">
          <div>
            <span>Staked</span>
            <span>{formatUnits(deposited, stakingTokenDecimals)}</span>
          </div>
          <div>
            <span>Withdrawn</span>
            <span>{formatUnits(withdrawAmount, stakingTokenDecimals)}</span>
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
            approveToken={handleApproveToken}
            depositAndClaim={handleDepositAndClaim}
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
            onClick={async () => await handleWithdrawAndClaim()}>{`WITHDRAW ${pendingReward.eq(0) ? "" : `AND CLAIM ${amountToClaim} HATS`}`}
          </button>}
        {tab === "withdraw" && !isPendingWithdraw && !isWithdrawable &&
          <button
            disabled={!canWithdraw || availableToWithdraw.eq(0) || !committeeCheckedIn}
            className="action-btn"
            onClick={async () => await handleWithdrawRequest()}>WITHDRAWAL REQUEST</button>}
        <button onClick={async () => await handleClaim()} disabled={pendingReward.eq(0)} className="action-btn claim-btn fill">{`CLAIM ${amountToClaim} HATS`}</button>
      </div>
      {pendingWalletAction && <Loading />}
    </div>
  )
}
