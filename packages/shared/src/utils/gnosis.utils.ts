import { arbitrum, avalanche, bsc, gnosis, goerli, mainnet, optimism, polygon, sepolia } from "@wagmi/chains";
import axios from "axios";
import { utils } from "ethers";
import { meter, oasis } from "../config";
import { isServer } from "./general.utils";

// Safe API Key configuration - must be set by consuming application
let safeApiKey: string | undefined;

export const setSafeApiKey = (apiKey: string) => {
  safeApiKey = apiKey;
};

export const getSafeApiKey = (): string | undefined => safeApiKey;

const getSafeAxiosConfig = () => {
  if (!safeApiKey) return {};
  return {
    headers: {
      Authorization: `Bearer ${safeApiKey}`,
    },
  };
};

// ============ Rate Limiting & Caching ============

// In-memory cache with TTL (5 minutes)
const CACHE_TTL_MS = 5 * 60 * 1000;
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();

// In-flight request deduplication
const pendingRequests = new Map<string, Promise<unknown>>();

// Rate limiting: max 4 requests per second (staying under Safe's 5/sec limit)
const REQUEST_INTERVAL_MS = 250;
let lastRequestTime = 0;
const requestQueue: Array<() => void> = [];
let isProcessingQueue = false;

const processQueue = () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  isProcessingQueue = true;

  const processNext = () => {
    if (requestQueue.length === 0) {
      isProcessingQueue = false;
      return;
    }

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    const delay = Math.max(0, REQUEST_INTERVAL_MS - timeSinceLastRequest);

    setTimeout(() => {
      const next = requestQueue.shift();
      if (next) {
        lastRequestTime = Date.now();
        next();
      }
      processNext();
    }, delay);
  };

  processNext();
};

const rateLimitedRequest = async <T>(url: string): Promise<T> => {
  // Check memory cache first
  const cached = memoryCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T;
  }

  // Check for in-flight request
  const pending = pendingRequests.get(url);
  if (pending) {
    return pending as Promise<T>;
  }

  // Create new request with rate limiting
  const requestPromise = new Promise<T>((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const response = await axios.get(url, getSafeAxiosConfig());
        memoryCache.set(url, { data: response.data, timestamp: Date.now() });
        resolve(response.data);
      } catch (error) {
        reject(error);
      } finally {
        pendingRequests.delete(url);
      }
    });
    processQueue();
  });

  pendingRequests.set(url, requestPromise);
  return requestPromise;
};

// Clear cache for a specific key (useful when data changes)
export const clearSafeCache = (key?: string) => {
  if (key) {
    memoryCache.delete(key);
  } else {
    memoryCache.clear();
  }
};

// ============ End Rate Limiting & Caching ============

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
  // New Safe API URL format using EIP3770 chain prefixes
  return `https://api.safe.global/tx-service/${getGnosisChainPrefixByChainId(chainId)}`;
};

export const getBaseSafeAppUrl = (chainId: number): string => {
  if (chainId === oasis.id) return `https://safe.oasis.io`;
  return `https://app.safe.global`;
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
    return `${getGnosisSafeTxServiceBaseUrl(chainId)}/api/v2/multisig-transactions/${txHash}`;
  } catch (error) {
    return undefined;
  }
};

const getGnosisSafeStatusApiEndpoint = (safeAddress: string, chainId: number): string | undefined => {
  try {
    if (!chainId) return "";
    const checksummedSafeAddress = utils.getAddress(safeAddress);
    // Note: /safes/{address}/ endpoint is only available in v1
    return `${getGnosisSafeTxServiceBaseUrl(chainId)}/api/v1/safes/${checksummedSafeAddress}`;
  } catch (error) {
    return undefined;
  }
};

const getAddressSafesApiEndpoint = (walletAddress: string, chainId: number): string | undefined => {
  try {
    if (!chainId) return "";
    // Note: /owners/{address}/safes/ endpoint is only available in v1
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

    const data = await rateLimitedRequest<{ safeTxHash?: string }>(safeUrl);
    return !!data?.safeTxHash;
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

    const safeUrl = getGnosisSafeStatusApiEndpoint(address, chainId);
    if (!safeUrl) throw new Error("No url");

    // Use rate-limited request with in-memory caching
    const data = await rateLimitedRequest<{ isSafeAddress?: boolean; owners: string[]; threshold: number }>(safeUrl);

    if (!data) throw new Error("No data");

    return {
      isSafeAddress: data.isSafeAddress ?? true,
      owners: data.owners,
      threshold: data.threshold,
    };
  } catch (error) {
    return {
      isSafeAddress: false,
      owners: [],
      threshold: 0,
    };
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

    const safeUrl = getAddressSafesApiEndpoint(walletAddress, chainId);
    if (!safeUrl) throw new Error("No url");

    // Use rate-limited request with in-memory caching
    const data = await rateLimitedRequest<{ safes?: string[] }>(safeUrl);

    if (!data) throw new Error("No data");

    return data.safes ?? [];
  } catch (error) {
    return [];
  }
};
