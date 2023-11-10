import { ICommitteeMember, getGnosisSafeInfo } from "@hats-finance/shared";
import { isAddress } from "ethers/lib/utils";
import { readKey, readMessage } from "openpgp";
import { isUsernameAvailable } from "pages/HackerProfile/profilesService";
import { appChains } from "settings";
import * as Yup from "yup";
import { isEmailAddress } from "./emails.utils";
import { isGithubUsernameValid } from "./github.utils";
import { getTokenInfo } from "./tokens.utils";

export function checkUrl(url: string) {
  const urlRegex = new RegExp(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_+.~#()?&//=]*)/);
  return urlRegex.test(url);
}

function checkCommitHash(commitHash: string) {
  const commitHashRegex = new RegExp(/\b([a-f0-9]{40})\b/);
  return commitHashRegex.test(commitHash);
}

function checkUsername(username: string) {
  const usernameRegex = new RegExp(/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/);
  return usernameRegex.test(username);
}

export const getTestHackerUsername = (intl) => {
  return {
    name: "is-valid-username",
    test: async (value: string | undefined, ctx: Yup.TestContext) => {
      const isValidUsername = checkUsername(value ?? "");
      const isEmpty = value === "" || value === undefined;

      if (!isValidUsername && !isEmpty) return ctx.createError({ message: intl("invalid-username") });

      // If updating profile, username is not required
      if (ctx.parent._id) return true;

      // Check if username is available
      const isAvailable = await isUsernameAvailable(value);
      if (!isAvailable) return ctx.createError({ message: intl("username-not-available") });
      return true;
    },
  };
};

export const getTestValidGithubUsername = (intl) => {
  return {
    name: "is-valid-github",
    test: async (value: string | undefined, ctx: Yup.TestContext) => {
      const isEmpty = value === "" || value === undefined;

      if (isEmpty) return true;

      // Check if github username valid
      const isValid = await isGithubUsernameValid(value);
      if (!isValid) return ctx.createError({ message: intl("github-username-not-valid") });
      return true;
    },
  };
};

export const getTestWalletAddress = (intl) => {
  return {
    name: "is-address",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const isAdd = isAddress(value ?? "");
      const isEmpty = value === "" || value === undefined;

      return isAdd || isEmpty ? true : ctx.createError({ message: intl("invalid-address") });
    },
  };
};

export const getTestUrl = (intl) => {
  return {
    name: "is-url",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const isUrl = checkUrl(value ?? "");
      const isEmpty = value === "" || value === undefined;

      return isUrl || isEmpty ? true : ctx.createError({ message: intl("invalid-url") });
    },
  };
};

export const getTestNotUrl = (intl) => {
  return {
    name: "is-not-url",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const isUrl = checkUrl(value ?? "");
      const isEmpty = value === "" || value === undefined;

      return !isUrl || isEmpty ? true : ctx.createError({ message: intl("should-not-be-url") });
    },
  };
};

export const getTestGithubRepoUrl = (intl) => {
  return {
    name: "is-github-repo-url",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const isUrl = checkUrl(value ?? "");
      const isEmpty = value === "" || value === undefined;

      // Normal URL validation
      if (!isUrl && !isEmpty) return ctx.createError({ message: intl("invalid-url") });
      if (isEmpty) return true;

      // Should be:
      // [0] -> github.com
      // [1] -> organization name
      // [2] -> repo name
      const repoSections = value.replace("https://", "").replace("http://", "").split("/");

      if (repoSections[0] !== "github.com") return ctx.createError({ message: intl("not-github-url") });
      if (repoSections.length !== 3 || repoSections.some((sec) => !sec))
        return ctx.createError({ message: intl("invalid-github-url") });

      return true;
    },
  };
};

export const getTestGitCommitHash = (intl) => {
  return {
    name: "is-commit-hash",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const isCommitHash = checkCommitHash(value ?? "");
      const isEmpty = value === "" || value === undefined;

      return isCommitHash || isEmpty ? true : ctx.createError({ message: intl("invalid-commit-hash") });
    },
  };
};

export const getTestAddressOrUrl = (intl) => {
  return {
    name: "is-address-or-url",
    test: (value: string | undefined, ctx: Yup.TestContext) => {
      const isAdd = isAddress(value ?? "");
      const isUrl = checkUrl(value ?? "");
      const isEmpty = value === "" || value === undefined;

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
      const isEmpty = value === "" || value === undefined;

      return isValidEmail || isEmpty ? true : ctx.createError({ message: intl("invalid-email-address") });
    },
  };
};

export const getTestNumberInBetween = (
  intl,
  first: number,
  second: number,
  isPercentage: boolean,
  opts?: { smallError: boolean }
) => {
  return {
    name: `is-${isPercentage ? "percentage" : "number"}-between-${first}-and-${second}`,
    test: (value: number | undefined, ctx: Yup.TestContext) => {
      const valueToUse = value ?? 0;
      const isBetween = valueToUse >= first && valueToUse <= second;

      return isBetween
        ? true
        : ctx.createError({
            message: intl(opts?.smallError ? "valueShouldBeBetweenSmall" : "valueShouldBeBetween", {
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

export const getTestPGPKeyFormat = (intl, type: "public" | "private") => {
  return {
    name: `pgp-${type}-key-format`,
    test: async (value: string | undefined, ctx: Yup.TestContext) => {
      const isEmpty = value === "" || value === undefined;
      if (isEmpty || !value) return true;

      try {
        const timeout = (cb, interval) => () => new Promise<undefined>((resolve) => setTimeout(() => cb(resolve), interval));
        const onTimeout = timeout((resolve) => resolve(undefined), 200);

        const keyData = await Promise.race([readKey({ armoredKey: value }), onTimeout()]);
        if (!keyData)
          return ctx.createError({
            message: intl(type === "private" ? "private-key-badly-formatted" : "public-key-badly-formatted"),
          });

        const isValidType = type === "private" ? keyData.isPrivate() : !keyData.isPrivate();
        return isValidType
          ? true
          : ctx.createError({ message: intl(type === "private" ? "key-is-public-not-private" : "key-is-private-not-public") });
      } catch (error) {
        return ctx.createError({
          message: intl(type === "private" ? "private-key-badly-formatted" : "public-key-badly-formatted"),
        });
      }
    },
  };
};

export const getTestPGPMessageFormat = (intl) => {
  return {
    name: `pgp-message-format`,
    test: async (value: string | undefined, ctx: Yup.TestContext) => {
      const isEmpty = value === "" || value === undefined;
      if (isEmpty || !value) return true;

      try {
        const timeout = (cb, interval) => () => new Promise<undefined>((resolve) => setTimeout(() => cb(resolve), interval));
        const onTimeout = timeout((resolve) => resolve(undefined), 200);

        const isValidPGPMessage = await Promise.race([readMessage({ armoredMessage: value }), onTimeout()]);

        return isValidPGPMessage ? true : ctx.createError({ message: intl("pgp-message-badly-formatted") });
      } catch (error) {
        try {
          const isValidJSONDecryptionMessage = JSON.parse(value) && (JSON.parse(value).decrypted || JSON.parse(value).encrypted);
          return isValidJSONDecryptionMessage ? true : ctx.createError({ message: intl("pgp-message-badly-formatted") });
        } catch (error) {
          return ctx.createError({
            message: intl("pgp-message-badly-formatted"),
          });
        }
      }
    },
  };
};
