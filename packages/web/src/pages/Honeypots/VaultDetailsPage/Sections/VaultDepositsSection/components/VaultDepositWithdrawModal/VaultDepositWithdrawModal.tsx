import { parseUnits } from "@ethersproject/units";
import { HATSVaultV3_abi, IVault } from "@hats.finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, FormSliderInput, Loading, Modal } from "components";
import { ApyPill } from "components/VaultCard/styles";
import { DepositContract, TokenApproveAllowanceContract, WithdrawAndClaimContract } from "contracts";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useModal from "hooks/useModal";
import { useVaultApy } from "hooks/vaults/useVaultApy";
import millify from "millify";
import moment from "moment";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { numberWithThousandSeparator } from "utils/amounts.utils";
import { useAccount, useContractRead, useWaitForTransaction } from "wagmi";
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
  const waitingWithdrawCall = useWaitForTransaction({
    hash: withdrawCall.data?.hash as `0x${string}`,
    onSuccess: () => showSuccessModal(),
  });
  
  const handleWithdraw = useCallback(async () => {
    if (withdrawalsDisabled) {
      return;
    }
    if (!getValues().amount) {
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
    
    try {
      await withdrawCall.send(amountToWithdraw);
    } catch (error) {
      console.error("Error calling withdraw:", error);
    }
  }, [withdrawCall, vault, getValues, withdrawalsDisabled, withdrawSafetyPeriod, availableBalanceToWithdraw, maxWithdrawAmount]);

  const handleActionExecution = () => {
    if (action === "DEPOSIT") {
      if (!hasAllowance) handleTokenAllowance();
      else handleDeposit();
    } else if (action === "WITHDRAW") {
      if (!isUserInTimeToWithdraw) {
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

        {action === "WITHDRAW" && withdrawCall.error && !withdrawCall.data && !withdrawCall.isLoading && (
          <Alert 
            className="mt-4" 
            type="error"
            content={
              withdrawCall.error?.message?.includes("transfer amount exceeds balance")
                ? "The vault does not have enough tokens to fulfill this withdrawal. This may happen if the vault balance has changed. Please try withdrawing a smaller amount or check the vault balance."
                : withdrawCall.error?.message 
                  ? `Withdrawal error: ${withdrawCall.error.message}` 
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

      {(tokenAllowanceCall.isLoading || depositCall.isLoading || withdrawCall.isLoading) && (
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
