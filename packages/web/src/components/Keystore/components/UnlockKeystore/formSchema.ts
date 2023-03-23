import { TFunction } from "react-i18next";
import * as Yup from "yup";

export const getUnlockKeystoreSchema = (intl: TFunction) =>
  Yup.object().shape({
    password: Yup.string().required(intl("required")),
  });
