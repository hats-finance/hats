import { IVault } from "@hats.finance/shared";
import { TFunction } from "i18next";
import * as Yup from "yup";

export const getDepositWithdrawYupSchema = (intl: TFunction, vault: IVault, maxAmount: number) =>
  Yup.object({
    amount: Yup.string()
      .required(intl("enterValidAmount"))
      .test("validNumber", intl("invalidAmount"), (val) => !isNaN(Number(val?.replaceAll(",", ".") ?? "")))
      .test("max", intl("insufficientFunds"), (val) => Number(val) <= maxAmount)
      .test("min", intl("min-amount", { amount: `0.00 ${vault.stakingTokenSymbol}` }), (val) => Number(val) >= 0),
  });
