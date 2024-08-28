import { TFunction } from "react-i18next";
import * as Yup from "yup";

export const getCuratorFormYupSchema = (intl: TFunction) =>
  Yup.object().shape({
    roles: Yup.array().of(Yup.string()).min(1, intl("required")).required(intl("required")),
    services: Yup.array().of(Yup.string()).min(1, intl("required")).required(intl("required")),
    whyInterested: Yup.string().required(intl("required")),
    workedWithweb3Security: Yup.boolean().required(intl("required")),
    workedWithweb3SecurityDescription: Yup.string(),
    shortBio: Yup.string().required(intl("required")),
    termsAndConditions: Yup.boolean().oneOf([true]).required(intl("required")),
    telegramHandle: Yup.string().required(intl("required")),
    discordHandle: Yup.string().required(intl("required")),
  });
