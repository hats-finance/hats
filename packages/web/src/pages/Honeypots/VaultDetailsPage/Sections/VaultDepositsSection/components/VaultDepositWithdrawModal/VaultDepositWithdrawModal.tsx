import { parseUnits } from "@ethersproject/units";
import { HATSVaultV2_abi, HATSVaultV3_abi, IVault } from "@hats.finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, FormSliderInput, Loading, Modal } from "components";
import { ApyPill } from "components/VaultCard/styles";
import { DepositContract, TokenApproveAllowanceContract, WithdrawAndClaimContract } from "contracts";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useModal from "hooks/useModal";
import { useVaultApy } from "hooks/vaults/useVaultApy";
import millify from "millify";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { numberWithThousandSeparator } from "utils/amounts.utils";
import { useAccount, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { BigNumber } from "ethers";
import { SuccessActionModal } from "..";
import { useVaultDepositWithdrawInfo } from "../../useVaultDepositWithdrawInfo";
import { VaultTokenIcon } from "../VaultTokenIcon/VaultTokenIcon";
import { getDepositWithdrawYupSchema } from "./formSchema";
import { StyledVaultDepositWithdrawModal } from "./styles";

type VaultDepositWithdrawModalProps = {
  vault: IVault;
  action: "DEPOSIT" | "WITHDRAW";
  closeModal: () => void;
  fromReleaseTokens?: boolean;
};

export const VaultDepositWithdrawModal = ({ vault, action, closeModal, fromReleaseTokens }: VaultDepositWithdrawModalProps) => {
  const { t } = useTranslation();
  const { address: account } = useAccount();

  const { isShowing: isShowingSuccessModal, show: showSuccessModal } = useModal();

  const isAudit = vault.description && vault.description["project-metadata"].type === "audit";
  const { withdrawSafetyPeriod } = useVaults();
  const { availableBalanceToWithdraw, tokenBalance, isUserInTimeToWithdraw, isUserInQueueToWithdraw, tokenAllowance } =
    useVaultDepositWithdrawInfo(vault);
  const vaultApy = useVaultApy(vault);

  // For v3 vaults, get the actual max withdrawable amount using maxWithdraw
  const { data: maxWithdrawAmount } = useContractRead({
    address: vault.version === "v3" && account ? (vault.id as `0x${string}`) : undefined,
    abi: HATSVaultV3_abi as any,
    functionName: "maxWithdraw",
    chainId: vault.chainId as number,
    args: [account as `0x${string}`],
    scopeKey: "hats",
    enabled: vault.version === "v3" && !!account && action === "WITHDRAW",
  });

  const {
    register,
    watch,
    setFocus,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<{ amount: string }>({
    resolver: yupResolver(
      getDepositWithdrawYupSchema(t, vault, action === "DEPOSIT" ? tokenBalance.number : availableBalanceToWithdraw.number)
    ),
    mode: "onChange",
    defaultValues: { amount: "" },
  });

  const amountBigNumber = parseUnits(watch("amount") || "0", vault.stakingTokenDecimals);
  const hasAllowance = tokenAllowance && watch("amount") ? tokenAllowance.gte(amountBigNumber) : false;
  const withdrawalsDisabled = action === "WITHDRAW" && (withdrawSafetyPeriod?.isSafetyPeriod || !!vault.activeClaim);
  const depositsDisabled = action === "DEPOSIT" && (!vault.committeeCheckedIn || vault.depositPause);

  useEffect(() => {
    setTimeout(() => setFocus("amount"), 10);
  }, [setFocus]);

  const handleMaxButton = () => {
    const value = action === "DEPOSIT" ? tokenBalance.string : availableBalanceToWithdraw.string;
    setValue("amount", value, {
      shouldValidate: true,
    });
  };

  // -------> TOKEN ALLOWANCE
  const tokenAllowanceCall = TokenApproveAllowanceContract.hook(vault);
  const waitingTokenAllowanceCall = useWaitForTransaction({
    hash: tokenAllowanceCall.data?.hash as `0x${string}`,
    onSuccess: () => handleDeposit(),
  });
  const handleTokenAllowance = useCallback(() => {
    if (!getValues().amount) return;
    const amountToApprove = parseUnits(getValues().amount || "0", vault.stakingTokenDecimals);
    tokenAllowanceCall.send(amountToApprove);
  }, [tokenAllowanceCall, vault, getValues]);

  // -------> DEPOSIT
  const depositCall = DepositContract.hook(vault);
  const waitingDepositCall = useWaitForTransaction({
    hash: depositCall.data?.hash as `0x${string}`,
    onSuccess: () => showSuccessModal(),
  });
  const handleDeposit = useCallback(() => {
    if (depositsDisabled) return;
    if (!getValues().amount) return;
    const amountToDeposit = parseUnits(getValues().amount || "0", vault.stakingTokenDecimals);
    depositCall.send(amountToDeposit);
  }, [depositCall, vault, getValues, depositsDisabled]);

  // -------> WITHDRAW
  const withdrawCall = WithdrawAndClaimContract.hook(vault);
  const { chain } = useNetwork();
  
  // Separate withdraw function for fallback (v2/v3 only)
  const withdrawFallback = useContractWrite({
    mode: "recklesslyUnprepared",
    address: (vault.version === "v2" || vault.version === "v3") ? (vault.id as `0x${string}`) : undefined,
    abi: (vault.version === "v2" ? HATSVaultV2_abi : vault.version === "v3" ? HATSVaultV3_abi : undefined) as any,
    functionName: "withdraw",
  });
  
  const pendingWithdrawAmountRef = useRef<BigNumber | null>(null);
  const [shouldTryFallback, setShouldTryFallback] = useState(false);
  const fallbackAttemptedRef = useRef(false);
  
  // Monitor withdrawAndClaim error and trigger fallback
  useEffect(() => {
    if (
      (vault.version === "v2" || vault.version === "v3") &&
      withdrawCall.error &&
      shouldTryFallback &&
      pendingWithdrawAmountRef.current &&
      withdrawFallback.write &&
      !withdrawFallback.isLoading &&
      !withdrawFallback.data &&
      !fallbackAttemptedRef.current
    ) {
      const errorMessage = withdrawCall.error?.message || "";
      console.log("Checking error for fallback:", {
        errorMessage,
        includesBalance: errorMessage.includes("transfer amount exceeds balance"),
        includesGas: errorMessage.includes("UNPREDICTABLE_GAS_LIMIT"),
      });
      
      if (errorMessage.includes("transfer amount exceeds balance") || errorMessage.includes("UNPREDICTABLE_GAS_LIMIT")) {
        console.warn("withdrawAndClaim error detected, trying withdraw as fallback:", withdrawCall.error);
        console.log("Fallback conditions met, proceeding with fallback...");
        fallbackAttemptedRef.current = true;
        setShouldTryFallback(false);
        const amount = pendingWithdrawAmountRef.current;
        if (!amount) {
          console.error("No amount stored for fallback!");
          fallbackAttemptedRef.current = false;
          return;
        }
        pendingWithdrawAmountRef.current = null;
        
        // Switch network and call withdraw
        console.log("STEP 1: Calling fallback withdraw with amount:", amount.toString(), "account:", account, "chain:", chain?.id, "vaultChain:", vault.chainId);
        switchNetworkAndValidate(chain!.id, vault.chainId as number)
          .then(() => {
            console.log("STEP 2: Network switched successfully, checking withdrawFallback.write:", !!withdrawFallback.write);
            if (withdrawFallback.write) {
              console.log("STEP 3: Calling withdrawFallback.write with args:", [amount.toString(), account, account]);
              try {
                const result = withdrawFallback.write({ recklesslySetUnpreparedArgs: [amount, account, account] });
                console.log("STEP 4: withdrawFallback.write called successfully, result:", result);
              } catch (error) {
                console.error("STEP 4 ERROR: Error calling withdrawFallback.write:", error);
                fallbackAttemptedRef.current = false; // Reset on error so we can try again
              }
            } else {
              console.error("STEP 3 ERROR: withdrawFallback.write is not available");
              fallbackAttemptedRef.current = false;
            }
          })
          .catch((error) => {
            console.error("STEP 2 ERROR: Error switching network for fallback:", error);
            fallbackAttemptedRef.current = false;
          });
      } else {
        console.log("Error message does not match fallback criteria:", errorMessage);
      }
    }
    
    // Reset fallback flag when transaction succeeds
    if (withdrawCall.data || withdrawFallback.data) {
      fallbackAttemptedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawCall.error, withdrawCall.data, shouldTryFallback, withdrawFallback.write, withdrawFallback.isLoading, withdrawFallback.data, account, vault.version, vault.chainId, chain]);
  
  const waitingWithdrawCall = useWaitForTransaction({
    hash: (withdrawCall.data?.hash || withdrawFallback.data?.hash) as `0x${string}`,
    onSuccess: () => {
      setShouldTryFallback(false);
      pendingWithdrawAmountRef.current = null;
      showSuccessModal();
    },
  });
  
  const handleWithdraw = useCallback(() => {
    if (withdrawalsDisabled) {
      console.log("Withdraw disabled:", { withdrawalsDisabled, isSafetyPeriod: withdrawSafetyPeriod?.isSafetyPeriod, activeClaim: vault.activeClaim });
      return;
    }
    if (!getValues().amount) {
      console.log("No amount to withdraw");
      return;
    }
    const amountToWithdraw = parseUnits(getValues().amount || "0", vault.stakingTokenDecimals);
    
    // For v3 vaults, use maxWithdraw to get the actual maximum withdrawable amount
    const maxWithdrawable = vault.version === "v3" && maxWithdrawAmount 
      ? maxWithdrawAmount as any
      : availableBalanceToWithdraw?.bigNumber;
    
    // Validate that the amount doesn't exceed available balance
    if (maxWithdrawable && amountToWithdraw.gt(maxWithdrawable)) {
      console.error("Withdrawal amount exceeds maximum withdrawable:", {
        requested: amountToWithdraw.toString(),
        maxWithdrawable: maxWithdrawable.toString(),
        previewRedeem: availableBalanceToWithdraw?.bigNumber.toString()
      });
      const maxFormatted = vault.version === "v3" 
        ? (Number(maxWithdrawable.toString()) / Math.pow(10, Number(vault.stakingTokenDecimals))).toFixed(6)
        : availableBalanceToWithdraw?.formatted();
      alert(`Withdrawal amount (${getValues().amount}) exceeds maximum withdrawable amount (${maxFormatted}). Please reduce the amount.`);
      return;
    }
    
    console.log("Attempting to withdraw:", { 
      amount: getValues().amount, 
      amountToWithdraw: amountToWithdraw.toString(),
      maxWithdrawable: maxWithdrawable?.toString(),
      previewRedeem: availableBalanceToWithdraw?.bigNumber.toString(),
      vaultVersion: vault.version
    });
    
    // Set up fallback tracking
    if (vault.version === "v2" || vault.version === "v3") {
      pendingWithdrawAmountRef.current = amountToWithdraw;
      setShouldTryFallback(true);
      fallbackAttemptedRef.current = false; // Reset fallback flag for new attempt
    }
    
    try {
      withdrawCall.send(amountToWithdraw);
    } catch (error) {
      console.error("Error calling withdraw:", error);
      setShouldTryFallback(false);
      pendingWithdrawAmountRef.current = null;
    }
  }, [withdrawCall, vault, getValues, withdrawalsDisabled, withdrawSafetyPeriod, availableBalanceToWithdraw, maxWithdrawAmount]);

  const handleActionExecution = () => {
    if (action === "DEPOSIT") {
      if (!hasAllowance) handleTokenAllowance();
      else handleDeposit();
    } else if (action === "WITHDRAW") {
      console.log("Withdraw action execution:", { 
        isUserInTimeToWithdraw, 
        withdrawalsDisabled, 
        amount: getValues().amount,
        withdrawCallError: withdrawCall.error,
        withdrawCallStatus: withdrawCall.status
      });
      if (!isUserInTimeToWithdraw) {
        console.warn("User is not in time to withdraw. isUserInTimeToWithdraw:", isUserInTimeToWithdraw);
        return;
      }
      handleWithdraw();
    }
  };

  return (
    <>
      <StyledVaultDepositWithdrawModal>
        {fromReleaseTokens && (
          <div className="mb-5">
            <h2>
              {t("Airdrop.lastStep")}
              <br />
              {t("depositAndEarnAPYDescription", {
                name: `${vault.description?.["project-metadata"].name} ${
                  vault.description?.["project-metadata"].type === "normal" ? t("bugBounty") : t("auditCompetition")
                }`,
              })}
            </h2>

            {vaultApy && vaultApy.length > 0 && (
              <div className="mb-5">
                <ApyPill>
                  <div className="content-apy">
                    {t("apy")} <span>{`${numberWithThousandSeparator(vaultApy[0]?.apy)}%`}</span>
                  </div>
                  <div className="bg" />
                </ApyPill>
              </div>
            )}
          </div>
        )}

        <div className="balance">
          <p>
            {t("balance")}: {(action === "DEPOSIT" ? tokenBalance : availableBalanceToWithdraw).formatted()}
          </p>
          <Button size="small" filledColor={isAudit ? "primary" : "secondary"} onClick={handleMaxButton}>
            {t("max")}
          </Button>
        </div>

        <div className="input-box mt-5">
          <div className="input-row">
            <VaultTokenIcon vault={vault} />
            <input min={0} placeholder="0.00" type="number" {...register("amount")} autoFocus />
          </div>

          <div className="prices-row">
            <p>
              1 {vault.stakingTokenSymbol} ≈ ${millify(vault.amountsInfo?.tokenPriceUsd ?? 0)}
            </p>
            <p>≈ ${millify(+(watch("amount") ?? "0") * (vault.amountsInfo?.tokenPriceUsd ?? 0))}</p>
          </div>
        </div>
        {errors.amount ? <span className="error">{errors.amount.message}</span> : <span className="error">&nbsp;</span>}

        {fromReleaseTokens && (
          <>
            <div className="mb-4 mt-4">
              <p className="mb-4">{t("percentageToDeposit")}</p>
              <FormSliderInput
                onChange={(val) => {
                  if (val === 100) {
                    const value = action === "DEPOSIT" ? tokenBalance.string : availableBalanceToWithdraw.string;
                    setValue("amount", value, {
                      shouldValidate: true,
                    });
                  } else {
                    setValue("amount", (tokenBalance.number * (val / 100)).toFixed(2), {
                      shouldValidate: true,
                    });
                  }
                }}
              />
            </div>
            <div
              className="warning-text"
              dangerouslySetInnerHTML={{
                __html: t("depositBountyWarning", {
                  maxBounty: +(vault.maxBounty ?? 0) / 100,
                  withdrawPeriod: moment.duration(vault.master.withdrawPeriod, "seconds").humanize(),
                }),
              }}
            />
          </>
        )}

        {action === "DEPOSIT" && (isUserInTimeToWithdraw || isUserInQueueToWithdraw) && (
          <Alert className="mt-4" type="warning">
            {t("depositWillCancelWithdraw")}
          </Alert>
        )}

        {action === "WITHDRAW" && withdrawSafetyPeriod?.isSafetyPeriod && (
          <Alert className="mt-4" type="warning">
            {t("safePeriodOnCantWithdraw")}
          </Alert>
        )}

        {action === "WITHDRAW" && !!vault.activeClaim && (
          <Alert className="mt-4" type="warning">
            {t("activeClaimCantWithdraw")}
          </Alert>
        )}

        {action === "WITHDRAW" && (withdrawCall.error || withdrawFallback.error) && !withdrawFallback.data && !withdrawFallback.isLoading && (
          <Alert 
            className="mt-4" 
            type="error"
            content={
              (withdrawCall.error?.message?.includes("transfer amount exceeds balance") || withdrawFallback.error?.message?.includes("transfer amount exceeds balance"))
                ? "The vault does not have enough tokens to fulfill this withdrawal. This may happen if the vault balance has changed. Please try withdrawing a smaller amount or check the vault balance."
                : (withdrawCall.error?.message || withdrawFallback.error?.message)
                  ? `Withdrawal error: ${withdrawCall.error?.message || withdrawFallback.error?.message}` 
                  : "Withdrawal error occurred. Please check the console for details."
            }
          />
        )}

        <div className="buttons">
          <Button
            disabled={!isValid || withdrawalsDisabled || depositsDisabled}
            filledColor={isAudit ? "primary" : "secondary"}
            onClick={handleActionExecution}
          >
            {action === "DEPOSIT" ? t("deposit") : t("withdraw")}
          </Button>
        </div>
      </StyledVaultDepositWithdrawModal>

      {(tokenAllowanceCall.isLoading || depositCall.isLoading || withdrawCall.isLoading || withdrawFallback.isLoading) && (
        <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />
      )}
      {waitingTokenAllowanceCall.isLoading && (
        <Loading fixed extraText={`${t("approvingTokenSpending", { token: vault.stakingTokenSymbol })}...`} />
      )}
      {waitingDepositCall.isLoading && (
        <Loading fixed extraText={`${t("depositingTokens", { token: vault.stakingTokenSymbol })}...`} />
      )}
      {waitingWithdrawCall.isLoading && (
        <Loading fixed extraText={`${t("withdrawingTokens", { token: vault.stakingTokenSymbol })}...`} />
      )}

      <Modal isShowing={isShowingSuccessModal} onHide={closeModal}>
        <SuccessActionModal
          title={action === "DEPOSIT" ? t("successDepositModalTitle") : t("successWithdrawModalTitle")}
          content={
            action === "DEPOSIT"
              ? t("successDepositModalContent", { amount: `${millify(+(watch("amount") ?? "0"))} ${vault.stakingTokenSymbol}` })
              : t("successWithdrawModalContent", { amount: `${millify(+(watch("amount") ?? "0"))} ${vault.stakingTokenSymbol}` })
          }
          closeModal={closeModal}
        />
      </Modal>
    </>
  );
};
