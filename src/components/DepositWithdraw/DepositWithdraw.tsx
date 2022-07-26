import { useState, useEffect, useCallback } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import moment from "moment";
import millify from "millify";
import classNames from "classnames";
import { formatUnits, formatEther, parseUnits } from "@ethersproject/units";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { isDateBefore, isDateBetween, isDigitsOnly } from "../../utils";
import Loading from "../Shared/Loading";
import { IVault } from "../../types/types";
import { MINIMUM_DEPOSIT, TERMS_OF_USE, MAX_SPENDING } from "../../constants/constants";
import ApproveToken from "./ApproveToken/ApproveToken";
import { useCheckIn, useClaimReward, useDepositAndClaim, usePendingReward, useTokenApprove, useUserSharesPerVault, useWithdrawAndClaim, useWithdrawRequest, useWithdrawRequestInfo } from "hooks/contractHooks";
import TokenSelect from "./TokenSelect/TokenSelect";
import Assets from "./Assets/Assets";
import { calculateActualWithdrawValue } from "./utils";
import { useVaults } from "hooks/useVaults";
import "./index.scss";
import { usePrevious } from "hooks/usePrevious";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";

interface IProps {
  data: IVault
  setShowModal: Function
}

type Tab = "deposit" | "withdraw";

export default function DepositWithdraw(props: IProps) {
  const isSupportedNetwork = useSupportedNetwork();
  const { pid, master, stakingToken, stakingTokenDecimals, multipleVaults, committee,
    committeeCheckedIn, depositPause } = props.data;
  const { setShowModal } = props;
  const [tab, setTab] = useState<Tab>("deposit");
  const [userInput, setUserInput] = useState("");
  const [showApproveSpendingModal, setShowApproveSpendingModal] = useState(false);
  const { account } = useEthers();
  const [selectedPid, setSelectedPid] = useState<string>(pid);
  const selectedVault = multipleVaults ? multipleVaults.find(vault => vault.pid === selectedPid)! : props.data;

  const [termsOfUse, setTermsOfUse] = useState(false);
  const { tokenPrices, withdrawSafetyPeriod } = useVaults();

  let userInputValue: BigNumber | undefined = undefined;
  try {
    userInputValue = parseUnits(userInput!, selectedVault.stakingTokenDecimals);
  } catch {
    // TODO: do something
    // userInputValue = BigNumber.from(0);
  }
  const isAboveMinimumDeposit = userInputValue ? userInputValue.gte(BigNumber.from(MINIMUM_DEPOSIT)) : false;
  const tokenBalance = useTokenBalance(selectedVault?.stakingToken, account);
  const formattedTokenBalance = tokenBalance ? formatUnits(tokenBalance, selectedVault?.stakingTokenDecimals) : "-";
  const notEnoughBalance = userInputValue && tokenBalance ? userInputValue.gt(tokenBalance) : false;
  const pendingReward = usePendingReward(master.address, pid, account!);
  const pendingRewardFormat = pendingReward ? millify(Number(formatEther(pendingReward)), { precision: 3 }) : "-";
  const availableToWithdraw = useUserSharesPerVault(master.address, selectedPid, account!);
  const shares = availableToWithdraw?.toString();
  const formatAvailableToWithdraw = availableToWithdraw ? formatUnits(availableToWithdraw, selectedVault?.stakingTokenDecimals) : "-";
  const canWithdraw = availableToWithdraw && Number(formatUnits(availableToWithdraw, selectedVault?.stakingTokenDecimals)) >= Number(userInput);
  const withdrawRequestTime = useWithdrawRequestInfo(master.address, selectedPid, account!);
  const pendingWithdraw = isDateBefore(withdrawRequestTime?.toString());
  const endDate = moment.unix(withdrawRequestTime?.toNumber() ?? 0).add(master.withdrawRequestEnablePeriod.toString(), "seconds").unix();
  const isWithdrawable = isDateBetween(withdrawRequestTime?.toString(), endDate);

  const { send: approveToken, state: approveTokenState } = useTokenApprove(stakingToken);
  const handleApproveToken = async (amountToSpend?: BigNumber) => {
    approveToken(master.address, amountToSpend ?? MAX_SPENDING,);
  }

  const allowance = useTokenAllowance(stakingToken, account!, master.address)
  const hasAllowance = userInputValue ? allowance?.gte(userInputValue) : false;

  const { send: depositAndClaim, state: depositAndClaimState } = useDepositAndClaim(master.address);
  const handleDepositAndClaim = useCallback(async () => {
    depositAndClaim(selectedPid, userInputValue);
  }, [selectedPid, userInputValue, depositAndClaim])

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
    withdrawAndClaim(selectedPid, calculateActualWithdrawValue(availableToWithdraw, userInputValue, shares));
  }, [availableToWithdraw, userInputValue, shares, selectedPid, withdrawAndClaim]);

  const { send: withdrawRequestCall, state: withdrawRequestState } = useWithdrawRequest(master.address);
  const handleWithdrawRequest = async () => {
    withdrawRequestCall(selectedPid);
  }

  const { send: claimReward, state: claimRewardState } = useClaimReward(master.address);
  const handleClaimReward = async () => {
    claimReward(selectedPid);
  }

  const { send: checkIn, state: checkInState } = useCheckIn(master.address)
  const handleCheckIn = () => {
    checkIn(selectedPid)
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

  const isCommitteMultisig = committee.toLowerCase() === account?.toLowerCase();

  return (
    <div className={depositWithdrawWrapperClass}>
      <div className="tabs-wrapper">
        <button className={tab === "deposit" ? "tab selected" : "tab"} onClick={() => { setTab("deposit"); setUserInput(""); }}>DEPOSIT</button>
        <button className={tab === "withdraw" ? "tab selected" : "tab"} onClick={() => { setTab("withdraw"); setUserInput(""); }}>WITHDRAW</button>
      </div>
      <div className="balance-wrapper">
        {tab === "deposit" && `Balance: ${!tokenBalance ? "-" : millify(Number(formattedTokenBalance))} ${selectedVault?.stakingTokenSymbol}`}
        {tab === "withdraw" && `Balance to withdraw: ${!availableToWithdraw ? "-" : millify(Number(formatUnits(availableToWithdraw, selectedVault.stakingTokenDecimals)))} ${selectedVault?.stakingTokenSymbol}`}
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
        <div className="amount-wrapper">
          <div className="top">
            <span>Vault token</span>
            <span>&#8776; {!tokenPrices?.[stakingToken] ? "-" : `$${millify(tokenPrices?.[stakingToken], { precision: 3 })}`}</span>
          </div>
          <div className="input-wrapper">
            <div className="pool-token">
              <TokenSelect
                vault={props.data}
                onSelect={pid => setSelectedPid(pid)} />
            </div>
            <input disabled={!committeeCheckedIn} placeholder="0.0" type="number" value={userInput} onChange={(e) => { isDigitsOnly(e.target.value) && setUserInput(e.target.value) }} min="0" onClick={(e) => (e.target as HTMLInputElement).select()} />
          </div>
          {tab === "deposit" && !isAboveMinimumDeposit && userInput && <span className="input-error">{`Minimum deposit is ${formatUnits(String(MINIMUM_DEPOSIT), stakingTokenDecimals)}`}</span>}
          {tab === "deposit" && notEnoughBalance && <span className="input-error">Insufficient funds</span>}
          {tab === "withdraw" && !canWithdraw && <span className="input-error">Can't withdraw more than available</span>}
        </div>
      </div>
      <Assets vault={props.data} />
      {tab === "deposit" && (
        <div className={`terms-of-use-wrapper ${(!userInput || userInput === "0") && "disabled"}`}>
          <input type="checkbox" checked={termsOfUse} onChange={() => setTermsOfUse(!termsOfUse)} disabled={!userInput || userInput === "0"} />
          <label>I UNDERSTAND AND AGREE TO THE <u><a target="_blank" rel="noopener noreferrer" href={TERMS_OF_USE}>TERMS OF USE</a></u></label>
        </div>
      )}
      {!committeeCheckedIn && <span className="extra-info-wrapper">COMMITTEE IS NOT CHECKED IN YET!</span>}
      {depositPause && <span className="extra-info-wrapper">DEPOSIT PAUSE IS IN EFFECT!</span>}
      {tab === "withdraw" && withdrawSafetyPeriod?.isSafetyPeriod && isWithdrawable && !pendingWithdraw && <span className="extra-info-wrapper">SAFE PERIOD IS ON. WITHDRAWAL IS NOT AVAILABLE DURING SAFE PERIOD</span>}
      {tab === "deposit" && (isWithdrawable || pendingWithdraw) && <span className="extra-info-wrapper">DEPOSIT WILL CANCEL THE WITHDRAWAL REQUEST</span>}
      <div className="action-btn-wrapper">
        {tab === "deposit" && showApproveSpendingModal &&
          <ApproveToken
            approveToken={handleApproveToken}
            userInput={userInput}
            hideApproveSpending={() => setShowApproveSpendingModal(false)}
            stakingTokenDecimals={stakingTokenDecimals} />}
        {tab === "deposit" &&
          <button
            disabled={notEnoughBalance || !userInput || userInput === "0" || !termsOfUse || !isAboveMinimumDeposit || !committeeCheckedIn || depositPause || !isSupportedNetwork}
            className="action-btn"
            onClick={async () => await tryDeposit()}>
            {`DEPOSIT ${!pendingReward || pendingReward.eq(0) ? "" : `AND CLAIM ${pendingRewardFormat} HATS`}`}
          </button>}
        {tab === "withdraw" && isWithdrawable && !pendingWithdraw &&
          <button
            disabled={!canWithdraw || !userInput || userInput === "0" || withdrawSafetyPeriod?.isSafetyPeriod || !committeeCheckedIn}
            className="action-btn"
            onClick={async () => await handleWithdrawAndClaim()}>
            {`WITHDRAW ${!pendingReward || pendingReward.eq(0) ?
              "" : `AND CLAIM ${pendingRewardFormat} HATS`}`}
          </button>}
        {tab === "withdraw" && !pendingWithdraw && !isWithdrawable && !pendingWithdraw &&
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
