import * as Yup from "yup";
import { isAddress } from "ethers/lib/utils";
import { isEmailAddress } from "./emails.utils";

export const getTestWalletAddress = (intl) => {
  return {
    name: "is-address",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const isAdd = isAddress(value ?? "");
      const isEmpty = value === "";

      return isAdd || isEmpty ? true : ctx.createError({ message: intl("invalid-address") });
    },
  };
};

export const getTestAddressOrUrl = (intl) => {
  return {
    name: "is-address-or-url",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const urlRegex = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);

      const isAdd = isAddress(value ?? "");
      const isUrl = urlRegex.test(value ?? "");
      const isEmpty = value === "";

      return isAdd || isUrl || isEmpty ? true : ctx.createError({ message: intl("invalid-address-or-url") });
    },
  };
};

export const getTestEmailAddress = (intl) => {
  return {
    name: "is-email-address",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const isValidEmail = isEmailAddress(value);
      const isEmpty = value === "";

      return isValidEmail || isEmpty ? true : ctx.createError({ message: intl("invalid-email-address") });
    },
  };
};
