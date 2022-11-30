import { useState, useEffect, useCallback } from "react";
import { waitForTransaction } from "@wagmi/core";
import { BigNumber } from "ethers";
import { parseUnits } from "@ethersproject/units";
import { useTranslation } from "react-i18next";
import millify from "millify";
import classNames from "classnames";
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
} from "hooks/blockchain/contractsCalls";
import UserAssetsInfo from "./UserAssetsInfo/UserAssetsInfo";
import { useVaults } from "hooks/vaults/useVaults";
import { useSupportedNetwork } from "hooks/blockchain/useSupportedNetwork";
import EmbassyNftTicketPrompt from "components/EmbassyNftTicketPrompt/EmbassyNftTicketPrompt";
import useModal from "hooks/useModal";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { ApproveToken, EmbassyEligibility, TokenSelect } from ".";
import { useVaultDepositWithdrawInfo } from "./hooks";
import "./index.scss";

interface IProps {
  vault: IVault;
  closeModal: Function;
}

enum Tab {
  Deposit,
  Withdraw,
}

enum Action {
  approveTokenAllowance,
  deposit,
  withdrawRequest,
  withdrawAndClaim,
  claimReward,
  checkIn,
}

interface InProgressAction {
  action: Action;
  txHash?: `0x${string}`;
}

export function DepositWithdraw({ vault, closeModal }: IProps) {
  const { t } = useTranslation();
  const isSupportedNetwork = useSupportedNetwork();
  const { tokenPrices, withdrawSafetyPeriod, nftData } = useVaults();
  const { id, master, stakingToken, stakingTokenDecimals, multipleVaults } = vault;

  const { isShowing: isShowingEmbassyPrompt, toggle: toggleEmbassyPrompt } = useModal();
  const { isShowing: isShowingApproveSpending, hide: hideApproveSpending, show: showApproveSpending } = useModal();

  const [inProgressTransaction, setInProgressTransaction] = useState<InProgressAction | undefined>(undefined);
  const [tab, setTab] = useState(Tab.Deposit);
  const [termsOfUse, setTermsOfUse] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [selectedId, setSelectedId] = useState<string>(id);
  const selectedVault = multipleVaults ? multipleVaults.find((vault) => vault.id === selectedId)! : vault;

  const {
    tokenAllowance,
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

  const hasAllowance = userInputValue && tokenAllowance ? tokenAllowance.gte(userInputValue) : false;
  const isAboveMinimumDeposit = userInputValue ? userInputValue.gte(minimumDeposit.bigNumber) : false;
  const userHasBalanceToDeposit = userInputValue && tokenBalance ? tokenBalance.bigNumber.gte(userInputValue) : false;
  const userHasBalanceToWithdraw = availableBalanceToWithdraw && availableBalanceToWithdraw.bigNumber.gte(userInputValue);

  const isDepositing = tab === Tab.Deposit;
  const isWithdrawing = tab === Tab.Withdraw;

  const approveTokenAllowanceCall = useTokenApproveAllowance(selectedVault);
  const handleApproveTokenAllowance = (amountToSpend?: BigNumber) => {
    approveTokenAllowanceCall.send(amountToSpend ?? MAX_SPENDING);
  };

  const depositCall = useDeposit(selectedVault);
  const handleDeposit = useCallback(async () => {
    if (!userInputValue) return;

    await depositCall.send(userInputValue);
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

  const withdrawAndClaimCall = useWithdrawAndClaim(selectedVault);
  const handleWithdrawAndClaim = useCallback(async () => {
    if (!userInputValue) return;
    withdrawAndClaimCall.send(userInputValue);
    setUserInput("");

    // refresh deposit eligibility
    await nftData?.refreshProofAndRedeemed({ pid: selectedVault.pid, masterAddress: master.address });
  }, [userInputValue, selectedVault, withdrawAndClaimCall, master, nftData]);

  const withdrawRequestCall = useWithdrawRequest(selectedVault);
  const handleWithdrawRequest = withdrawRequestCall.send;

  const claimRewardCall = useClaimReward(selectedVault);
  const handleClaimReward = claimRewardCall.send;

  const checkInCall = useCommitteeCheckIn(selectedVault);
  const handleCheckIn = checkInCall.send;

  const actionsMap = {
    [Action.approveTokenAllowance]: approveTokenAllowanceCall,
    [Action.deposit]: depositCall,
    [Action.withdrawRequest]: withdrawRequestCall,
    [Action.withdrawAndClaim]: withdrawAndClaimCall,
    [Action.claimReward]: claimRewardCall,
    [Action.checkIn]: checkInCall,
  };

  const actionsDescription = {
    [Action.approveTokenAllowance]: t("approvingSpending"),
    [Action.deposit]: t("depositing"),
    [Action.withdrawRequest]: t("requestingWithdraw"),
    [Action.withdrawAndClaim]: t("withdrawing"),
    [Action.claimReward]: t("claimingReward"),
    [Action.checkIn]: t("checkingIn"),
  };

  const actionsStatusString = [
    approveTokenAllowanceCall.status,
    depositCall.status,
    withdrawRequestCall.status,
    withdrawAndClaimCall.status,
    claimRewardCall.status,
    checkInCall.status,
  ].join("|");

  useEffect(() => {
    const currentAction = Object.entries(actionsMap).find((action) => ["loading", "success"].includes(action[1].status));

    if (currentAction) {
      const action = +currentAction[0] as Action;
      setInProgressTransaction({ action, txHash: actionsMap[action].data?.hash });
    } else {
      setInProgressTransaction(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionsStatusString]);

  useEffect(() => {
    if (inProgressTransaction) {
      const { action, txHash } = inProgressTransaction;

      if (txHash) {
        waitForTransaction({ hash: txHash }).finally(() => {
          setInProgressTransaction(undefined);
          actionsMap[action].reset();

          // After token allowance approbal we call deposit
          if (action === Action.approveTokenAllowance) {
            hideApproveSpending();
            handleDeposit();
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inProgressTransaction, handleDeposit, hideApproveSpending]);

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

  const getLoaderInformation = () => {
    if (inProgressTransaction) {
      const { action, txHash } = inProgressTransaction;
      if (!txHash) return t("pleaseConfirmTransaction");
      return `${t(actionsDescription[action])}...`;
    }

    return "";
  };

  return (
    <div className={classNames("deposit-wrapper", { disabled: inProgressTransaction })}>
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

        {isDepositing && !depositPaused && <EmbassyEligibility vault={selectedVault} />}

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

        {inProgressTransaction && <Loading fixed extraText={getLoaderInformation()} zIndex={10000} />}

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
