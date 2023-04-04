import { TFunction } from "react-i18next";
import * as Yup from "yup";
import { getTestPGPKeyFormat } from "utils/yup.utils";

export const getSelectPublicKeySchema = (intl: TFunction) =>
  Yup.object().shape({
    publicKey: Yup.string().required(intl("required")).test(getTestPGPKeyFormat(intl, "public")),
  });
