import { mainnet, goerli, optimism, arbitrum, polygon, avalanche, bsc } from "@wagmi/chains";
import axios from "axios";
import { isServer } from "./general.utils";
import { utils } from "ethers";

const getGnosisChainNameByChainId = (chainId: number): string => {
  switch (chainId) {
    case mainnet.id:
      return "mainnet";
    case goerli.id:
      return "goerli";
    case arbitrum.id:
      return "arbitrum";
    case optimism.id:
      return "optimism";
    case polygon.id:
      return "polygon";
    case avalanche.id:
      return "avalanche";
    case bsc.id:
      return "bsc";
    default:
      throw new Error(`Gnosis doesn't support chainId:${chainId} yet`);
  }
};

export const getGnosisChainPrefixByChainId = (chainId: number): string => {
  switch (chainId) {
    case mainnet.id:
      return "eth";
    case goerli.id:
      return "gor";
    case arbitrum.id:
      return "arb1";
    case optimism.id:
      return "oeth";
    case polygon.id:
      return "matic";
    case avalanche.id:
      return "avax";
    case bsc.id:
      return "bnb";
    default:
      throw new Error(`Gnosis doesn't support chainId:${chainId} yet`);
  }
};

export const getSafeWalletConnectLink = (address: string, chainId: number): string => {
  return `${getSafeDashboardLink(address, chainId)}&appUrl=https%3A%2F%2Fapps-portal.safe.global%2Fwallet-connect`;
};

export const getSafeDashboardLink = (address: string, chainId: number): string => {
  return `https://app.safe.global/apps/open?safe=${getGnosisChainPrefixByChainId(chainId)}:${address}`;
};

const getGnosisTxsApiEndpoint = (txHash: string, chainId: number): string => {
  if (!chainId) return "";
  return `https://safe-transaction-${getGnosisChainNameByChainId(chainId)}.safe.global/api/v1/multisig-transactions/${txHash}`;
};

export const isAGnosisSafeTx = async (tx: string, chainId: number | undefined): Promise<boolean> => {
  try {
    if (!chainId) throw new Error("Please provide chainId");

    const res = await axios.get(getGnosisTxsApiEndpoint(tx, chainId));
    return !!res.data?.safeTxHash;
  } catch (error) {
    return false;
  }
};

const getGnosisSafeStatusApiEndpoint = (safeAddress: string, chainId: number): string => {
  if (!chainId) return "";
  const checksummedSafeAddress = utils.getAddress(safeAddress);
  return `https://safe-transaction-${getGnosisChainNameByChainId(chainId)}.safe.global/api/v1/safes/${checksummedSafeAddress}`;
};

export const getGnosisSafeInfo = async (
  address: string,
  chainId: number | undefined
): Promise<{ isSafeAddress: boolean; owners: string[]; threshold: number }> => {
  try {
    if (!chainId) throw new Error("Please provide chainId");

    const safeInfoStorage = isServer() ? null : JSON.parse(sessionStorage.getItem(`safeInfo-${chainId}-${address}`) ?? "null");
    const data = safeInfoStorage ?? (await axios.get(getGnosisSafeStatusApiEndpoint(address, chainId))).data;
    !isServer() && sessionStorage.setItem(`safeInfo-${chainId}-${address}`, JSON.stringify(data));

    if (!data) throw new Error("No data");

    return {
      isSafeAddress: data.isSafeAddress ?? true,
      owners: data.owners,
      threshold: data.threshold,
    };
  } catch (error) {
    console.log(error);
    const defaultData = {
      isSafeAddress: false,
      owners: [],
      threshold: 0,
    };

    !isServer() && sessionStorage.setItem(`safeInfo-${chainId}-${address}`, JSON.stringify(defaultData));
    return defaultData;
  }
};

export const isAddressAMultisigMember = async (
  multisigAddress: string | undefined,
  address: string | undefined,
  chainId: number | string | undefined
): Promise<boolean> => {
  if (!multisigAddress || !chainId || !address) return false;

  const members = (await getGnosisSafeInfo(multisigAddress, Number(chainId))).owners;
  const isMember = members.includes(address);

  return isMember;
};

const getAddressSafesApiEndpoint = (walletAddress: string, chainId: number): string => {
  if (!chainId) return "";
  return `https://safe-transaction-${getGnosisChainNameByChainId(chainId)}.safe.global/api/v1/owners/${walletAddress}/safes`;
};

export const getAddressSafes = async (walletAddress: string, chainId: number | undefined): Promise<string[]> => {
  try {
    if (!chainId) throw new Error("Please provide chainId");

    const addressSafesStorage = isServer()
      ? null
      : JSON.parse(sessionStorage.getItem(`addressSafes-${chainId}-${walletAddress}`) ?? "null");
    const data = addressSafesStorage ?? (await axios.get(getAddressSafesApiEndpoint(walletAddress, chainId))).data;
    !isServer() && sessionStorage.setItem(`addressSafes-${chainId}-${walletAddress}`, JSON.stringify(data));

    if (!data) throw new Error("No data");

    return data.safes;
  } catch (error) {
    console.log(error);
    const defaultData: string[] = [];

    !isServer() && sessionStorage.setItem(`addressSafes-${chainId}-${walletAddress}`, JSON.stringify(defaultData));
    return defaultData;
  }
};
