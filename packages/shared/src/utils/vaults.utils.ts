import axios, { AxiosResponse } from "axios";
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
          master {
            id
          }
        }
      }
    `;

    const subgraphsRequests = Object.values(ChainsConfig).map((chain) => {
      return axios.post(
        chain.subgraph,
        JSON.stringify({
          query: GET_ALL_VAULTS,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    const subgraphsResponses = await Promise.allSettled(subgraphsRequests);
    const fulfilledResponses = subgraphsResponses.filter((response) => response.status === "fulfilled");
    const subgraphsData = fulfilledResponses.map((res) => (res as PromiseFulfilledResult<AxiosResponse<any>>).value.data);

    const vaults: IVaultInfoWithCommittee[] = [];
    for (let i = 0; i < subgraphsData.length; i++) {
      const chainId = Object.values(ChainsConfig)[i].chain.id;

      if (!subgraphsData[i].data || !subgraphsData[i].data.vaults) continue;

      for (const vault of subgraphsData[i].data.vaults) {
        vaults.push({
          chainId,
          address: vault.id,
          master: vault.master.id,
          pid: vault.pid,
          version: vault.version,
          committee: vault.committee,
          registered: vault.registered,
          stakingToken: vault.stakingToken,
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
      master: vault.master.id,
      pid: vault.pid,
      version: vault.version,
      committee: vault.committee,
      registered: vault.registered,
      stakingToken: vault.stakingToken,
    };
  } catch (error) {
    return undefined;
  }
};

export const getAllVaultsAddressesByChain = async (chainId: number): Promise<{ id: string; registered: boolean }[]> => {
  if (!chainId) return [];

  try {
    const GET_VAULTS = `
    query getVaults {
      vaults(where: {version_not: "v1"}) {
        id
        registered
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

  if (isCommitteeMultisigMember) return "committee";
  if (isCommitteeMultisig) return "committee-multisig";
  if (isGovMember) return "gov";
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
          descriptionHash
        }
      }
    `;

    const subgraphsRequests = Object.values(ChainsConfig)
      .filter((chain) => (onlyMainnet ? !chain.chain.testnet : true))
      .map((chain) => {
        return fetch(chain.subgraph, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: GET_ALL_VAULTS,
          }),
        });
      });

    const subgraphsResponses = await Promise.allSettled(subgraphsRequests);
    const fulfilledResponses = subgraphsResponses.filter((response) => response.status === "fulfilled");
    const subgraphsData = await Promise.all(
      fulfilledResponses.map((res) => (res as PromiseFulfilledResult<Response>).value.json())
    );

    const vaults: IVaultOnlyDescription[] = [];
    for (let i = 0; i < subgraphsData.length; i++) {
      const chainId = Object.values(ChainsConfig)[i].chain.id;

      if (!subgraphsData[i].data || !subgraphsData[i].data.vaults) continue;

      for (const vault of subgraphsData[i].data.vaults) {
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
  };
};
