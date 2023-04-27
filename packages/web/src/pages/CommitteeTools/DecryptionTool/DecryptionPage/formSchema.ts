import { TFunction } from "react-i18next";
import * as Yup from "yup";
import { getTestPGPMessageFormat } from "utils/yup.utils";

export const getDecryptMessageSchema = (intl: TFunction) =>
  Yup.object().shape({
    encryptedMessage: Yup.string().required(intl("required")).test(getTestPGPMessageFormat(intl)),
    decryptedMessage: Yup.string(),
  });
