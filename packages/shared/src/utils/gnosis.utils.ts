import { arbitrum, avalanche, bsc, gnosis, goerli, mainnet, optimism, polygon, sepolia } from "@wagmi/chains";
import axios from "axios";
import { utils } from "ethers";
import { meter, oasis } from "../config";
import { isServer } from "./general.utils";

export type IGnosisSafeInfoResponse = { isSafeAddress: boolean; owners: string[]; threshold: number };

export const getGnosisChainNameByChainId = (chainId: number): string => {
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
    case gnosis.id:
      return "gnosis-chain";
    case sepolia.id:
      return "sepolia";
    case oasis.id:
      return "oasis";
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
    case bsc.id:
      return "bnb";
    case gnosis.id:
      return "gno";
    case sepolia.id:
      return "sep";
    case oasis.id:
      return "sapphire";
    default:
      throw new Error(`Gnosis doesn't support chainId:${chainId} yet`);
  }
};

export const getGnosisSafeTxServiceBaseUrl = (chainId: number): string => {
  if (chainId === oasis.id) return `https://transaction.safe.oasis.io`;
  return `https://safe-transaction-${getGnosisChainNameByChainId(chainId)}.safe.global`;
};

export const getSafeWalletConnectLink = (address: string, chainId: number): string | undefined => {
  const safeDashboardLink = getSafeDashboardLink(address, chainId);
  if (!safeDashboardLink) return undefined;

  return `${safeDashboardLink}&appUrl=https%3A%2F%2Fapps-portal.safe.global%2Fwallet-connect`;
};

export const getSafeDashboardLink = (address: string, chainId: number): string | undefined => {
  try {
    if (!chainId) return "";
    const checksummedSafeAddress = utils.getAddress(address);

    if (chainId === oasis.id)
      return `https://safe.oasis.io/apps/open?safe=${getGnosisChainPrefixByChainId(chainId)}:${checksummedSafeAddress}`;
    return `https://app.safe.global/apps/open?safe=${getGnosisChainPrefixByChainId(chainId)}:${checksummedSafeAddress}`;
  } catch (error) {
    return undefined;
  }
};

export const getSafeHomeLink = (address: string, chainId: number): string | undefined => {
  try {
    if (!chainId) return "";
    const checksummedSafeAddress = utils.getAddress(address);

    if (chainId === oasis.id)
      return `https://safe.oasis.io/home?safe=${getGnosisChainPrefixByChainId(chainId)}:${checksummedSafeAddress}`;
    return `https://app.safe.global/home?safe=${getGnosisChainPrefixByChainId(chainId)}:${checksummedSafeAddress}`;
  } catch (error) {
    return undefined;
  }
};

const getGnosisTxsApiEndpoint = (txHash: string, chainId: number): string | undefined => {
  try {
    if (!chainId) return "";
    return `${getGnosisSafeTxServiceBaseUrl(chainId)}/api/v1/multisig-transactions/${txHash}`;
  } catch (error) {
    return undefined;
  }
};

const getGnosisSafeStatusApiEndpoint = (safeAddress: string, chainId: number): string | undefined => {
  try {
    if (!chainId) return "";
    const checksummedSafeAddress = utils.getAddress(safeAddress);
    return `${getGnosisSafeTxServiceBaseUrl(chainId)}/api/v1/safes/${checksummedSafeAddress}`;
  } catch (error) {
    return undefined;
  }
};

const getAddressSafesApiEndpoint = (walletAddress: string, chainId: number): string | undefined => {
  try {
    if (!chainId) return "";
    return `${getGnosisSafeTxServiceBaseUrl(chainId)}/api/v1/owners/${walletAddress}/safes`;
  } catch (error) {
    return undefined;
  }
};

export const isAGnosisSafeTx = async (tx: string, chainId: number | undefined): Promise<boolean> => {
  try {
    if (!chainId) throw new Error("Please provide chainId");

    const safeUrl = getGnosisTxsApiEndpoint(tx, chainId);
    if (!safeUrl) throw new Error("No url");

    const res = await axios.get(safeUrl);
    return !!res.data?.safeTxHash;
  } catch (error) {
    return false;
  }
};

export const getGnosisSafeInfo = async (
  address: string | undefined,
  chainId: number | undefined
): Promise<IGnosisSafeInfoResponse> => {
  try {
    if (!chainId || !address) throw new Error("Please provide address and chainId");

    const safeInfoStorage = isServer() ? null : JSON.parse(sessionStorage.getItem(`safeInfo-${chainId}-${address}`) ?? "null");

    const safeUrl = getGnosisSafeStatusApiEndpoint(address, chainId);
    if (!safeUrl) throw new Error("No url");

    const data = safeInfoStorage ?? (await axios.get(safeUrl)).data;
    !isServer() && sessionStorage.setItem(`safeInfo-${chainId}-${address}`, JSON.stringify(data));

    if (!data) throw new Error("No data");

    return {
      isSafeAddress: data.isSafeAddress ?? true,
      owners: data.owners,
      threshold: data.threshold,
    };
  } catch (error) {
    const defaultData = {
      isSafeAddress: false,
      owners: [],
      threshold: 0,
    };

    !isServer() && sessionStorage.removeItem(`safeInfo-${chainId}-${address}`);
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
  const isMember = members.map((add) => add.toLowerCase()).includes(address.toLowerCase());

  return isMember;
};

export const getAddressSafes = async (walletAddress: string, chainId: number | undefined): Promise<string[]> => {
  try {
    if (!chainId) throw new Error("Please provide chainId");

    const addressSafesStorage = isServer()
      ? null
      : JSON.parse(sessionStorage.getItem(`addressSafes-${chainId}-${walletAddress}`) ?? "null");

    const safeUrl = getAddressSafesApiEndpoint(walletAddress, chainId);
    if (!safeUrl) throw new Error("No url");

    const data = addressSafesStorage ?? (await axios.get(safeUrl)).data;
    !isServer() && sessionStorage.setItem(`addressSafes-${chainId}-${walletAddress}`, JSON.stringify(data));

    if (!data) throw new Error("No data");

    return data.safes ?? [];
  } catch (error) {
    const defaultData: { safes: string[] } = { safes: [] };

    !isServer() && sessionStorage.setItem(`addressSafes-${chainId}-${walletAddress}`, JSON.stringify(defaultData));
    return defaultData.safes;
  }
};
