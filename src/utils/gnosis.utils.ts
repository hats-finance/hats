import { mainnet, goerli, optimism, arbitrum, polygon, avalanche, bsc } from "wagmi/chains";
import axios from "axios";

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
  return `https://safe-transaction-${getGnosisChainNameByChainId(chainId)}.safe.global/api/v1/safes/${safeAddress}`;
};

export const getGnosisSafeInfo = async (
  address: string,
  chainId: number | undefined
): Promise<{ isSafeAddress: boolean; owners: string[]; threshold: number }> => {
  try {
    if (!chainId) throw new Error("Please provide chainId");

    const res = await axios.get(getGnosisSafeStatusApiEndpoint(address, chainId));
    const data = res.data;

    if (!data) throw new Error("No data");

    return {
      isSafeAddress: true,
      owners: data.owners,
      threshold: data.threshold,
    };
  } catch (error) {
    console.log(error);
    return {
      isSafeAddress: false,
      owners: [],
      threshold: 0,
    };
  }
};
