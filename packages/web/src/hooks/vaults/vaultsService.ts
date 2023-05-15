import { IMaster, IUserNft, IVault, IPayoutGraph } from "@hats-finance/shared";
import { appChains } from "settings";
import { GET_VAULTS } from "graphql/subgraph";

export type IGraphVaultsData = {
  test: ISubgraphData;
  prod: ISubgraphData;
};

export type ISubgraphData = {
  vaults: IVault[];
  masters: IMaster[];
  userNfts: IUserNft[];
  payouts: IPayoutGraph[];
};

type ISubgraphResponse = {
  data: ISubgraphData;
  chainId: number;
};

/**
 * Gets subgraph data
 * @param chainId - The chain id to get the subgraph data from
 * @param account - The address of the current user
 *
 * @returns The vaults info from the subgraph
 */
export async function getSubgraphData(chainId?: number, account?: string): Promise<ISubgraphResponse> {
  try {
  console.log("--> Called getSubgraphData");

    if (!chainId) throw new Error("Chain id not provided");

  console.log("--> Calling getSubgraphData fetch");
  
  const subgraphUrl = appChains[chainId].subgraph;
  const resTest = await fetch(subgraphUrl, {
    method: "POST",
    body: JSON.stringify({ query: GET_VAULTS, variables: { account } }),
    headers: { "Content-Type": "application/json" },
  });
  const dataJsonTest = await resTest.json();
  console.log("--> Called getSubgraphData fetch", dataJsonTest);

    if (!dataJsonTest.data) throw new Error(`Error fetching subgraph data on chain ${chainId}`);

    return { ...dataJsonTest, chainId };
  } catch (error) {
    throw new Error(`Unknown error: ${error}`);
  }
}
