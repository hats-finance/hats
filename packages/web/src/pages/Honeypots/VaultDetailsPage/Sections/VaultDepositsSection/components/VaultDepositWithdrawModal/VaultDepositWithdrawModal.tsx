import { parseUnits } from "@ethersproject/units";
import { IVault } from "@hats-finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, Loading, Modal } from "components";
import { DepositContract, TokenApproveAllowanceContract, WithdrawAndClaimContract } from "contracts";
import useModal from "hooks/useModal";
import { useVaults } from "hooks/vaults/useVaults";
import millify from "millify";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useWaitForTransaction } from "wagmi";
import { SuccessActionModal } from "..";
import { useVaultDepositWithdrawInfo } from "../../useVaultDepositWithdrawInfo";
import { VaultTokenIcon } from "../VaultTokenIcon/VaultTokenIcon";
import { getDepositWithdrawYupSchema } from "./formSchema";
import { StyledVaultDepositWithdrawModal } from "./styles";

type VaultDepositWithdrawModalProps = {
  vault: IVault;
  action: "DEPOSIT" | "WITHDRAW";
  closeModal: () => void;
};

export const VaultDepositWithdrawModal = ({ vault, action, closeModal }: VaultDepositWithdrawModalProps) => {
  const { t } = useTranslation();

  const { isShowing: isShowingSuccessModal, show: showSuccessModal } = useModal();

  const isAudit = vault.description && vault.description["project-metadata"].type === "audit";
  const { withdrawSafetyPeriod } = useVaults();
  const { availableBalanceToWithdraw, tokenBalance, isUserInTimeToWithdraw, isUserInQueueToWithdraw, tokenAllowance } =
    useVaultDepositWithdrawInfo(vault);

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
    setValue("amount", value);
  };

  // -------> TOKEN ALLOWANCE
  const tokenAllowanceCall = TokenApproveAllowanceContract.hook(vault);
  const waitingTokenAllowanceCall = useWaitForTransaction({
    hash: tokenAllowanceCall.data?.hash as `0x${string}`,
    confirmations: 2,
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
  const handleWithdraw = useCallback(() => {
    if (withdrawalsDisabled) return;
    if (!getValues().amount) return;
    const amountToWithdraw = parseUnits(getValues().amount || "0", vault.stakingTokenDecimals);
    withdrawCall.send(amountToWithdraw);
  }, [withdrawCall, vault, getValues, withdrawalsDisabled]);

  const handleActionExecution = () => {
    if (action === "DEPOSIT") {
      if (!hasAllowance) handleTokenAllowance();
      else handleDeposit();
    } else if (action === "WITHDRAW") {
      if (!isUserInTimeToWithdraw) return;
      handleWithdraw();
    }
  };

  return (
    <>
      <StyledVaultDepositWithdrawModal>
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
