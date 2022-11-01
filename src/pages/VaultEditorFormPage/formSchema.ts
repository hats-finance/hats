import { TFunction } from "react-i18next";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getTestWalletAddress } from "utils/yup.utils";

export const getEditedDescriptionYupSchema = (intl: TFunction) => {
  const schema = Yup.object().shape({
    version: Yup.string(),
    includesStartAndEndTime: Yup.boolean(),
    "project-metadata": Yup.object({
      icon: Yup.string().required(intl("required")),
      tokenIcon: Yup.string().required(intl("required")),
      website: Yup.string().required(intl("required")),
      name: Yup.string().required(intl("required")),
      type: Yup.string(),
      starttime: Yup.number()
        .positive(intl("required"))
        .typeError(intl("required"))
        .test("isRequired", intl("required"), (val, ctx: any) => ctx.from[1].value.includesStartAndEndTime && val),
      endtime: Yup.number()
        .positive(intl("required"))
        .typeError(intl("required"))
        .when("starttime", (starttime: number, schema: any) => {
          if (starttime) return schema.min(starttime, intl("endtimeGreaterThanStarttime"));
        })
        .test("isRequired", intl("required"), (val, ctx: any) => ctx.from[1].value.includesStartAndEndTime && val),
    }),
    committee: Yup.object({
      "multisig-address": Yup.string().required(intl("required")),
      members: Yup.array().of(
        Yup.object({
          name: Yup.string().required(intl("required")),
          address: Yup.string().test(getTestWalletAddress(intl)).required(intl("required")),
          "twitter-link": Yup.string().required(intl("required")),
          "image-ipfs-link": Yup.string(),
        })
      ),
    }),
    "contracts-covered": Yup.array().of(
      Yup.object({
        name: Yup.string().required(intl("required")),
        address: Yup.string().test(getTestWalletAddress(intl)).required(intl("required")),
        severities: Yup.array().min(1, intl("required")),
      })
    ),
    "vulnerability-severities-spec": Yup.object({
      name: Yup.string().required(intl("required")),
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
    "communication-channel": Yup.object({
      "pgp-pk": Yup.array().min(1, intl("required")).required(intl("required")),
    }).required(intl("required")),
  });

  return yupResolver(schema);
};
