import { useEffect, useState } from "react";
import { getAddressSafes, IVault } from "@hats-finance/shared";
import { useAccount } from "wagmi";
import { useVaults } from "./useVaults";

type UserVaultsVersion = "v1" | "v2" | "all";

export const useUserVaults = (version: UserVaultsVersion = "all") => {
  const { allVaults } = useVaults();
  const { address } = useAccount();

  const [isLoading, setIsLoading] = useState(true);
  const [userVaults, setUserVaults] = useState<IVault[] | undefined>();

  useEffect(() => {
    if (!address) return;
    if (!allVaults || allVaults.length === 0) return;

    getUserVaults(address, allVaults, version);
  }, [address, allVaults, version]);

  /**
   * Retrieves the user's vaults based on their address and vault version.
   *
   * @param address - The user's wallet address.
   * @param allVaults - An array of all available vaults.
   * @param version - The version of the vaults to retrieve ("v1", "v2", or "all").
   */
  const getUserVaults = async (address: string, allVaults: IVault[], version: UserVaultsVersion) => {
    const foundVaults = [] as IVault[];
    for (const vault of allVaults) {
      if (!vault.description) continue;

      const userSafes = await getAddressSafes(address, vault.chainId);
      const isSafeMember = userSafes.some((safeAddress) => safeAddress === vault.description?.committee["multisig-address"]);

      if (isSafeMember && (version !== "all" ? vault.version === version : true)) foundVaults.push(vault);
    }

    setUserVaults(foundVaults);
    setIsLoading(false);
  };

  return {
    isLoading,
    userVaults,
  };
};
