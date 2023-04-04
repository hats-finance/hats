import { TFunction } from "react-i18next";
import * as Yup from "yup";
import { getTestPGPKeyFormat } from "utils/yup.utils";

export const getImportKeySchema = (intl: TFunction) =>
  Yup.object().shape({
    needPassphrase: Yup.boolean(),
    alias: Yup.string()
      .min(3, intl("min-characters", { min: 3 }))
      .required(intl("required")),
    privateKey: Yup.string().required(intl("required")).test(getTestPGPKeyFormat(intl, "private")),
    passphrase: Yup.string().when("needPassphrase", (needPassphrase: number, schema: any) => {
      if (needPassphrase) return schema.required(intl("required"));
    }),
  });
