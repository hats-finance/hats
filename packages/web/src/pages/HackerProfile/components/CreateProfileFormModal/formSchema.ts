import { TFunction } from "react-i18next";
import { getTestNotUrl, getTestUsername } from "utils/yup.utils";
import * as Yup from "yup";

export const getCreateProfileYupSchema = (intl: TFunction) =>
  Yup.object().shape({
    username: Yup.string().test(getTestUsername(intl)).required(intl("required")),
    title: Yup.string().max(120, intl("max-characters", { max: 120 })),
    bio: Yup.string().max(300, intl("max-characters", { max: 300 })),
    twitter_username: Yup.string().test(getTestNotUrl(intl)),
    github_username: Yup.string().test(getTestNotUrl(intl)),
    avatar: Yup.string(),
  });
