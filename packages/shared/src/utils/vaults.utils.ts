import axios from "axios";
import { ChainsConfig } from "../config";
import { IAddressRoleInVault, IVault, IVaultInfo } from "../types";
import { isAddressAMultisigMember } from "./gnosis.utils";

export type IVaultInfoWithCommittee = IVaultInfo & { committee: string };

export const getAllVaultsInfoWithCommittee = async (): Promise<IVaultInfoWithCommittee[]> => {
  try {
    const GET_ALL_VAULTS = `
      query getVaults {
        vaults {
          id
          pid
          version
          committee
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

    const subgraphsResponses = await Promise.all(subgraphsRequests);
    const subgraphsData = subgraphsResponses.map((res) => res.data);

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
          version
          committee
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
    };
  } catch (error) {
    return undefined;
  }
};

export const getAllVaultsAddressesByChain = async (chainId: number): Promise<string[]> => {
  if (!chainId) return [];

  try {
    const GET_VAULTS = `
    query getVaults {
      vaults(where: {version_not: "v1"}) {
        id
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

    return vaults.map((vault: { id: string }) => vault.id);
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

export const getVaultInfoFromVault = (vault: IVault): IVaultInfo => {
  return {
    version: vault.version,
    address: vault.id,
    chainId: vault.chainId as number,
    master: vault.master.address,
    pid: vault.pid,
  };
};
