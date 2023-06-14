import { TFunction } from "react-i18next";
import {
  getTestAddressOrUrl,
  getTestCommitteeMultisigForVault,
  getTestEmailAddress,
  getTestGitCommitHash,
  getTestGithubRepoUrl,
  getTestMinAmountOfKeysOnMembers,
  getTestNumberInBetween,
  getTestTokenAddress,
  getTestUrl,
} from "utils/yup.utils";
import * as Yup from "yup";

export const getEditedDescriptionYupSchema = (intl: TFunction) =>
  Yup.object().shape({
    version: Yup.string(),
    includesStartAndEndTime: Yup.boolean(),
    "project-metadata": Yup.object({
      icon: Yup.string().required(intl("required")),
      tokenIcon: Yup.string().required(intl("required")),
      website: Yup.string().test(getTestUrl(intl)).required(intl("required")),
      name: Yup.string().required(intl("required")),
      type: Yup.string().required(intl("required")).typeError(intl("required")),
      oneLiner: Yup.string()
        .required(intl("required"))
        .typeError(intl("required"))
        .min(40, intl("min-characters", { min: 40 }))
        .max(120, intl("max-characters", { max: 120 })),
      starttime: Yup.number()
        .positive(intl("required"))
        .typeError(intl("required"))
        .test(
          "isRequired",
          intl("required"),
          (val, ctx: any) => (ctx.from[1].value.includesStartAndEndTime && val) || !ctx.from[1].value.includesStartAndEndTime
        ),
      endtime: Yup.number()
        .positive(intl("required"))
        .typeError(intl("required"))
        .when("starttime", (starttime: number, schema: any) => {
          if (starttime) return schema.min(starttime, intl("endtimeGreaterThanStarttime"));
        })
        .test(
          "isRequired",
          intl("required"),
          (val, ctx: any) => (ctx.from[1].value.includesStartAndEndTime && val) || !ctx.from[1].value.includesStartAndEndTime
        ),
      emails: Yup.array()
        .of(Yup.object({ address: Yup.string().test(getTestEmailAddress(intl)).required(intl("required")) }))
        .test("minEmailsQuantity", intl("at-least-one-email"), (val, ctx: any) =>
          !!ctx.from[1].value.vaultCreatedInfo?.vaultAddress ? true : (val?.length ?? 0) > 0
        )
        .required(intl("required")),
    }),
    scope: Yup.object({
      reposInformation: Yup.array().of(
        Yup.object({
          url: Yup.string().test(getTestGithubRepoUrl(intl)).required(intl("required")),
          commitHash: Yup.string()
            .test(getTestGitCommitHash(intl))
            // Only required if the vault is and audit competition
            .test("isRequired", intl("required"), (val, ctx: any) =>
              ctx.from[2].value["project-metadata"].type === "audit" ? !!val : true
            ),
          isMain: Yup.boolean(),
        })
      ),
      description: Yup.string().required(intl("required")),
    }),
    committee: Yup.object({
      chainId: Yup.string().required(intl("required")),
      "multisig-address": Yup.string().test(getTestCommitteeMultisigForVault(intl)).required(intl("required")),
      members: Yup.array()
        .of(
          Yup.object({
            name: Yup.string().required(intl("required")),
            address: Yup.string().test(getTestAddressOrUrl(intl)),
            "pgp-keys": Yup.array()
              .of(Yup.object({ publicKey: Yup.string() }))
              .min(1, intl("required")),
            "twitter-link": Yup.string().required(intl("required")),
            "image-ipfs-link": Yup.string(),
          })
        )
        .min(1, intl("required"))
        .test(getTestMinAmountOfKeysOnMembers(intl)),
    }),
    "contracts-covered": Yup.array().of(
      Yup.object({
        name: Yup.string().required(intl("required")),
        address: Yup.string().test(getTestAddressOrUrl(intl)).required(intl("required")),
        severities: Yup.array().min(1, intl("required")),
      })
    ),
    "vulnerability-severities-spec": Yup.object({
      name: Yup.string(),
      severities: Yup.array().of(
        Yup.object({
          name: Yup.string().required(intl("required")),
          description: Yup.string().required(intl("required")),
          index: Yup.number()
            .typeError(intl("enterValidNumber"))
            .when("version", (version: "v1" | "v2", schema: any) =>
              version === "v1" ? schema.required(intl("required")) : undefined
            ),
          percentage: Yup.number()
            .min(0, intl("min0"))
            .max(100, intl("max100"))
            .typeError(intl("enterValidNumber"))
            .when("version", (version: "v1" | "v2", schema: any) =>
              version === "v2" ? schema.required(intl("required")) : undefined
            ),
          "nft-metadata": Yup.object({
            name: Yup.string().required(intl("required")),
            description: Yup.string().required(intl("required")),
            image: Yup.string().required(intl("required")),
            animation_url: Yup.string().required(intl("required")),
          }),
        })
      ),
    }),
    assets: Yup.array().of(
      Yup.object({
        address: Yup.string().test(getTestTokenAddress(intl)).required(intl("required")),
      })
    ),
    parameters: Yup.object({
      fixedCommitteeControlledPercetange: Yup.number(),
      fixedHatsGovPercetange: Yup.number(),
      fixedHatsRewardPercetange: Yup.number(),
      maxBountyPercentage: Yup.number()
        .test(getTestNumberInBetween(intl, 10, 90, true))
        .required(intl("required"))
        .typeError(intl("required")),
      // The sum of the following 3 parameters should be 100
      immediatePercentage: Yup.number()
        .test(getTestNumberInBetween(intl, 0, 100, true))
        .required(intl("required"))
        .typeError(intl("required"))
        .test("max-100", "max-100", function (immediatePercentage) {
          const { vestedPercentage, committeePercentage } = this.parent;
          return immediatePercentage + vestedPercentage + committeePercentage === 100;
        }),
      vestedPercentage: Yup.number()
        .test(getTestNumberInBetween(intl, 0, 100, true))
        .required(intl("required"))
        .typeError(intl("required"))
        .test("max-100", "max-100", function (vestedPercentage) {
          const { immediatePercentage, committeePercentage } = this.parent;
          return immediatePercentage + vestedPercentage + committeePercentage === 100;
        }),
      committeePercentage: Yup.number()
        .test(getTestNumberInBetween(intl, 0, 10, true))
        .required(intl("required"))
        .typeError(intl("required"))
        .test("max-100", "max-100", function (committeePercentage) {
          const { immediatePercentage, vestedPercentage } = this.parent;
          return immediatePercentage + vestedPercentage + committeePercentage === 100;
        }),
    }),
    // "communication-channel": Yup.object({
    //   "pgp-pk": Yup.array().min(1, intl("required")).required(intl("required")),
    // }).required(intl("required")),
  });
