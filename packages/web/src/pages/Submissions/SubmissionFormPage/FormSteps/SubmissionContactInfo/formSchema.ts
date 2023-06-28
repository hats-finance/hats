import { TFunction } from "react-i18next";
import { getTestEmailAddress, getTestWalletAddress } from "utils/yup.utils";
import * as Yup from "yup";
import { ISubmissionContactData } from "../../types";

export const getCreateContactInfoSchema = (intl: TFunction) =>
  Yup.object().shape({
    beneficiary: Yup.string().test(getTestWalletAddress(intl)),
    communicationChannelType: Yup.string().required(intl("required")),
    communicationChannel: Yup.string()
      .required(intl("required"))
      .when("communicationChannelType", (type: ISubmissionContactData["communicationChannelType"], schema: any) => {
        if (type === "email") return schema.test(getTestEmailAddress(intl));
        return schema.min(3, intl("min-characters", { min: 3 })).required(intl("required"));
      }),
    githubUsername: Yup.string(),
  });
