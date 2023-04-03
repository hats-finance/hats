import { TFunction } from "react-i18next";
import * as Yup from "yup";
import { getTestWalletAddress, getTestNumberInBetween, getTestUrl } from "utils/yup.utils";

export const getPayoutDataYupSchema = (intl: TFunction) =>
  Yup.object().shape({
    beneficiary: Yup.string().test(getTestWalletAddress(intl)).required(intl("required")),
    title: Yup.string().required(intl("required")),
    severity: Yup.string().required(intl("required")),
    percentageToPay: Yup.number()
      .test(getTestNumberInBetween(intl, 0, 100, true))
      .required(intl("required"))
      .typeError(intl("required")),
    explanation: Yup.string().required(intl("required")),
    nftUrl: Yup.string().test(getTestUrl(intl)).required(intl("required")),
    additionalInfo: Yup.string().required(intl("required")),
  });
