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
      .test(getTestNumberInBetween(intl, 0, vault?.maxBounty ? Number(vault.maxBounty) / 100 : 100, true))
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
      .test(getTestNumberInBetween(intl, 0, vault?.maxBounty ? Number(vault.maxBounty) / 100 : 100, true))
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
          const sumOfPercentages: number = ctx.from[1].value.beneficiaries.reduce(
            (acc, cur) => acc + Number(cur.percentageOfPayout ?? 0),
            0
          );
          return +sumOfPercentages.toFixed(6) === 100;
        }),
        nftUrl: Yup.string().required(intl("required")),
      })
    ),
    rewardsConstraints: Yup.array().of(
      Yup.object({
        severity: Yup.string().required(intl("required")),
        maxReward: Yup.string().required(intl("required")).test("sumShouldBe100", '', (_, ctx: any) => {
          if(vault?.description?.["project-metadata"].type !== 'audit') return true;

          const sumOfPercentages: number = ctx.from[1].value.rewardsConstraints.reduce(
            (acc: number, cur: any) => acc + Number(+cur.maxReward ?? 0),
            0
          );
          return +sumOfPercentages.toFixed(6) === 100;
        }),
        capAmount: Yup.string(),
      })
    )
  });
