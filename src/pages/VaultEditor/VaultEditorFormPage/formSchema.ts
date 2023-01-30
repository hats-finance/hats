import { TFunction } from "react-i18next";
import * as Yup from "yup";
import {
  getTestAddressOrUrl,
  getTestNumberInBetween,
  getTestWalletAddress,
  getTestCommitteeMultisigForVault,
} from "utils/yup.utils";
import { COMMITTEE_CONTROLLED_SPLIT, HATS_GOV_SPLIT, HATS_REWARD_SPLIT } from "./utils";

export const getEditedDescriptionYupSchema = () =>
  Yup.object().shape({
    version: Yup.string(),
    includesStartAndEndTime: Yup.boolean(),
    "project-metadata": Yup.object({
      icon: Yup.string().required(),
      tokenIcon: Yup.string().required(),
      website: Yup.string().url().required(),
      name: Yup.string().required(),
      type: Yup.string().required(),
      starttime: Yup.number()
        .positive()
        //        .typeError("required")
        .test(
          "isRequired",
          "required",
          (val, ctx: any) => (ctx.from[1].value.includesStartAndEndTime && val) || !ctx.from[1].value.includesStartAndEndTime
        ),
      endtime: Yup.number()
        .positive()
        //        .typeError("required")
        .when("starttime", (starttime: number, schema: any) => {
          if (starttime) return schema.min(starttime, "endtimeGreaterThanStarttime");
        })
        .test(
          "isRequired",
          "required",
          (val, ctx: any) => (ctx.from[1].value.includesStartAndEndTime && val) || !ctx.from[1].value.includesStartAndEndTime
        ),
      emails: Yup.array()
        //.of(Yup.object({ address: Yup.string().test(getTestEmailAddress()).required() }))
        .of(Yup.object({ address: Yup.string().email().required() }))
        .min(1, "required")
        .required(),
    }),
    committee: Yup.object({
      chainId: Yup.string().required(),
      "multisig-address": Yup.string().test(getTestCommitteeMultisigForVault()).required(),
      members: Yup.array().of(
        Yup.object({
          name: Yup.string().required(),
          address: Yup.string().test(getTestAddressOrUrl()),
          "pgp-keys": Yup.array()
            .of(Yup.object({ publicKey: Yup.string().required() }))
            .min(1, "required")
            .required(),
          "twitter-link": Yup.string().required(),
          "image-ipfs-link": Yup.string(),
        })
      ),
    }),
    "contracts-covered": Yup.array().of(
      Yup.object({
        name: Yup.string().required(),
        address: Yup.string().test(getTestAddressOrUrl()).required(),
        severities: Yup.array().min(1, "required"),
      })
    ),
    "vulnerability-severities-spec": Yup.object({
      name: Yup.string(),
      severities: Yup.array().of(
        Yup.object({
          name: Yup.string().required(),
          description: Yup.string().required(),
          index: Yup.number()
            .typeError("enterValidNumber")
            .when("version", (version: "v1" | "v2", schema: any) => (version === "v1" ? schema.required() : undefined)),
          percentage: Yup.number()
            .min(0)
            .max(100)
            .typeError("typeError")
            .when("version", (version: "v1" | "v2", schema: any) => (version === "v2" ? schema.required() : undefined)),
          "nft-metadata": Yup.object({
            name: Yup.string().required(),
            description: Yup.string().required(),
            image: Yup.string().required(),
            animation_url: Yup.string().required(),
          }),
        })
      ),
    }),
    assets: Yup.array().of(
      Yup.object({
        address: Yup.string().test(getTestWalletAddress()).required(),
        chainId: Yup.string().required(),
      })
    ),
    parameters: Yup.object({
      fixedCommitteeControlledPercetange: Yup.number().oneOf([COMMITTEE_CONTROLLED_SPLIT], "cantChangeThisValue"),
      fixedHatsGovPercetange: Yup.number().oneOf([HATS_GOV_SPLIT], "cantChangeThisValue"),
      fixedHatsRewardPercetange: Yup.number().oneOf([HATS_REWARD_SPLIT], "cantChangeThisValue"),
      maxBountyPercentage: Yup.number().test(getTestNumberInBetween(10, 90, true)).required().typeError("required"),
      // The sum of the following 3 parameters should be 100
      immediatePercentage: Yup.number()
        .test(getTestNumberInBetween(0, 100, true))
        .required()
        .typeError("required")
        .test("max-100", "max-100", function (immediatePercentage) {
          const { vestedPercentage, committeePercentage } = this.parent;
          return immediatePercentage + vestedPercentage + committeePercentage === 100;
        }),
      vestedPercentage: Yup.number()
        .test(getTestNumberInBetween(0, 100, true))
        .required()
        .typeError("required")
        .test("max-100", "max-100", function (vestedPercentage) {
          const { immediatePercentage, committeePercentage } = this.parent;
          return immediatePercentage + vestedPercentage + committeePercentage === 100;
        }),
      committeePercentage: Yup.number()
        .test(getTestNumberInBetween(0, 10, true))
        .required()
        .typeError("required")
        .test("max-100", "max-100", function (committeePercentage) {
          const { immediatePercentage, vestedPercentage } = this.parent;
          return immediatePercentage + vestedPercentage + committeePercentage === 100;
        }),
    }),
    // "communication-channel": Yup.object({
    //   "pgp-pk": Yup.array().min(1, intl("required")).required(intl("required")),
    // }).required(intl("required")),
  });
