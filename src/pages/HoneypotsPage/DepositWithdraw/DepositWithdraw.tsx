import { useState, useEffect, useCallback } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import millify from "millify";
import classNames from "classnames";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { isDigitsOnly } from "../../../utils";
import { Loading, Modal } from "components";
import { IVault } from "../../../types/types";
import { TERMS_OF_USE, MAX_SPENDING } from "../../../constants/constants";
import {
  useCheckIn,
  useClaimReward,
  useDepositAndClaim,
  useTokenApprove,
  useWithdrawAndClaim,
  useWithdrawRequest,
} from "hooks/contractHooksCalls";
import Assets from "./Assets/Assets";
import { calculateActualWithdrawValue } from "./utils";
import { useVaults } from "hooks/useVaults";
import { usePrevious } from "hooks/usePrevious";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";
import "./index.scss";
import EmbassyNftTicketPrompt from "components/EmbassyNftTicketPrompt/EmbassyNftTicketPrompt";
import useModal from "hooks/useModal";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { ApproveToken, EmbassyEligibility, TokenSelect } from ".";
import { useTranslation } from "react-i18next";
import { useVaultDepositWithdrawInfo } from "./hooks";

interface IProps {
  vault: IVault;
  setShowModal: Function;
}

enum Tab {
  Deposit = 1,
  Withdraw,
}

export function DepositWithdraw({ vault, setShowModal }: IProps) {
  const { t } = useTranslation();
  const isSupportedNetwork = useSupportedNetwork();
  const { tokenPrices, withdrawSafetyPeriod, nftData } = useVaults();
  const { id, master, stakingToken, stakingTokenDecimals, multipleVaults, depositPause } = vault;

  const { isShowing: isShowingEmbassyPrompt, toggle: toggleEmbassyPrompt } = useModal();
  const { isShowing: isShowingApproveSpending, hide: hideApproveSpending, show: showApproveSpending } = useModal();

  const [tab, setTab] = useState(Tab.Deposit);
  const [termsOfUse, setTermsOfUse] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [selectedId, setSelectedId] = useState<string>(id);
  const selectedVault = multipleVaults ? multipleVaults.find((vault) => vault.id === selectedId)! : vault;

  // const allowance = useTokenAllowance(stakingToken, account!, master.address); // READY
  // const tokenBalance = useTokenBalance(selectedVault?.stakingToken, account); // READY
  // const tokenBalanceFormatted = tokenBalance ? formatUnits(tokenBalance, selectedVault?.stakingTokenDecimals) : "-"; // READY
  // const pendingReward = usePendingReward(master.address, pid, account!); // READY
  // const pendingRewardFormatted = pendingReward ? millify(Number(formatEther(pendingReward)), { precision: 3 }) : "-"; // READY
  // const availableToWithdraw = useUserSharesPerVault(master.address, selectedVault, account!); // READY
  // const availableToWithdrawFormatted = availableToWithdraw
  //   ? formatUnits(availableToWithdraw, selectedVault?.stakingTokenDecimals)
  //   : "-"; // READY
  // const withdrawRequestTime = useWithdrawRequestInfo(master.address, selectedVault, account); // READY
  // const pendingWithdraw = isDateBefore(withdrawRequestTime?.toString());
  // const endDate = moment
  //   .unix(withdrawRequestTime?.toNumber() ?? 0)
  //   .add(master.withdrawRequestEnablePeriod.toString(), "seconds")
  //   .unix();
  // const isWithdrawable = isDateBetween(withdrawRequestTime?.toString(), endDate);

  const {
    tokenAllowanceAmount,
    tokenBalance,
    pendingReward,
    availableToWithdraw,
    isUserInQueueToWithdraw,
    isUserOnTimeToWithdraw,
    committeeCheckedIn,
    userIsCommitteeAndCanCheckIn,
    minimumDeposit,
  } = useVaultDepositWithdrawInfo(vault, selectedVault);

  console.log(minimumDeposit);

  let userInputValue: BigNumber | undefined = undefined;
  try {
    userInputValue = parseUnits(userInput!, selectedVault.stakingTokenDecimals);
  } catch {
    // TODO: do something
    console.log("asdasd");
    userInputValue = BigNumber.from(0);
  }

  const hasAllowance = userInputValue ? tokenAllowanceAmount?.gte(userInputValue) : false;
  const isAboveMinimumDeposit = userInputValue ? userInputValue.gte(minimumDeposit.bigNumber) : false;
  const userHasBalanceToDeposit = userInputValue && tokenBalance ? userInputValue.gt(tokenBalance.bigNumber) : false;
  const userHasBalanceToWithdraw = availableToWithdraw && availableToWithdraw.number >= Number(userInput);

  const { send: approveToken, state: approveTokenState } = useTokenApprove(stakingToken);
  const handleApproveToken = async (amountToSpend?: BigNumber) => {
    approveToken(master.address, amountToSpend ?? MAX_SPENDING);
  };

  const { send: depositAndClaim, state: depositAndClaimState } = useDepositAndClaim(vault);
  const handleDepositAndClaim = useCallback(async () => {
    if (!userInputValue) return;

    await depositAndClaim(userInputValue);
    const depositEligibility = await nftData?.refreshProofAndRedeemed({ pid: selectedVault.pid, masterAddress: master.address });
    const newRedeemables = depositEligibility?.filter(
      (nft) => !nft.isRedeemed && !nftData?.proofRedeemables?.find((r) => r.tokenId.eq(nft.tokenId))
    );
    if (newRedeemables?.length) {
      toggleEmbassyPrompt();
    }
    setUserInput("");
    setTermsOfUse(false);
  }, [selectedVault, userInputValue, depositAndClaim, master.address, nftData, toggleEmbassyPrompt]);

  const tryDeposit = useCallback(async () => {
    if (!hasAllowance) {
      showApproveSpending();
    } else {
      handleDepositAndClaim();
    }
  }, [showApproveSpending, handleDepositAndClaim, hasAllowance]);

  const { send: withdrawAndClaim, state: withdrawAndClaimState } = useWithdrawAndClaim(master.address);

  const handleWithdrawAndClaim = useCallback(async () => {
    withdrawAndClaim(
      selectedVault.pid,
      // TODO:[v2] check if this 'calculateActualWithdrawValue' function is correct
      calculateActualWithdrawValue(availableToWithdraw?.bigNumber, userInputValue, availableToWithdraw?.bigNumber)
    );
    // refresh deposit eligibility
    await nftData?.refreshProofAndRedeemed({ pid: selectedVault.pid, masterAddress: master.address });
  }, [availableToWithdraw, userInputValue, selectedVault, withdrawAndClaim, master, nftData]);

  const { send: withdrawRequestCall, state: withdrawRequestState } = useWithdrawRequest(master.address);
  const handleWithdrawRequest = () => withdrawRequestCall(selectedVault.pid);

  const { send: claimReward, state: claimRewardState } = useClaimReward(master.address);
  const handleClaimReward = () => claimReward(selectedVault.pid);

  const { send: checkIn, state: checkInState } = useCheckIn(master.address);
  const handleCheckIn = () => checkIn(selectedVault.pid);

  const transactionStates = [
    approveTokenState,
    depositAndClaimState,
    withdrawAndClaimState,
    withdrawRequestState,
    claimRewardState,
    checkInState,
  ];

  const keepModalOpen = [withdrawRequestState, approveTokenState, depositAndClaimState];
  const inTransaction = transactionStates
    .filter((state) => !keepModalOpen.includes(state))
    .some((state) => state.status === "Mining");
  const pendingWallet = transactionStates.some((state) => state.status === "PendingSignature" || state.status === "Mining");
  const prevApproveTokenState = usePrevious(approveTokenState);

  // after successful approve transaction immediatly call deposit and claim
  useEffect(() => {
    if (approveTokenState.status === "Success" && prevApproveTokenState?.status !== approveTokenState.status) {
      handleDepositAndClaim();
    }
  }, [approveTokenState, prevApproveTokenState, handleDepositAndClaim]);

  useEffect(() => {
    if (inTransaction) setShowModal(false);
  }, [inTransaction, setShowModal]);

  const handleChangeTab = (tab: Tab) => {
    setTab(tab);
    setUserInput("");
  };

  const handleMaxAmountButton = () => {
    const maxAmount = tab === Tab.Deposit ? tokenBalance.number : availableToWithdraw.number;
    setUserInput(`${maxAmount}`);
  };

  return (
    <div className={classNames("deposit-wrapper", { disabled: pendingWallet })}>
      <div className="tabs-wrapper">
        <button className={classNames("tab", { selected: tab === Tab.Deposit })} onClick={() => handleChangeTab(Tab.Deposit)}>
          {t("deposit").toUpperCase()}
        </button>
        <button className={classNames("tab", { selected: tab === Tab.Withdraw })} onClick={() => handleChangeTab(Tab.Withdraw)}>
          {t("withdraw").toUpperCase()}
        </button>
      </div>

      <div className="balance-wrapper">
        {tab === Tab.Deposit && `Balance: ${tokenBalance.formatted}`}
        {tab === Tab.Withdraw && `Balance to withdraw: ${availableToWithdraw.formatted}`}
        <button className="max-button" disabled={!committeeCheckedIn} onClick={handleMaxAmountButton}>
          (Max)
        </button>
      </div>
      <div>
        <div className="amount-wrapper">
          <div className="top">
            <span>Vault token</span>
            <span>
              &#8776; {!tokenPrices?.[stakingToken] ? "-" : `$${millify(tokenPrices?.[stakingToken], { precision: 3 })}`}
            </span>
          </div>
          <div className="input-wrapper">
            <div className="pool-token">
              <TokenSelect vault={vault} onSelect={(pid) => setSelectedId(pid)} />
            </div>
            <input
              disabled={!committeeCheckedIn}
              placeholder="0.0"
              type="number"
              value={userInput}
              onChange={(e) => {
                isDigitsOnly(e.target.value) && setUserInput(e.target.value);
              }}
              min="0"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>
          {tab === Tab.Deposit && !isAboveMinimumDeposit && userInput && (
            <span className="input-error">{`Minimum deposit is ${minimumDeposit.formatted}`}</span>
          )}
          {tab === Tab.Deposit && userHasBalanceToDeposit && <span className="input-error">Insufficient funds</span>}
          {tab === Tab.Withdraw && !userHasBalanceToWithdraw && (
            <span className="input-error">Can't withdraw more than available</span>
          )}
        </div>
      </div>
      {tab === Tab.Deposit && !inTransaction && <EmbassyEligibility vault={selectedVault} />}
      <div>
        <Assets vault={vault} />
      </div>
      {tab === Tab.Deposit && (
        <div className={`terms-of-use-wrapper ${(!userInput || userInput === "0") && "disabled"}`}>
          <input
            type="checkbox"
            checked={termsOfUse}
            onChange={() => setTermsOfUse(!termsOfUse)}
            disabled={!userInput || userInput === "0"}
          />
          <label>
            I UNDERSTAND AND AGREE TO THE{" "}
            <u>
              <a {...defaultAnchorProps} href={TERMS_OF_USE}>
                TERMS OF USE
              </a>
            </u>
          </label>
        </div>
      )}
      {!committeeCheckedIn && <span className="extra-info-wrapper">COMMITTEE IS NOT CHECKED IN YET!</span>}
      {depositPause && <span className="extra-info-wrapper">DEPOSIT PAUSE IS IN EFFECT!</span>}
      {tab === Tab.Withdraw && withdrawSafetyPeriod?.isSafetyPeriod && isUserOnTimeToWithdraw && !isUserInQueueToWithdraw && (
        <span className="extra-info-wrapper">SAFE PERIOD IS ON. WITHDRAWAL IS NOT AVAILABLE DURING SAFE PERIOD</span>
      )}
      {tab === Tab.Deposit && (isUserOnTimeToWithdraw || isUserInQueueToWithdraw) && (
        <span className="extra-info-wrapper">DEPOSIT WILL CANCEL THE WITHDRAWAL REQUEST</span>
      )}
      <div className="action-btn-wrapper">
        {tab === Tab.Deposit && (
          <button
            disabled={
              userHasBalanceToDeposit ||
              !userInput ||
              userInput === "0" ||
              !termsOfUse ||
              !isAboveMinimumDeposit ||
              !committeeCheckedIn ||
              depositPause ||
              !isSupportedNetwork
            }
            className="action-btn"
            onClick={async () => await tryDeposit()}>
            {`DEPOSIT ${!pendingReward || pendingReward.bigNumber.eq(0) ? "" : `AND CLAIM ${pendingReward.formatted}`}`}
          </button>
        )}
        {tab === Tab.Withdraw && isUserOnTimeToWithdraw && !isUserInQueueToWithdraw && (
          <button
            disabled={
              !userHasBalanceToWithdraw ||
              !userInput ||
              userInput === "0" ||
              withdrawSafetyPeriod?.isSafetyPeriod ||
              !committeeCheckedIn
            }
            className="action-btn"
            onClick={async () => await handleWithdrawAndClaim()}>
            {`WITHDRAW ${!pendingReward || pendingReward.bigNumber.eq(0) ? "" : `AND CLAIM ${pendingReward.formatted}`}`}
          </button>
        )}
        {tab === Tab.Withdraw && !isUserInQueueToWithdraw && !isUserOnTimeToWithdraw && !isUserInQueueToWithdraw && (
          <button
            disabled={!userHasBalanceToWithdraw || availableToWithdraw.bigNumber.eq(0) || !committeeCheckedIn}
            className="action-btn"
            onClick={async () => await handleWithdrawRequest()}>
            WITHDRAWAL REQUEST
          </button>
        )}
        {userIsCommitteeAndCanCheckIn && (
          <button onClick={handleCheckIn} className="action-btn">
            CHECK IN
          </button>
        )}
        <button
          onClick={async () => await handleClaimReward()}
          disabled={!pendingReward || pendingReward.bigNumber.eq(0)}
          className="action-btn claim-btn fill">
          {`CLAIM ${pendingReward?.formatted}`}
        </button>
      </div>

      {pendingWallet && <Loading zIndex={10000} />}

      <Modal isShowing={isShowingEmbassyPrompt} onHide={toggleEmbassyPrompt}>
        <EmbassyNftTicketPrompt />
      </Modal>

      <Modal isShowing={isShowingApproveSpending} onHide={hideApproveSpending} zIndex={1}>
        <ApproveToken approveToken={handleApproveToken} userInput={userInput} stakingTokenDecimals={stakingTokenDecimals} />
      </Modal>
    </div>
  );
}
