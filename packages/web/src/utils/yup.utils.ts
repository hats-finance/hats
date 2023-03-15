import * as Yup from "yup";
import { ICommitteeMember, getGnosisSafeInfo } from "@hats-finance/shared";
import { isAddress } from "ethers/lib/utils";
import { appChains } from "settings";
import { isEmailAddress } from "./emails.utils";
import { getTokenInfo } from "./tokens.utils";

function checkUrl(url: string) {
  const urlRegex = new RegExp(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_+.~#()?&//=]*)/);
  return urlRegex.test(url);
}

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

export const getTestUrl = (intl) => {
  return {
    name: "is-url",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const isUrl = checkUrl(value ?? "");
      const isEmpty = value === "";

      return isUrl || isEmpty ? true : ctx.createError({ message: intl("invalid-url") });
    },
  };
};

export const getTestAddressOrUrl = (intl) => {
  return {
    name: "is-address-or-url",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const isAdd = isAddress(value ?? "");
      const isUrl = checkUrl(value ?? "");
      const isEmpty = value === "";

      return isAdd || isUrl || isEmpty ? true : ctx.createError({ message: intl("invalid-address-or-url") });
    },
  };
};

export const getTestCommitteeMultisigForVault = (intl) => {
  return {
    name: "is-multisig-valid-for-vault",
    test: async (value: string | undefined, ctx: Yup.TestContext) => {
      const isAdd = isAddress(value ?? "");
      const isEmpty = value === "" || value === undefined;
      const { chainId } = ctx.parent;

      if (!chainId) return ctx.createError({ message: intl("required") });
      const isTesnet = appChains[chainId].chain.testnet;
      const MIN_COMMITTEE_MEMBERS = isTesnet ? 1 : 3;
      const MIN_SIGNERS = isTesnet ? 1 : 2;

      if (isEmpty) return true;
      if (!isAdd) return ctx.createError({ message: intl("invalid-address") });

      // Get the safe info
      const safeInfo = await getGnosisSafeInfo(value, +chainId);

      const { isSafeAddress, owners, threshold } = safeInfo;

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

export const getTestTokenAddress = (intl) => {
  return {
    name: "is-token-address",
    test: async (value: string | undefined, ctx: any) => {
      const isAdd = isAddress(value ?? "");
      const isEmpty = value === "" || value === undefined;
      const { chainId } = ctx.from[1].value.committee;

      if (!chainId) return ctx.createError({ message: intl("required") });

      if (isEmpty) return true;
      if (!isAdd) return ctx.createError({ message: intl("invalid-address") });

      try {
        // Get the safe info
        const tokeninfo = await getTokenInfo(value, chainId);
        const { isValidToken } = tokeninfo;

        if (!isValidToken) return ctx.createError({ message: intl("address-is-not-token") });

        return true;
      } catch (error) {
        console.log(error);
        return ctx.createError({ message: intl("address-is-not-token") });
      }
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

export const getTestMinAmountOfKeysOnMembers = (intl) => {
  return {
    name: `min-pgp-keys-required`,
    test: (value: any, ctx: Yup.TestContext) => {
      if (!value) return true;

      const pgpKeys = (value as ICommitteeMember[])
        .reduce((prev: string[], curr) => [...prev, ...curr["pgp-keys"].map((key) => key.publicKey)], [])
        .filter((key) => !!key);

      return pgpKeys.length > 0 ? true : ctx.createError({ message: intl("at-least-one-pgp-key-required") });
    },
  };
};
