import { CuratorRole, IVault } from "@hats.finance/shared";
import { getProfileByUsername } from "pages/HackerProfile/profilesService";

const roleToPercentage = (role: CuratorRole) => {
  switch (role) {
    case "growthSeeker":
      return 10;
    case "growthGenius":
      return 15;
    case "growthWizard":
      return 50;
    default:
      console.log("ERROR: Curator role not set. Please set role percentage. Contact Hats Governance");
      throw new Error("Curator role not set. Please set role percentage. Contact Hats Governance");
  }
};

export const getVaultCurator = async (
  vault: IVault
): Promise<{ username: string; address: string; role: string; percentage: number } | undefined> => {
  const curator = vault.description?.["project-metadata"].curator;
  if (!vault || !curator || !curator.username) return undefined;

  const curatorProfile = await getProfileByUsername(curator.username);
  if (!curatorProfile) throw new Error("Curator not found");

  try {
    return {
      username: curatorProfile.username,
      address: curatorProfile.addresses[0],
      role: curator.role,
      percentage: roleToPercentage(curator.role),
    };
  } catch (error) {
    console.log(`ERROR: ${error}`);
    throw error;
  }
};

// return vault.stakers.map((staker) => ({
//   address: staker.address,
//   shares: Number(formatUnits(BigNumber.from(staker.shares), +vault.stakingTokenDecimals)),
//   ownership: +(
//     (+formatUnits(BigNumber.from(staker.shares), +vault.stakingTokenDecimals) /
//       +formatUnits(BigNumber.from(vault.totalUsersShares), +vault.stakingTokenDecimals)) *
//     100
//   ).toFixed(2),
// }));
