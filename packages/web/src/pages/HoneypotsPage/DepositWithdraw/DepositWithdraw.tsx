import { TransactionReceipt } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import { IVault, isAGnosisSafeTx } from "@hats.finance/shared";
import classNames from "classnames";
import { Loading, Modal } from "components";
import { MAX_SPENDING, TERMS_OF_USE } from "constants/constants";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import {
  CommitteeCheckInContract,
  DepositContract,
  TokenApproveAllowanceContract,
  WithdrawAndClaimContract,
  WithdrawRequestContract,
} from "contracts";
import { BigNumber } from "ethers";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useModal from "hooks/useModal";
import { useSupportedNetwork } from "hooks/wagmi/useSupportedNetwork";
import millify from "millify";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNetwork } from "wagmi";
import { waitForTransaction } from "wagmi/actions";
import { ApproveToken, EmbassyEligibility, TokenSelect } from ".";
import UserAssetsInfo from "./UserAssetsInfo/UserAssetsInfo";
import "./index.scss";
import { useVaultDepositWithdrawInfo } from "./useVaultDepositWithdrawInfo";

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
  txWait?: (confirmations?: number | undefined) => Promise<TransactionReceipt>;
}

export function DepositWithdraw({ vault, closeModal }: IProps) {
  const { t } = useTranslation();
  const isSupportedNetwork = useSupportedNetwork();
  const { chain } = useNetwork();
  const { withdrawSafetyPeriod } = useVaults();
  const { id, stakingTokenDecimals, multipleVaults } = vault;

  const { isShowing: isShowingApproveSpending, hide: hideApproveSpending, show: showApproveSpending } = useModal();

  const [inProgressTransaction, setInProgressTransaction] = useState<InProgressAction | undefined>(undefined);
  const [tab, setTab] = useState(Tab.Deposit);
  const [termsOfUse, setTermsOfUse] = useState(false);
  const [requestingWithdraw, setRequestingWithdraw] = useState(false);
  const [waitingForTransaction, setWaitingForTransaction] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [selectedId, setSelectedId] = useState<string>(id);
  const selectedVault = multipleVaults ? multipleVaults.find((vault) => vault.id === selectedId)! : vault;

  const {
    tokenAllowance,
    tokenBalance,
    availableBalanceToWithdraw,
    isUserInQueueToWithdraw,
    isUserInTimeToWithdraw,
    committeeCheckedIn,
    userIsCommitteeAndCanCheckIn,
    minimumDeposit,
    depositPaused,
    userSharesAvailable,
    totalSharesAvailable,
    totalBalanceAvailable,
    availableNftsByDeposit,
    vaultNftRegistered,
    tierFromShares,
    redeem,
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

  const approveTokenAllowanceCall = TokenApproveAllowanceContract.hook(selectedVault);
  const handleApproveTokenAllowance = (amountToSpend?: BigNumber) => {
    approveTokenAllowanceCall.send(amountToSpend ?? MAX_SPENDING);
  };

  const depositCall = DepositContract.hook(selectedVault);
  const handleDeposit = useCallback(async () => {
    if (!userInputValue || !selectedVault.chainId) return;

    await depositCall.send(userInputValue);
    setRequestingWithdraw(false);
    setUserInput("");
    setTermsOfUse(false);
  }, [selectedVault, userInputValue, depositCall]);

  const withdrawAndClaimCall = WithdrawAndClaimContract.hook(selectedVault);
  const handleWithdrawAndClaim = useCallback(async () => {
    if (!selectedVault.chainId) return;
    if (!userInputValue || !isUserInTimeToWithdraw) return;
    withdrawAndClaimCall.send(userInputValue);
    setRequestingWithdraw(false);
    setUserInput("");
  }, [userInputValue, selectedVault, withdrawAndClaimCall, isUserInTimeToWithdraw]);

  const withdrawRequestCall = WithdrawRequestContract.hook(selectedVault);
  const handleWithdrawRequest = useCallback(() => {
    setRequestingWithdraw(true);
    withdrawRequestCall.send();
  }, [withdrawRequestCall]);

  const checkInCall = CommitteeCheckInContract.hook(selectedVault);
  const handleCheckIn = checkInCall.send;

  const actionsMap = {
    [Action.approveTokenAllowance]: approveTokenAllowanceCall,
    [Action.deposit]: depositCall,
    [Action.withdrawRequest]: withdrawRequestCall,
    [Action.withdrawAndClaim]: withdrawAndClaimCall,
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
    checkInCall.status,
  ].join("|");

  useEffect(() => {
    const currentAction = Object.entries(actionsMap).find((action) => ["loading", "success"].includes(action[1].status));

    if (currentAction) {
      const action = +currentAction[0] as Action;
      setInProgressTransaction({ action, txHash: actionsMap[action].data?.hash, txWait: actionsMap[action].data?.wait });
    } else {
      setInProgressTransaction(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionsStatusString]);

  useEffect(() => {
    if (inProgressTransaction) {
      const { action, txHash } = inProgressTransaction;

      const cleanUp = () => {
        setWaitingForTransaction(false);
        setInProgressTransaction(undefined);
        actionsMap[action].reset();
      };

      if (txHash && !waitingForTransaction) {
        setWaitingForTransaction(true);

        isAGnosisSafeTx(txHash, chain?.id).then((isSafeTx) => {
          if (isSafeTx) {
            cleanUp();
            alert(t("safeProposalCreatedSuccessfully"));

            // If the user just deposited, close modal
            if (action === Action.deposit) closeModal();
            return;
          }

          waitForTransaction({ hash: txHash }).finally(() => {
            cleanUp();

            // After token allowance approval we call deposit
            if (action === Action.approveTokenAllowance) {
              hideApproveSpending();
              handleDeposit();
            }
          });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inProgressTransaction, handleDeposit, hideApproveSpending, waitingForTransaction, chain]);

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
      return `${actionsDescription[action]}...`;
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
        {/* <div className="deposit-tokens-wrapper">
          {availableNftsByDeposit.map((availableNft) => (
            <div
              key={availableNft.tokenId.toString()}
              className={`deposit-token ${availableNft.isRedeemed ? "redeemed" : "eligible"}`}>
              <img alt={"tier " + availableNft.tier} src={ipfsTransformUri(availableNft.metadata.image)} />
            </div>
          ))}
        </div> */}
        <div className={`balance-wrapper ${isDepositing && depositPaused ? "disabled" : ""}`}>
          <span>{isDepositing && `Balance: ${tokenBalance.formatted()}`}</span>
          <span>{isWithdrawing && `Balance to withdraw: ${availableBalanceToWithdraw.formatted()}`}</span>
          <button
            className="max-button"
            disabled={!committeeCheckedIn}
            onClick={depositPaused ? () => {} : handleMaxAmountButton}
          >
            (Max)
          </button>
        </div>
        <div className={`amount-wrapper ${isDepositing && depositPaused ? "disabled" : ""}`}>
          <div className="top">
            <span>Vault asset</span>
            <span>
              &#8776;{" "}
              {!selectedVault.amountsInfo?.tokenPriceUsd
                ? "-"
                : `$${millify(selectedVault.amountsInfo.tokenPriceUsd, { precision: 3 })}`}
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

        {isDepositing &&
          !depositPaused &&
          userSharesAvailable &&
          totalSharesAvailable &&
          totalBalanceAvailable &&
          vaultNftRegistered &&
          availableNftsByDeposit && (
            <EmbassyEligibility
              vault={selectedVault}
              tierFromShares={tierFromShares ?? 0}
              userShares={userSharesAvailable}
              totalShares={totalSharesAvailable}
              totalBalance={totalBalanceAvailable}
              availableNftsByDeposit={availableNftsByDeposit}
              handleRedeem={redeem}
            />
          )}

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
              onClick={handleTryDeposit}
            >
              {`DEPOSIT`}
            </button>
          )}
          {isWithdrawing && (isUserInTimeToWithdraw || isUserInQueueToWithdraw) && (
            <button
              disabled={
                !userHasBalanceToWithdraw ||
                !userInput ||
                userInput === "0" ||
                withdrawSafetyPeriod?.isSafetyPeriod ||
                !committeeCheckedIn ||
                isUserInQueueToWithdraw
              }
              className="action-btn fill"
              onClick={handleWithdrawAndClaim}
            >
              {`WITHDRAW`}
            </button>
          )}
          {isWithdrawing && !isUserInQueueToWithdraw && !isUserInTimeToWithdraw && !isUserInQueueToWithdraw && (
            <>
              <button
                disabled={!userHasBalanceToWithdraw || !committeeCheckedIn || requestingWithdraw}
                className="action-btn fill"
                onClick={handleWithdrawRequest}
              >
                WITHDRAWAL REQUEST
              </button>
              {requestingWithdraw && (
                <span className="extra-status-info">{requestingWithdraw && t("weAreProcessingWithdrawRequest")}</span>
              )}
            </>
          )}
          {userIsCommitteeAndCanCheckIn && (
            <button onClick={handleCheckIn} className="action-btn fill">
              CHECK IN
            </button>
          )}
          {/* {pendingReward && !pendingReward.bigNumber.eq(0) && (
            <button
              onClick={handleClaimReward}
              disabled={!pendingReward || pendingReward.bigNumber.eq(0)}
              className="action-btn claim-btn"
            >
              {`CLAIM ${pendingReward?.formatted()}`}
            </button>
          )} */}
        </div>

        {inProgressTransaction && <Loading fixed extraText={getLoaderInformation()} zIndex={10000} />}

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
