import * as Yup from "yup";
import { isAddress } from "ethers/lib/utils";
import { isEmailAddress } from "./emails.utils";
import { getGnosisSafeInfo } from "./gnosis.utils";

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

export const getTestCommitteeMultisigForVault = (intl) => {
  return {
    name: "is-multisig-valid-for-vault",
    test: async (value: string | undefined, ctx: Yup.TestContext) => {
      const MIN_COMMITTEE_MEMBERS = 3;
      const MIN_SIGNERS = 2;

      const isAdd = isAddress(value ?? "");
      const isEmpty = value === "" || value === undefined;
      const { chainId } = ctx.parent;

      if (!chainId) return ctx.createError({ message: intl("required") });

      if (isEmpty) return true;
      if (!isAdd) return ctx.createError({ message: intl("invalid-address") });

      // Get the safe info
      const { isSafeAddress, owners, threshold } = await getGnosisSafeInfo(value, +chainId);
      console.log(isSafeAddress, owners, threshold);

      if (!isSafeAddress) return ctx.createError({ message: intl("not-safe-address") });
      if (owners.length < MIN_COMMITTEE_MEMBERS) {
        return ctx.createError({ message: intl("not-enough-safe-members", { min: MIN_COMMITTEE_MEMBERS, now: owners.length }) });
      }
      if (threshold < MIN_SIGNERS) {
        return ctx.createError({ message: intl("not-enough-safe-signers", { min: MIN_SIGNERS, now: threshold }) });
      }

      return true;
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

export const getTestNumberInBetween = (intl, first: number, second: number, isPercentage: boolean) => {
  return {
    name: `is-${isPercentage ? "percentage" : "number"}-between-${first}-and-${second}`,
    test: (value: number | undefined, ctx: Yup.TestContext) => {
      const valueToUse = value ?? 0;
      const isBetween = valueToUse >= first && valueToUse <= second;

      return isBetween
        ? true
        : ctx.createError({
            message: intl("valueShouldBeBetween", {
              first: `${!isPercentage ? first : `${first}%`}`,
              second: `${!isPercentage ? second : `${second}%`}`,
            }),
          });
    },
  };
};
