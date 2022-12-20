import * as Yup from "yup";
import { isAddress } from "ethers/lib/utils";

export const getTestWalletAddress = (intl) => {
  return {
    name: "is-address",
    test: (value: string | undefined, ctx: Yup.TestContext) =>
      isAddress(value ?? "") ? true : ctx.createError({ message: intl("invalid-address") }),
  };
};

export const getTestAddressOrUrl = (intl) => {
  return {
    name: "is-address-or-url",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const urlRegex = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);

      const isAdd = isAddress(value ?? "");
      const isUrl = urlRegex.test(value ?? "");

      return isAdd || isUrl ? true : ctx.createError({ message: intl("invalid-address-or-url") });
    },
  };
};
