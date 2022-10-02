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
import { usePrevious } from "hooks/usePrevious";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";
import "./index.scss";
import EmbassyEligibility from "./EmbassyEligibility/EmbassyEligibility";
import Modal from "components/Shared/Modal/Modal";
import EmbassyNftTicketPrompt from "components/EmbassyNftTicketPrompt/EmbassyNftTicketPrompt";
import useModal from "hooks/useModal";
import { useTranslation } from "react-i18next";

interface IProps {
  data: IVault
  setShowModal: Function
}

enum Tab {
  Deposit = 1,
  Withdraw
}

export default function DepositWithdraw(props: IProps) {
  const { t } = useTranslation();
  const isSupportedNetwork = useSupportedNetwork();
  const { pid, master, stakingToken, stakingTokenDecimals, multipleVaults, committee,
    committeeCheckedIn, depositPause } = props.data;
  const { setShowModal } = props;
  const { isShowing: showEmbassyPrompt, toggle: toggleEmbassyPrompt } = useModal();
  const [tab, setTab] = useState(Tab.Deposit);
  const [userInput, setUserInput] = useState("");
  const [showApproveSpendingModal, setShowApproveSpendingModal] = useState(false);
  const { account } = useEthers();
  const [selectedPid, setSelectedPid] = useState<string>(pid);
  const selectedVault = multipleVaults ? multipleVaults.find(vault => vault.pid === selectedPid)! : props.data;

  const [termsOfUse, setTermsOfUse] = useState(false);
  const { tokenPrices, withdrawSafetyPeriod, nftData } = useVaults();

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
    setUserInput("");
    await depositAndClaim(selectedPid, userInputValue);
    const depositEligibility = await nftData?.refreshProofAndRedeemed({ pid: selectedPid, masterAddress: master.address });
    const newRedeemables = depositEligibility?.filter(nft => !nft.isRedeemed &&
      !nftData?.proofRedeemables?.find(r =>
        r.tokenId.eq(nft.tokenId)))
    if (newRedeemables?.length) {
      toggleEmbassyPrompt();
    }
    setUserInput("");
    setTermsOfUse(false);
  }, [selectedPid, userInputValue, depositAndClaim, master.address, nftData, toggleEmbassyPrompt]);

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
    // refresh deposit eligibility
    await nftData?.refreshProofAndRedeemed({ pid: selectedPid, masterAddress: master.address });
  }, [availableToWithdraw, userInputValue, shares, selectedPid, withdrawAndClaim, master.address, nftData]);

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

  const keepModalOpen = [withdrawRequestState, approveTokenState, depositAndClaimState];
  const inTransaction = transactionStates.filter(state => !keepModalOpen.includes(state)).some(state => state.status === 'Mining');
  const pendingWallet = transactionStates.some(state => state.status === "PendingSignature" || state.status === "Mining");
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

  const isCommitteMultisig = committee.toLowerCase() === account?.toLowerCase();

  return (
    <div className={classNames("deposit-wrapper", { "disabled": pendingWallet })}>
      <div className="tabs-wrapper">
        <button className={classNames("tab", { "selected": tab === Tab.Deposit })} onClick={() => { setTab(Tab.Deposit); setUserInput(""); }}>{t("DepositWithdraw.deposit")}</button>
        <button className={classNames("tab", { "selected": tab === Tab.Withdraw })} onClick={() => { setTab(Tab.Withdraw); setUserInput(""); }}>{t("DepositWithdraw.withdraw")}</button>
      </div>
      <div className="balance-wrapper">
        {tab === Tab.Deposit && `${t("DepositWithdraw.text-11")} ${!tokenBalance ? "-" : millify(Number(formattedTokenBalance))} ${selectedVault?.stakingTokenSymbol}`}
        {tab === Tab.Withdraw && `${t("DepositWithdraw.text-12")} ${!availableToWithdraw ? "-" : millify(Number(formatUnits(availableToWithdraw, selectedVault.stakingTokenDecimals)))} ${selectedVault?.stakingTokenSymbol}`}
        <button
          className="max-button"
          disabled={!committeeCheckedIn}
          onClick={() => setUserInput(
            tab === Tab.Deposit ?
              formattedTokenBalance :
              formatAvailableToWithdraw)}>
          ({t("DepositWithdraw.max")})
        </button>
      </div>
      <div>
        <div className="amount-wrapper">
          <div className="top">
            <span>{t("DepositWithdraw.text-0")}</span>
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
          {tab === Tab.Deposit && !isAboveMinimumDeposit && userInput && <span className="input-error">{`Minimum deposit is ${formatUnits(String(MINIMUM_DEPOSIT), stakingTokenDecimals)}`}</span>}
          {tab === Tab.Deposit && notEnoughBalance && <span className="input-error">{t("DepositWithdraw.text-1")}</span>}
          {tab === Tab.Withdraw && !canWithdraw && <span className="input-error">{t("DepositWithdraw.text-2")}</span>}
        </div>
      </div>
      {tab === Tab.Deposit && !inTransaction && <EmbassyEligibility vault={selectedVault} />}
      <Assets vault={props.data} />
      {tab === Tab.Deposit && (
        <div className={`terms-of-use-wrapper ${(!userInput || userInput === "0") && "disabled"}`}>
          <input type="checkbox" checked={termsOfUse} onChange={() => setTermsOfUse(!termsOfUse)} disabled={!userInput || userInput === "0"} />
          <label>{t("DepositWithdraw.text-3")} <u><a target="_blank" rel="noopener noreferrer" href={TERMS_OF_USE}>{t("DepositWithdraw.text-4")}</a></u></label>
        </div>
      )}
      {!committeeCheckedIn && <span className="extra-info-wrapper">{t("DepositWithdraw.text-5")}</span>}
      {depositPause && <span className="extra-info-wrapper">{t("DepositWithdraw.text-6")}</span>}
      {tab === Tab.Withdraw && withdrawSafetyPeriod?.isSafetyPeriod && isWithdrawable && !pendingWithdraw && <span className="extra-info-wrapper">{t("DepositWithdraw.text-7")}</span>}
      {tab === Tab.Deposit && (isWithdrawable || pendingWithdraw) && <span className="extra-info-wrapper">{t("DepositWithdraw.text-8")}</span>}
      <div className="action-btn-wrapper">
        {tab === Tab.Deposit && showApproveSpendingModal &&
          <ApproveToken
            approveToken={handleApproveToken}
            userInput={userInput}
            hideApproveSpending={() => setShowApproveSpendingModal(false)}
            stakingTokenDecimals={stakingTokenDecimals} />}
        {tab === Tab.Deposit &&
          <button
            disabled={notEnoughBalance || !userInput || userInput === "0" || !termsOfUse || !isAboveMinimumDeposit || !committeeCheckedIn || depositPause || !isSupportedNetwork}
            className="action-btn"
            onClick={async () => await tryDeposit()}>
            {`${t("DepositWithdraw.deposit")} ${!pendingReward || pendingReward.eq(0) ? "" : `${t("DepositWithdraw.and-claim")} ${pendingRewardFormat} HATS`}`}
          </button>}
        {tab === Tab.Withdraw && isWithdrawable && !pendingWithdraw &&
          <button
            disabled={!canWithdraw || !userInput || userInput === "0" || withdrawSafetyPeriod?.isSafetyPeriod || !committeeCheckedIn}
            className="action-btn"
            onClick={async () => await handleWithdrawAndClaim()}>
            {`${t("DepositWithdraw.withdraw")} ${!pendingReward || pendingReward.eq(0) ?
              "" : `${t("DepositWithdraw.and-claim")} ${pendingRewardFormat} HATS`}`}
          </button>}
        {tab === Tab.Withdraw && !pendingWithdraw && !isWithdrawable && !pendingWithdraw &&
          <button
            disabled={!canWithdraw || availableToWithdraw.eq(0) || !committeeCheckedIn}
            className="action-btn"
            onClick={async () => await handleWithdrawRequest()}>{t("DepositWithdraw.text-9")}</button>}
        {isCommitteMultisig && !committeeCheckedIn && <button onClick={handleCheckIn} className="action-btn">{t("DepositWithdraw.text-10")}</button>}
        <button
          onClick={async () => await handleClaimReward()}
          disabled={!pendingReward || pendingReward.eq(0)}
          className="action-btn claim-btn fill">
          {`${t("DepositWithdraw.claim")} ${pendingRewardFormat} HATS`}
        </button>
      </div>
      {pendingWallet && <Loading zIndex={10000} />}
      <Modal
        isShowing={showEmbassyPrompt}
        hide={toggleEmbassyPrompt}>
        <EmbassyNftTicketPrompt />
      </Modal>
    </div>
  )
}
