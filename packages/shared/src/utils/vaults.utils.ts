import axios, { AxiosResponse } from "axios";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import { ChainsConfig } from "../config";
import { IAddressRoleInVault, IVault, IVaultDescription, IVaultInfo } from "../types";
import { isAddressAMultisigMember } from "./gnosis.utils";
import { isValidIpfsHash } from "./ipfs.utils";
import { fixObject } from "./vaultEditor.utils";

export type IVaultInfoWithCommittee = IVaultInfo & { committee: string; registered: boolean };

export const getAllVaultsInfoWithCommittee = async (): Promise<IVaultInfoWithCommittee[]> => {
  try {
    const GET_ALL_VAULTS = `
      query getVaults {
        vaults {
          id
          pid
          registered
          version
          committee
          stakingToken
          claimsManager
          master {
            id
          }
        }
      }
    `;

    const subgraphsRequests = Object.values(ChainsConfig).map(async (chain) => {
      return {
        chainId: chain.chain.id,
        request: await axios.post(
          chain.subgraph,
          JSON.stringify({
            query: GET_ALL_VAULTS,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
      };
    });

    const subgraphsResponses = await Promise.allSettled(subgraphsRequests);
    const fulfilledResponses = subgraphsResponses.filter((response) => response.status === "fulfilled");
    const subgraphsData = fulfilledResponses.map(
      (res) => (res as PromiseFulfilledResult<{ chainId: number; request: AxiosResponse<any> }>).value
    );

    const vaults: IVaultInfoWithCommittee[] = [];
    for (let i = 0; i < subgraphsData.length; i++) {
      const chainId = subgraphsData[i].chainId;

      if (!subgraphsData[i].request.data || !subgraphsData[i].request.data?.data?.vaults) continue;

      for (const vault of subgraphsData[i].request.data.data.vaults) {
        vaults.push({
          chainId,
          address: vault.id,
          master: vault.master.address,
          pid: vault.pid,
          version: vault.version,
          committee: vault.committee,
          registered: vault.registered,
          stakingToken: vault.stakingToken,
          claimsManager: vault.claimsManager,
        });
      }
    }

    return vaults;
  } catch (error) {
    return [];
  }
};

export const getVaultInfoWithCommittee = async (
  vaultId: string,
  chainId: number
): Promise<IVaultInfoWithCommittee | undefined> => {
  try {
    if (!vaultId || !chainId) return undefined;

    const GET_VAULT_BY_ID = `
      query getVaults($vaultId: String) {
        vaults(where: {id: $vaultId}) {
          id
          pid
          registered
          version
          committee
          stakingToken
          claimsManager
          master {
            id
          }
        }
      }
    `;

    const subgraphResponse = axios.post(
      ChainsConfig[chainId].subgraph,
      JSON.stringify({
        query: GET_VAULT_BY_ID,
        variables: { vaultId },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const subgraphData = (await subgraphResponse).data;
    const vault = subgraphData?.data?.vaults?.[0];

    if (!vault) return undefined;

    return {
      chainId,
      address: vault.id,
      master: vault.master.address,
      pid: vault.pid,
      version: vault.version,
      committee: vault.committee,
      registered: vault.registered,
      stakingToken: vault.stakingToken,
      claimsManager: vault.claimsManager,
    };
  } catch (error) {
    return undefined;
  }
};

export const getAllVaultsAddressesByChain = async (
  chainId: number
): Promise<{ id: string; registered: boolean; version: IVault["version"]; claimsManager: IVault["claimsManager"] }[]> => {
  if (!chainId) return [];

  try {
    const GET_VAULTS = `
    query getVaults {
      vaults(where: {version_not: "v1"}) {
        id
        registered
        claimsManager
        version
      }
    }
  `;

    const subgraphResponse = axios.post(
      ChainsConfig[chainId].subgraph,
      JSON.stringify({
        query: GET_VAULTS,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const subgraphData = (await subgraphResponse).data;
    const vaults = subgraphData?.data?.vaults;

    if (!vaults) return [];

    return vaults;
  } catch (error) {
    return [];
  }
};

export const getVaultDescriptionHash = async (vaultId: string, chainId: number): Promise<string | undefined> => {
  try {
    if (!vaultId || !chainId) return undefined;

    const GET_VAULT_BY_ID = `
      query getVaults($vaultId: String) {
        vaults(where: {id: $vaultId}) {
          id
          descriptionHash
        }
      }
    `;

    const subgraphResponse = axios.post(
      ChainsConfig[chainId].subgraph,
      JSON.stringify({
        query: GET_VAULT_BY_ID,
        variables: { vaultId },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const subgraphData = (await subgraphResponse).data;
    const vault = subgraphData?.data?.vaults?.[0];

    if (!vault) return undefined;

    return vault.descriptionHash;
  } catch (error) {
    return undefined;
  }
};

export const getAddressRoleOnVault = async (
  address: string | undefined,
  vaultChainId: string | number | undefined,
  vaultCommittee: string | undefined
): Promise<IAddressRoleInVault> => {
  if (!address || !vaultCommittee || !vaultChainId) return "none";

  const govMultisig = ChainsConfig[Number(vaultChainId)].govMultisig;
  const committeeMultisig = vaultCommittee;

  const isCommitteeMultisig = committeeMultisig === address;
  const isCommitteeMultisigMember = await isAddressAMultisigMember(committeeMultisig, address, vaultChainId);
  const isGovMember = await isAddressAMultisigMember(govMultisig, address, vaultChainId);
  const whitelistedReviewers = ChainsConfig[Number(vaultChainId)].whitelistedReviewers ?? [];
  const whitelistedReviewersLowerCase = whitelistedReviewers.map((reviewer) => reviewer.toLowerCase());
  const isWhiteListedEditor = whitelistedReviewersLowerCase.includes(address.toLowerCase());

  if (isCommitteeMultisigMember) return "committee";
  if (isCommitteeMultisig) return "committee-multisig";
  if (isGovMember) return "gov";
  if (isWhiteListedEditor) return "reviewer";
  return "none";
};

export type IVaultOnlyDescription = {
  id: string;
  pid: string;
  chainId: number;
  registered: boolean;
  descriptionHash: string;
  description: IVault["description"];
};

export const getAllVaultsWithDescription = async (onlyMainnet = true): Promise<IVaultOnlyDescription[]> => {
  try {
    const GET_ALL_VAULTS = `
      query getVaults {
        vaults {
          id
          pid
          registered
          stakingToken
          stakingTokenDecimals
          descriptionHash
        }
      }
    `;

    const subgraphsRequests = Object.values(ChainsConfig).map(async (chain) => {
      return {
        chainId: chain.chain.id,
        request: await axios.post(
          chain.subgraph,
          JSON.stringify({
            query: GET_ALL_VAULTS,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
      };
    });

    const subgraphsResponses = await Promise.allSettled(subgraphsRequests);
    const fulfilledResponses = subgraphsResponses.filter((response) => response.status === "fulfilled");
    const subgraphsData = fulfilledResponses.map(
      (res) => (res as PromiseFulfilledResult<{ chainId: number; request: AxiosResponse<any> }>).value
    );

    const vaults: IVaultOnlyDescription[] = [];
    for (let i = 0; i < subgraphsData.length; i++) {
      const chainId = subgraphsData[i].chainId;

      if (!subgraphsData[i].request.data || !subgraphsData[i].request.data.data.vaults) continue;

      for (const vault of subgraphsData[i].request.data.data.vaults) {
        vaults.push({
          chainId,
          ...vault,
        });
      }
    }

    const loadVaultDescription = async (vault: IVaultOnlyDescription): Promise<IVaultDescription | undefined> => {
      if (isValidIpfsHash(vault.descriptionHash)) {
        try {
          const dataResponse = await fetch(`https://ipfs2.hats.finance/ipfs/${vault.descriptionHash}`);
          if (dataResponse.status === 200) {
            const object = await dataResponse.json();
            return fixObject(object) as any;
          }
          return undefined;
        } catch (error) {
          // console.error(error);
          return undefined;
        }
      }
      return undefined;
    };

    // Load descriptions
    const getVaultsData = async (vaultsToFetch: IVaultOnlyDescription[]): Promise<IVaultOnlyDescription[]> =>
      Promise.all(
        vaultsToFetch.map(async (vault) => {
          const description = (await loadVaultDescription(vault)) as IVaultDescription;

          return {
            ...vault,
            description,
          } as IVaultOnlyDescription;
        })
      );

    const vaultsWithDescription = await getVaultsData(vaults);

    return vaultsWithDescription;
  } catch (error) {
    return [];
  }
};

export const getVaultInfoFromVault = (vault: IVault): IVaultInfo => {
  return {
    version: vault.version,
    address: vault.id,
    chainId: vault.chainId as number,
    master: vault.master.address,
    pid: vault.pid,
    stakingToken: vault.stakingToken,
    claimsManager: vault.claimsManager,
  };
};

/*
 * Get the depositors of a vault
 * @param vault - The vault to get the depositors from
 *
 * @returns An array of depositors with their shares and ownership (percentage of the vault shares they own)
 *
 */
export const getVaultDepositors = (vault: IVault): { address: string; shares: number; ownership: number }[] => {
  if (!vault || !vault.stakers) return [];

  return vault.stakers.map((staker) => ({
    address: staker.address,
    shares: Number(formatUnits(BigNumber.from(staker.shares), +vault.stakingTokenDecimals)),
    ownership: +(
      (+formatUnits(BigNumber.from(staker.shares), +vault.stakingTokenDecimals) /
        +formatUnits(BigNumber.from(vault.totalUsersShares), +vault.stakingTokenDecimals)) *
      100
    ).toFixed(2),
  }));
};
