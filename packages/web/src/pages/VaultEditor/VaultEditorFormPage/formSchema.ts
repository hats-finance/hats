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
  getTestWalletAddress,
} from "utils/yup.utils";
import * as Yup from "yup";

export const getEditedDescriptionYupSchema = (intl: TFunction) =>
  Yup.object().shape({
    version: Yup.string(),
    includesStartAndEndTime: Yup.boolean(),
    usingPointingSystem: Yup.boolean(),
    "project-metadata": Yup.object({
      icon: Yup.string().required(intl("required")),
      tokenIcon: Yup.string().required(intl("required")),
      website: Yup.string().test(getTestUrl(intl)).required(intl("required")),
      name: Yup.string().required(intl("required")),
      type: Yup.string().required(intl("required")).typeError(intl("required")),
      isPrivateAudit: Yup.boolean(),
      isContinuousAudit: Yup.boolean(),
      whitelist: Yup.array()
        .of(
          Yup.object({
            address: Yup.string().test(getTestWalletAddress(intl)).required(intl("required")),
          })
        )
        .when("isPrivateAudit", (isPrivateAudit: boolean, schema: any) => {
          if (!isPrivateAudit) return schema;
          return schema.required(intl("required")).min(1, intl("required"));
        }),
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
      intendedCompetitionAmount: Yup.string().when("type", (type: string, schema: any) => {
        if (!type || type !== "audit") return schema;
        return schema.required(intl("required"));
      }),
    }),
    scope: Yup.object({
      reposInformation: Yup.array().of(
        Yup.object({
          url: Yup.string()
            .test(getTestGithubRepoUrl(intl))
            .test("required", intl("required"), (val, ctx: any) =>
              !!ctx.from[2].value["project-metadata"]?.isPrivateAudit ? true : !!val
            ),
          prevAuditedCommitHash: Yup.string()
            .test(getTestGitCommitHash(intl))
            .test("required", intl("required"), (val, ctx: any) => {
              // Only required if isContinuousAudit
              if (!!ctx.from[2].value["project-metadata"]?.isContinuousAudit) return !!val;
              return true;
            }),
          commitHash: Yup.string()
            .test(getTestGitCommitHash(intl))
            .test("required", intl("required"), (val, ctx: any) =>
              !!ctx.from[2].value["project-metadata"]?.isPrivateAudit ? true : !!val
            ),
          isMain: Yup.boolean(),
        })
      ),
      description: Yup.string(),
      docsLink: Yup.string().test(getTestUrl(intl)),
      outOfScope: Yup.string(),
      protocolSetupInstructions: Yup.object({
        tooling: Yup.string(),
        instructions: Yup.string(),
      }),
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
        // name: Yup.string().required(intl("required")),
        address: Yup.string().test(getTestUrl(intl)).required(intl("required")),
        description: Yup.string().max(100, intl("max-characters", { max: 100 })),
        severities: Yup.array().min(1, intl("required")),
        deploymentInfo: Yup.array().of(
          Yup.object({
            contractAddress: Yup.string().test(getTestWalletAddress(intl)).required(intl("required")),
            chainId: Yup.string().required(intl("required")),
          })
        ),
      })
    ),
    "vulnerability-severities-spec": Yup.object({
      name: Yup.string(),
      severities: Yup.array().of(
        Yup.object({
          name: Yup.string().required(intl("required")),
          description: Yup.string().required(intl("required")),
          "nft-metadata": Yup.object({
            name: Yup.string(),
            description: Yup.string(),
            image: Yup.string(),
            animation_url: Yup.string(),
          }),
          index: Yup.number()
            .typeError(intl("enterValidNumber"))
            .when("version", (version: "v1" | "v2", schema: any) =>
              version === "v1" ? schema.required(intl("required")) : undefined
            ),
          percentage: Yup.string().test(
            "required",
            intl("valueShouldBeBetween", { first: "0.1%", second: "100%" }),
            function (percentage, ctx: Yup.TestContext) {
              const { version } = (this as any).from[2].value;
              if (version === "v1") return true;
              if (!percentage || +percentage < 0.1 || +percentage > 100) return false;
              return true;
            }
          ),
          points: Yup.object({
            type: Yup.string(),
            value: Yup.object({
              first: Yup.string().test("required", intl("minVal", { val: 0 }), function (points, ctx: Yup.TestContext) {
                const { version, usingPointingSystem } = (this as any).from[4].value;
                if (version === "v1" || !usingPointingSystem) return true;
                if (!points || +points < 0) return false;
                return true;
              }),
              second: Yup.string().test(
                "required",
                `${intl("minVal", { val: 0 })} and more than first range`,
                function (points, ctx: Yup.TestContext) {
                  const { first } = (this as any).from[0].value;
                  const { type } = (this as any).from[1].value;
                  const { version, usingPointingSystem } = (this as any).from[4].value;
                  if (type !== "range") return true;
                  if (version === "v1" || !usingPointingSystem) return true;
                  if (!points || +points < 0 || +first >= +points) return false;
                  return true;
                }
              ),
            }),
          }),
          percentageCapPerPoint: Yup.string()
            .test(
              "required",
              intl("valueShouldBeBetween", { first: "0.1%", second: "100%" }),
              function (percentageCapPerPoint, ctx: Yup.TestContext) {
                const { version, usingPointingSystem } = (this as any).from[2].value;
                if (version === "v1" || !usingPointingSystem) return true;
                if (percentageCapPerPoint === "" || percentageCapPerPoint === undefined || percentageCapPerPoint === null)
                  return true;
                if (+percentageCapPerPoint < 0.1 || +percentageCapPerPoint > 100) return false;
                return true;
              }
            )
            .test("required", intl("lessThanSeverityAllocation"), function (percentageCapPerPoint, ctx: Yup.TestContext) {
              const { percentage } = (this as any).from[0].value;
              if (!percentageCapPerPoint) return true;
              if (+percentageCapPerPoint > +percentage) return false;
              return true;
            }),
        })
      ),
    }),
    assets: Yup.array().of(
      Yup.object({
        address: Yup.string()
          .test(getTestTokenAddress(intl))
          .test("required", intl("required"), (val, ctx: any) =>
            // If vault is already created, we don't need to validate the assets
            !!ctx.from[1].value.vaultCreatedInfo?.vaultAddress ? true : !!val
          ),
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
    // percentageCapPerPoint: Yup.string()
    //   .test("max-100", intl("max100"), function (percentageCapPerPoint) {
    //     const { usingPointingSystem } = this.parent;
    //     if (!usingPointingSystem) return true;
    //     if (!percentageCapPerPoint) return true;
    //     if (+percentageCapPerPoint > 100) return false;
    //     return true;
    //   })
    //   .test("min-0.1", intl("minVal", { val: "0.1%" }), function (percentageCapPerPoint) {
    //     const { usingPointingSystem } = this.parent;
    //     if (!usingPointingSystem) return true;
    //     if (!percentageCapPerPoint) return true;
    //     if (+percentageCapPerPoint < 0.1) return false;
    //     return true;
    //   }),
    // "communication-channel": Yup.object({
    //   "pgp-pk": Yup.array().min(1, intl("required")).required(intl("required")),
    // }).required(intl("required")),
  });
