import * as Yup from "yup";
import { isAddress } from "ethers/lib/utils";

export const getTestWalletAddress = (intl) => {
  return {
    name: "is-address",
    test: (value: string | undefined, ctx: Yup.TestContext) =>
      isAddress(value ?? "") ? true : ctx.createError({ message: intl("invalid-address") }),
  };
};
