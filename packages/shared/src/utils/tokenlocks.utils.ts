import axios, { AxiosResponse } from "axios";
import { ChainsConfig } from "../config";

export type IHATTokenLock = {
  id: string;
  chainId: number;
  factory: string;
  owner: string;
  beneficiary: string;
  token: string;
  managedAmount: number;
  startTime: number;
  endTime: number;
  periods: number;
  releaseStartTime: number;
  vestingCliffTime: number;
  revocable: boolean;
  canDelegate: boolean;
  isAccepted: boolean;
  isCanceled: boolean;
  isRevoked: boolean;
  releasedAmount: number;
};

export const getAllTokenLocks = async (): Promise<IHATTokenLock[]> => {
  try {
    const GET_ALL_TOKEN_LOCKS = `
      query getTokenLocks {
        hattokenLocks {
          id
          factory {
            id
          }
          owner
          beneficiary
          token
          managedAmount
          startTime
          endTime
          periods
          releaseStartTime
          vestingCliffTime
          revocable
          canDelegate
          isAccepted
          isCanceled
          isRevoked
          releasedAmount
        }
      }
    `;

    const subgraphsRequests = Object.values(ChainsConfig).map(async (chain) => {
      return {
        chainId: chain.chain.id,
        request: await axios.post(
          chain.subgraph,
          JSON.stringify({
            query: GET_ALL_TOKEN_LOCKS,
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

    const tokenLocks: IHATTokenLock[] = [];
    for (let i = 0; i < subgraphsData.length; i++) {
      const chainId = subgraphsData[i].chainId;

      if (!subgraphsData[i].request.data || !subgraphsData[i].request.data?.data?.hattokenLocks) continue;

      for (const tokneLock of subgraphsData[i].request.data.data.hattokenLocks) {
        tokenLocks.push({
          chainId,
          id: tokneLock.id,
          factory: tokneLock.factory.id,
          owner: tokneLock.owner,
          beneficiary: tokneLock.beneficiary,
          token: tokneLock.token,
          managedAmount: tokneLock.managedAmount,
          startTime: tokneLock.startTime,
          endTime: tokneLock.endTime,
          periods: tokneLock.periods,
          releaseStartTime: tokneLock.releaseStartTime,
          vestingCliffTime: tokneLock.vestingCliffTime,
          revocable: tokneLock.revocable,
          canDelegate: tokneLock.canDelegate,
          isAccepted: tokneLock.isAccepted,
          isCanceled: tokneLock.isCanceled,
          isRevoked: tokneLock.isRevoked,
          releasedAmount: tokneLock.releasedAmount
        });
      }
    }

    return tokenLocks;
  } catch (error) {
    return [];
  }
};

export const getTokenLocksForToken = async (tokenAddress: string, chainId: number): Promise<IHATTokenLock[]> => {
  if (!tokenAddress || !chainId) return [];

  try {
    const GET_TOKEN_LOCKS_FOR_TOKEN = `
      query getTokenLocks($tokenAddress: Bytes) {
        hattokenLocks(where: {token: $tokenAddress}) {
          id
          factory {
            id
          }
          owner
          beneficiary
          token
          managedAmount
          startTime
          endTime
          periods
          releaseStartTime
          vestingCliffTime
          revocable
          canDelegate
          isAccepted
          isCanceled
          isRevoked
          releasedAmount
        }
      }
    `;

    const subgraphResponse = axios.post(
      ChainsConfig[chainId].subgraph,
      JSON.stringify({
        query: GET_TOKEN_LOCKS_FOR_TOKEN,
        variables: { tokenAddress },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const subgraphData = (await subgraphResponse).data;

    const tokenLocks: IHATTokenLock[] = [];
    if (!subgraphData.data || !subgraphData.data?.hattokenLocks) return [];

    for (const tokneLock of subgraphData.data.hattokenLocks) {
      tokenLocks.push({
        chainId,
        id: tokneLock.id,
        factory: tokneLock.factory.id,
        owner: tokneLock.owner,
        beneficiary: tokneLock.beneficiary,
        token: tokneLock.token,
        managedAmount: tokneLock.managedAmount,
        startTime: tokneLock.startTime,
        endTime: tokneLock.endTime,
        periods: tokneLock.periods,
        releaseStartTime: tokneLock.releaseStartTime,
        vestingCliffTime: tokneLock.vestingCliffTime,
        revocable: tokneLock.revocable,
        canDelegate: tokneLock.canDelegate,
        isAccepted: tokneLock.isAccepted,
        isCanceled: tokneLock.isCanceled,
        isRevoked: tokneLock.isRevoked,
        releasedAmount: tokneLock.releasedAmount
      });
    }

    return tokenLocks;
  } catch (error) {
    return [];
  }
};
