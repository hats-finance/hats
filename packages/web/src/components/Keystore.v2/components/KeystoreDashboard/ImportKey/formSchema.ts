import { TFunction } from "react-i18next";
import * as Yup from "yup";

export const getImportKeySchema = (intl: TFunction) =>
  Yup.object().shape({
    alias: Yup.string()
      .min(3, intl("min-characters", { min: 3 }))
      .required(intl("required")),
    privateKey: Yup.string().required(intl("required")),
    passphrase: Yup.string(),
  });
