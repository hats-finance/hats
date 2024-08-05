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
  hatBalance: number;
};

export const getAllTokenLocks = async (): Promise<IHATTokenLock[]> => {
  const tokenLocks: IHATTokenLock[] = [];
  let i = 0;

  do {
    try {
      const GET_ALL_TOKEN_LOCKS = `
        query getTokenLocks {
          hattokenLocks(first: 1000, skip: ${i * 1000}) {
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
            hatData {
              balance
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
            releasedAmount: tokneLock.releasedAmount,
            hatBalance: tokneLock.hatData?.balance ?? 0
          });
        }
      }

      i++;
    } catch (error) {
      return [];
    }
  } while (tokenLocks.length != 0 && tokenLocks.length % 1000 == 0);

  return tokenLocks;
};

export const getTokenLocksForToken = async (tokenAddress: string, chainId: number): Promise<IHATTokenLock[]> => {
  if (!tokenAddress || !chainId) return [];

  const tokenLocks: IHATTokenLock[] = [];
  let i = 0;

  do {
    try {
      const GET_TOKEN_LOCKS_FOR_TOKEN = `
        query getTokenLocks($tokenAddress: Bytes) {
          hattokenLocks(where: {token: $tokenAddress}, first: 1000, skip: ${i * 1000}) {
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
            hatData {
              balance
            }
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
          releasedAmount: tokneLock.releasedAmount,
          hatBalance: tokneLock.hatData?.balance ?? 0
        });
      }

      i++;
    } catch (error) {
      return [];
    }
  } while (tokenLocks.length != 0 && tokenLocks.length % 1000 == 0);

  return tokenLocks;
};
