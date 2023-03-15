import { GET_STAKER } from "graphql/subgraph";
import { appChains } from "settings";
import { IStaker } from "types";

/**
 * Query the vaults subgrapt for staker data, we can know in which vaults a specific address has
 * staked. so we can then check eligibility for nft minting
 * @param chainId
 * @param address
 * @returns
 */
export async function getStakerData(chainId: number, address: string) {
  const subgraphUrl = appChains[chainId].subgraph;
  const res = await fetch(subgraphUrl, {
    method: "POST",
    body: JSON.stringify({ query: GET_STAKER, variables: { address } }),
    headers: { "Content-Type": "application/json" },
    cache: "default",
  });
  const dataJson = (await res.json()) as { data: { stakers: IStaker[] } };
  return dataJson.data.stakers;
}
