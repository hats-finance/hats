import { useState, useEffect, useCallback } from "react";
import millify from "millify";
import classNames from "classnames";
import { parseUnits } from "@ethersproject/units";
import { Loading, Modal } from "components";
import { IVault } from "types/types";
import { TERMS_OF_USE, MAX_SPENDING } from "constants/constants";
import {
  useCommitteeCheckIn,
  useClaimReward,
  useDeposit,
  useTokenApproveAllowance,
  useWithdrawAndClaim,
  useWithdrawRequest,
} from "hooks/contractHooksCalls";
import UserAssetsInfo from "./UserAssetsInfo/UserAssetsInfo";
import { useVaults } from "hooks/vaults/useVaults";
import { usePrevious } from "hooks/usePrevious";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";
import "./index.scss";
import EmbassyNftTicketPrompt from "components/EmbassyNftTicketPrompt/EmbassyNftTicketPrompt";
import useModal from "hooks/useModal";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { ApproveToken, EmbassyEligibility, TokenSelect } from ".";
import { useTranslation } from "react-i18next";
import { useVaultDepositWithdrawInfo } from "./hooks";
import { BigNumber } from "ethers";

interface IProps {
  vault: IVault;
  closeModal: Function;
}

enum Tab {
  Deposit = 1,
  Withdraw,
}

export function DepositWithdraw({ vault, closeModal }: IProps) {
  const { t } = useTranslation();
  const isSupportedNetwork = useSupportedNetwork();
  const { tokenPrices, withdrawSafetyPeriod, nftData } = useVaults();
  const { id, master, stakingToken, stakingTokenDecimals, multipleVaults } = vault;

  const { isShowing: isShowingEmbassyPrompt, toggle: toggleEmbassyPrompt } = useModal();
  const { isShowing: isShowingApproveSpending, hide: hideApproveSpending, show: showApproveSpending } = useModal();

  const [tab, setTab] = useState(Tab.Deposit);
  const [termsOfUse, setTermsOfUse] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [selectedId, setSelectedId] = useState<string>(id);
  const selectedVault = multipleVaults ? multipleVaults.find((vault) => vault.id === selectedId)! : vault;

  const {
    tokenAllowanceAmount,
    tokenBalance,
    pendingReward,
    availableBalanceToWithdraw,
    isUserInQueueToWithdraw,
    isUserInTimeToWithdraw,
    committeeCheckedIn,
    userIsCommitteeAndCanCheckIn,
    minimumDeposit,
    depositPaused,
  } = useVaultDepositWithdrawInfo(selectedVault);

  let userInputValue: BigNumber | undefined = undefined;
  try {
    userInputValue = parseUnits(userInput!, selectedVault.stakingTokenDecimals);
  } catch {
    userInputValue = BigNumber.from(0);
  }

  const hasAllowance = userInputValue && tokenAllowanceAmount ? tokenAllowanceAmount.gte(userInputValue) : false;
  const isAboveMinimumDeposit = userInputValue ? userInputValue.gte(minimumDeposit.bigNumber) : false;
  const userHasBalanceToDeposit = userInputValue && tokenBalance ? tokenBalance.bigNumber.gte(userInputValue) : false;
  const userHasBalanceToWithdraw = availableBalanceToWithdraw && availableBalanceToWithdraw.bigNumber.gte(userInputValue);

  const isDepositing = tab === Tab.Deposit;
  const isWithdrawing = tab === Tab.Withdraw;

  const { send: approveTokenAllowanceCall, state: approveTokenAllowanceState } = useTokenApproveAllowance(selectedVault);
  const handleApproveTokenAllowance = (amountToSpend?: BigNumber) => {
    approveTokenAllowanceCall(amountToSpend ?? MAX_SPENDING);
  };

  const { send: depositCall, state: depositState } = useDeposit(selectedVault);
  const handleDeposit = useCallback(async () => {
    if (!userInputValue) return;

    await depositCall(userInputValue);
    setUserInput("");
    setTermsOfUse(false);

    const depositEligibility = await nftData?.refreshProofAndRedeemed({ pid: selectedVault.pid, masterAddress: master.address });
    const newRedeemables = depositEligibility?.filter(
      (nft) => !nft.isRedeemed && !nftData?.proofRedeemables?.find((r) => r.tokenId.eq(nft.tokenId))
    );
    if (newRedeemables?.length) {
      toggleEmbassyPrompt();
    }
  }, [selectedVault, userInputValue, depositCall, master.address, nftData, toggleEmbassyPrompt]);

  const { send: withdrawAndClaimCall, state: withdrawAndClaimState } = useWithdrawAndClaim(selectedVault);
  const handleWithdrawAndClaim = useCallback(async () => {
    if (!userInputValue) return;
    withdrawAndClaimCall(userInputValue);

    // refresh deposit eligibility
    await nftData?.refreshProofAndRedeemed({ pid: selectedVault.pid, masterAddress: master.address });
  }, [userInputValue, selectedVault, withdrawAndClaimCall, master, nftData]);

  const { send: withdrawRequestCall, state: withdrawRequestState } = useWithdrawRequest(selectedVault);
  const handleWithdrawRequest = withdrawRequestCall;

  const { send: claimRewardCall, state: claimRewardState } = useClaimReward(selectedVault);
  const handleClaimReward = claimRewardCall;

  const { send: checkInCall, state: checkInState } = useCommitteeCheckIn(selectedVault);
  const handleCheckIn = checkInCall;

  const transactionStates = [
    approveTokenAllowanceState,
    depositState,
    withdrawAndClaimState,
    withdrawRequestState,
    claimRewardState,
    checkInState,
  ];

  const keepModalOpen = [withdrawRequestState, approveTokenAllowanceState, depositState];
  const inTransaction = transactionStates
    .filter((state) => !keepModalOpen.includes(state))
    .some((state) => state.status === "Mining");
  const pendingWallet = transactionStates.some((state) => state.status === "PendingSignature" || state.status === "Mining");
  const prevApproveTokenState = usePrevious(approveTokenAllowanceState);

  // After successful approve transaction immediatly call deposit and claim
  useEffect(() => {
    if (approveTokenAllowanceState.status === "Success" && prevApproveTokenState?.status !== approveTokenAllowanceState.status) {
      hideApproveSpending();
      handleDeposit();
    }
  }, [approveTokenAllowanceState, prevApproveTokenState, handleDeposit, hideApproveSpending]);

  useEffect(() => {
    if (inTransaction) closeModal();
  }, [inTransaction, closeModal]);

  const handleTryDeposit = useCallback(async () => {
    if (!hasAllowance) {
      showApproveSpending();
    } else {
      handleDeposit();
    }
  }, [showApproveSpending, handleDeposit, hasAllowance]);

  const handleChangeTab = (tab: Tab) => {
    setTab(tab);
    setUserInput("");
  };

  const handleMaxAmountButton = () => {
    const maxAmount = isDepositing ? tokenBalance.string : availableBalanceToWithdraw.string;
    setUserInput(`${maxAmount}`);
  };

  return (
    <div className={classNames("deposit-wrapper", { disabled: pendingWallet })}>
      <div className="tabs-wrapper">
        <button className={classNames("tab", { selected: isDepositing })} onClick={() => handleChangeTab(Tab.Deposit)}>
          {t("deposit").toUpperCase()}
        </button>
        <button className={classNames("tab", { selected: isWithdrawing })} onClick={() => handleChangeTab(Tab.Withdraw)}>
          {t("withdraw").toUpperCase()}
        </button>
      </div>

      <div className="info-banner">
        {!committeeCheckedIn && <div className="extra-info-wrapper">COMMITTEE IS NOT CHECKED IN YET!</div>}
        {depositPaused && isDepositing && <div className="extra-info-wrapper">THIS VAULT IS NOT OPEN TO DEPOSITS</div>}
        {isWithdrawing && withdrawSafetyPeriod?.isSafetyPeriod && isUserInTimeToWithdraw && !isUserInQueueToWithdraw && (
          <div className="extra-info-wrapper">SAFE PERIOD IS ON. WITHDRAWAL IS NOT AVAILABLE DURING SAFE PERIOD</div>
        )}
        {isDepositing && (isUserInTimeToWithdraw || isUserInQueueToWithdraw) && (
          <div className="extra-info-wrapper">DEPOSIT WILL CANCEL THE WITHDRAWAL REQUEST</div>
        )}
      </div>

      <div className="content">
        <div className={`balance-wrapper ${isDepositing && depositPaused ? "disabled" : ""}`}>
          <span>{isDepositing && `Balance: ${tokenBalance.formatted()}`}</span>
          <span>{isWithdrawing && `Balance to withdraw: ${availableBalanceToWithdraw.formatted()}`}</span>
          <button
            className="max-button"
            disabled={!committeeCheckedIn}
            onClick={depositPaused ? () => {} : handleMaxAmountButton}>
            (Max)
          </button>
        </div>
        <div className={`amount-wrapper ${isDepositing && depositPaused ? "disabled" : ""}`}>
          <div className="top">
            <span>Vault asset</span>
            <span>
              &#8776; {!tokenPrices?.[stakingToken] ? "-" : `$${millify(tokenPrices?.[stakingToken], { precision: 3 })}`}
            </span>
          </div>
          <div className="input-wrapper">
            <div className="pool-token">
              <TokenSelect vault={vault} onSelect={(pid) => setSelectedId(pid)} />
            </div>
            <input
              disabled={!committeeCheckedIn || (isDepositing && depositPaused)}
              placeholder="0.0"
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              min="0"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>
          {isDepositing && !isAboveMinimumDeposit && userInput && (
            <span className="input-error">{`Minimum deposit is ${minimumDeposit.formatted()}`}</span>
          )}
          {isDepositing && !userHasBalanceToDeposit && <span className="input-error">Insufficient funds</span>}
          {isWithdrawing && !userHasBalanceToWithdraw && <span className="input-error">Can't withdraw more than available</span>}
        </div>

        {isDepositing && !depositPaused && !inTransaction && <EmbassyEligibility vault={selectedVault} />}

        <div>
          <UserAssetsInfo vault={vault} />
        </div>
        {isDepositing && (
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

        <div className="action-btn-wrapper">
          {isDepositing && (
            <button
              disabled={
                !userHasBalanceToDeposit ||
                !userInput ||
                userInput === "0" ||
                !termsOfUse ||
                !isAboveMinimumDeposit ||
                !committeeCheckedIn ||
                depositPaused ||
                !isSupportedNetwork
              }
              className="action-btn fill"
              onClick={async () => await handleTryDeposit()}>
              {`DEPOSIT ${!pendingReward || pendingReward.bigNumber.eq(0) ? "" : `AND CLAIM ${pendingReward.formatted}`}`}
            </button>
          )}
          {isWithdrawing && isUserInTimeToWithdraw && !isUserInQueueToWithdraw && (
            <button
              disabled={
                !userHasBalanceToWithdraw ||
                !userInput ||
                userInput === "0" ||
                withdrawSafetyPeriod?.isSafetyPeriod ||
                !committeeCheckedIn
              }
              className="action-btn fill"
              onClick={async () => await handleWithdrawAndClaim()}>
              {`WITHDRAW ${!pendingReward || pendingReward.bigNumber.eq(0) ? "" : `AND CLAIM ${pendingReward.formatted()}`}`}
            </button>
          )}
          {isWithdrawing && !isUserInQueueToWithdraw && !isUserInTimeToWithdraw && !isUserInQueueToWithdraw && (
            <button
              disabled={!userHasBalanceToWithdraw || availableBalanceToWithdraw.bigNumber.eq(0) || !committeeCheckedIn}
              className="action-btn fill"
              onClick={async () => await handleWithdrawRequest()}>
              WITHDRAWAL REQUEST
            </button>
          )}
          {userIsCommitteeAndCanCheckIn && (
            <button onClick={handleCheckIn} className="action-btn fill">
              CHECK IN
            </button>
          )}
          {pendingReward && !pendingReward.bigNumber.eq(0) && (
            <button
              onClick={async () => await handleClaimReward()}
              disabled={!pendingReward || pendingReward.bigNumber.eq(0)}
              className="action-btn claim-btn">
              {`CLAIM ${pendingReward?.formatted()}`}
            </button>
          )}
        </div>

        {pendingWallet && <Loading zIndex={10000} />}

        <Modal isShowing={isShowingEmbassyPrompt} onHide={toggleEmbassyPrompt}>
          <EmbassyNftTicketPrompt />
        </Modal>

        <Modal isShowing={isShowingApproveSpending} onHide={hideApproveSpending} zIndex={1}>
          <ApproveToken
            approveToken={handleApproveTokenAllowance}
            userInput={userInput}
            stakingTokenDecimals={stakingTokenDecimals}
          />
        </Modal>
      </div>
    </div>
  );
}
