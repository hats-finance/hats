import { parseUnits } from "@ethersproject/units";
import { IVault } from "@hats-finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Loading } from "components";
import { DepositContract, TokenApproveAllowanceContract, WithdrawAndClaimContract } from "contracts";
import millify from "millify";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useWaitForTransaction } from "wagmi";
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

  const isAudit = vault.description && vault.description["project-metadata"].type === "audit";
  const { availableBalanceToWithdraw, tokenBalance, isUserInTimeToWithdraw, tokenAllowance } = useVaultDepositWithdrawInfo(vault);

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
    onSuccess: () => closeModal(),
  });
  const handleDeposit = useCallback(() => {
    if (!getValues().amount) return;
    const amountToDeposit = parseUnits(getValues().amount || "0", vault.stakingTokenDecimals);
    depositCall.send(amountToDeposit);
  }, [depositCall, vault, getValues]);

  // -------> WITHDRAW
  const withdrawCall = WithdrawAndClaimContract.hook(vault);
  const waitingWithdrawCall = useWaitForTransaction({
    hash: withdrawCall.data?.hash as `0x${string}`,
    onSuccess: () => closeModal(),
  });
  const handleWithdraw = useCallback(() => {
    if (!getValues().amount) return;
    const amountToWithdraw = parseUnits(getValues().amount || "0", vault.stakingTokenDecimals);
    withdrawCall.send(amountToWithdraw);
  }, [withdrawCall, vault, getValues]);

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

        <div className="buttons">
          <Button disabled={!isValid} filledColor={isAudit ? "primary" : "secondary"} onClick={handleActionExecution}>
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
    </>
  );
};
