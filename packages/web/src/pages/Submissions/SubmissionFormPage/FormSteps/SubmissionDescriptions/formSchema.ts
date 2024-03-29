import { TFunction } from "react-i18next";
import * as Yup from "yup";

export const getCreateDescriptionSchema = (intl: TFunction) =>
  Yup.object().shape({
    descriptions: Yup.array().of(
      Yup.object({
        title: Yup.string()
          .min(5, intl("min-characters", { min: 5 }))
          .required(intl("required")),
        severity: Yup.string().required(intl("required")),
        description: Yup.string()
          .min(20, intl("min-characters", { min: 20 }))
          .required(intl("required")),
      })
    ),
  });
