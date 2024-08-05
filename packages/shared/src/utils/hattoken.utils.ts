import axios from "axios";
import { ChainsConfig } from "../config";

export const getHATTokenTotalSupply = async (chainId: number): Promise<number> => {
  if (!chainId) return 0;

  try {
    const GET_HAT_TOKEN_TOTAL_SUPPLY = `
      query getHATTokenTotalSupply {
        hattokens {
          totalSupply
        }
      }
    `;

    const subgraphResponse = axios.post(
      ChainsConfig[chainId].subgraph,
      JSON.stringify({
        query: GET_HAT_TOKEN_TOTAL_SUPPLY,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const subgraphData = (await subgraphResponse).data;

    if (!subgraphData.data || !subgraphData.data?.hattokens) return 0;

    return subgraphData.data.hattokens[0].totalSupply;

  } catch (error) {
    return 0;
  }
};

export const getHATTokenBalanceOf = async (hatHolder: string, chainId: number): Promise<number> => {
  if (!hatHolder || !chainId) return 0;

  try {
    const GET_HAT_TOKEN_BALANCE_OF = `
      query getHATTokenBalanceOf($hatHolder: String) {
        hatholder(id: $hatHolder) {
          balance
        }
      }
    `;

    const subgraphResponse = axios.post(
      ChainsConfig[chainId].subgraph,
      JSON.stringify({
        query: GET_HAT_TOKEN_BALANCE_OF,
        variables: { hatHolder: hatHolder.toLowerCase() },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const subgraphData = (await subgraphResponse).data;

    if (!subgraphData.data || !subgraphData.data?.hatholder) return 0;

    return subgraphData.data.hatholder.balance;

  } catch (error) {
    return 0;
  }
};
