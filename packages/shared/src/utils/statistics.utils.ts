import axios from "axios";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { ChainsConfig } from "../config";

export const GET_PAYOUTS = `
  query getClaims {
    claims {
			claim
			createdAt
			approvedAt
			dismissedAt
			hackerReward
			hackerVestedReward
			committeeReward
			governanceHatReward
			vault {
				name
				version
				id
				stakingToken
				stakingTokenSymbol
				stakingTokenDecimals
				descriptionHash
			}
		}
  }
`;

export const getAllPayoutsStatistics = async () => {
  const subgraphsRequests = Object.values(ChainsConfig)
    .filter((chain) => !chain.chain.testnet)
    .map((chain) => {
      return axios.post(
        chain.subgraph,
        JSON.stringify({
          query: GET_PAYOUTS,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

  const subgraphsResponses = await Promise.all(subgraphsRequests);
  const subgraphsData = subgraphsResponses
    .map((res) => res.data.data.claims)
    .flat()
    .filter((claim) => claim.approvedAt);

  console.log(subgraphsResponses.map((res) => res.data.data.claims));

  // Get description for each vault
  for (const claimData of subgraphsData) {
    const res = await axios.get(`https://ipfs2.hats.finance/ipfs/${claimData.vault.descriptionHash}`);
    const descriptionData = res.data;

    claimData.vault.description = descriptionData;
  }

  let payoutsData = [];

  // Fill information
  for (const claimData of subgraphsData) {
    const immediate = BigNumber.from(claimData.hackerReward);
    const vested = BigNumber.from(claimData.hackerVestedReward);
    const committee = BigNumber.from(claimData.committeeReward);
    const governance = BigNumber.from(claimData.governanceHatReward);
    const total = immediate.add(vested).add(committee).add(governance);

    payoutsData.push({
      approvedAt: new Date(claimData.approvedAt * 1000),
      vaultName: (claimData.vault.description["project-metadata"] ?? claimData.vault.description["Project-metadata"]).name,
      vaultId: claimData.vault.id,
      vaultVersion: claimData.vault.version,
      vaultTokenSymbol: claimData.vault.stakingTokenSymbol,
      vaultTokenAddress: claimData.vault.stakingToken,
      totalPaid: Number(formatUnits(total, claimData.vault.stakingTokenDecimals)),
      immediatePayment: Number(formatUnits(immediate, claimData.vault.stakingTokenDecimals)),
      vestedPayment: Number(formatUnits(vested, claimData.vault.stakingTokenDecimals)),
      committeePayment: Number(formatUnits(committee, claimData.vault.stakingTokenDecimals)),
      governancePayment: Number(formatUnits(governance, claimData.vault.stakingTokenDecimals)),
    });
  }

  payoutsData.sort((a, b) => a.approvedAt.getTime() - b.approvedAt.getTime());
  payoutsData = payoutsData.map((payout) => ({ ...payout, approvedAt: payout.approvedAt.toLocaleDateString() }));
  return payoutsData;
};
