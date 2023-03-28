import { TFunction } from "react-i18next";
import * as Yup from "yup";

export const getCreateKeystoreSchema = (intl: TFunction) =>
  Yup.object().shape({
    password: Yup.string()
      .required(intl("required"))
      .min(5, intl("min-characters", { min: 5 })),
    confirmPassword: Yup.string()
      .required(intl("required"))
      .min(5, intl("min-characters", { min: 5 }))
      .when("password", (password: string, schema: any) => {
        if (password) return schema.is([password], intl("passwords-must-match"));
      }),
  });
