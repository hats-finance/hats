import { IVault } from "@hats-finance/shared";
import { TFunction } from "react-i18next";
import { getTestNumberInBetween, getTestWalletAddress } from "utils/yup.utils";
import * as Yup from "yup";

export const getSinglePayoutDataYupSchema = (intl: TFunction, vault: IVault | undefined) =>
  Yup.object({
    beneficiary: Yup.string().test(getTestWalletAddress(intl)).required(intl("required")),
    title: Yup.string().required(intl("required")),
    severity: Yup.string().required(intl("required")),
    percentageToPay: Yup.number()
      .test(getTestNumberInBetween(intl, 0, Number(vault?.maxBounty) / 100 ?? 100, true))
      .required(intl("required"))
      .typeError(intl("required")),
    explanation: Yup.string().required(intl("required")),
    nftUrl: Yup.string().required(intl("required")),
    additionalInfo: Yup.string().required(intl("required")),
  });

export const getSplitPayoutDataYupSchema = (intl: TFunction, vault: IVault | undefined) =>
  Yup.object({
    title: Yup.string().required(intl("required")),
    percentageToPay: Yup.number()
      .test(getTestNumberInBetween(intl, 0, Number(vault?.maxBounty) / 100 ?? 100, true))
      .required(intl("required"))
      .typeError(intl("required")),
    explanation: Yup.string().required(intl("required")),
    beneficiaries: Yup.array().of(
      Yup.object({
        beneficiary: Yup.string()
          .test(getTestWalletAddress(intl))
          .test("duplicatedBeneficiary", intl("duplicated"), (val, ctx: any) => {
            const sameAddressBeneficiaries = ctx.from[1].value.beneficiaries.filter((b: any) => b.beneficiary === val);
            return sameAddressBeneficiaries.length === 1;
          })
          .required(intl("required")),
        severity: Yup.string().required(intl("required")),
        percentageOfPayout: Yup.number()
          .test(getTestNumberInBetween(intl, 0, 100, true, { smallError: true }))
          .required(intl("required"))
          .typeError(intl("required")),
        sumPercentagesOfPayouts: Yup.number().test("sumShouldBe100", "", (_, ctx: any) => {
          const sumOfPercentages = ctx.from[1].value.beneficiaries.reduce((acc, cur) => acc + Number(cur.percentageOfPayout), 0);
          return sumOfPercentages === 100;
        }),
        nftUrl: Yup.string().required(intl("required")),
      })
    ),
  });
