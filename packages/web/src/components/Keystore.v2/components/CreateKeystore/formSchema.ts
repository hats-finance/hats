import { TFunction } from "react-i18next";
import * as Yup from "yup";

export const getCreateKeystoreSchema = (intl: TFunction) =>
  Yup.object().shape({
    password: Yup.string().required(intl("required")),
    confirmPassword: Yup.string()
      .required(intl("required"))
      .when("password", (password: string, schema: any) => {
        if (password) return schema.is([password], intl("passwords-must-match"));
      }),
  });
