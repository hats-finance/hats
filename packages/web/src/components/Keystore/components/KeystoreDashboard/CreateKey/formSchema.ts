import { TFunction } from "react-i18next";
import * as Yup from "yup";

export const getCreateKeySchema = (intl: TFunction) =>
  Yup.object().shape({
    advancedMode: Yup.boolean(),
    alias: Yup.string()
      .min(3, intl("min-characters", { min: 3 }))
      .required(intl("required")),
    passphrase: Yup.string().when("advancedMode", (advancedMode: boolean, schema: any) => {
      if (advancedMode) return schema.min(5, intl("min-characters", { min: 5 }));
    }),
    name: Yup.string(),
    email: Yup.string(),
  });
