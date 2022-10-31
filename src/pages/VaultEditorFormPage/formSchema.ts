import { TFunction } from "react-i18next";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getTestWalletAddress } from "utils/yup.utils";

export const getEditedDescriptionYupSchema = (intl: TFunction) => {
  const schema = Yup.object().shape({
    "project-metadata": Yup.object({
      icon: Yup.string().required(intl("required")),
      tokenIcon: Yup.string().required(intl("required")),
      website: Yup.string().required(intl("required")),
      name: Yup.string().required(intl("required")),
      type: Yup.string(),
      starttime: Yup.number().positive(intl("required")).required(intl("required")).typeError(intl("required")),
      endtime: Yup.number()
        .positive(intl("required"))
        .required(intl("required"))
        .typeError(intl("required"))
        .when("starttime", (starttime: number, schema: any) => {
          if (starttime) return schema.min(starttime, intl("endtimeGreaterThanStarttime"));
        }),
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
  });

  return yupResolver(schema);
};
