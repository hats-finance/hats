import { IVault, getAddressSafes } from "@hats.finance/shared";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import { FormSelectInputOption } from "components";
import { useEffect, useState } from "react";
import { appChains } from "settings";
import { shortenIfAddress } from "utils/addresses.utils";
import { useAccount } from "wagmi";
import { useVaults } from "../subgraph/vaults/useVaults";

type UserVaultsVersion = "v1" | "v2" | "all";

export const useUserVaults = (version: UserVaultsVersion = "all") => {
  const { allVaults } = useVaults();
  const { address } = useAccount();

  const [isLoading, setIsLoading] = useState(true);
  const [userVaults, setUserVaults] = useState<IVault[] | undefined>();
  const selectInputOptions: FormSelectInputOption[] =
    userVaults?.map((vault) => ({
      value: vault.id,
      label: vault.description?.["project-metadata"].name ?? vault.name,
      icon: vault.description?.["project-metadata"].icon,
      onHoverText: `${vault.version} - ${appChains[vault.chainId as number].chain.name}`,
      helper: (
        <div className="vault-address">
          {vault.version === "v1"
            ? `${shortenIfAddress(vault.master.address, { startLength: 6, endLength: 6 })} (PID: ${vault.pid})`
            : shortenIfAddress(vault.id, { startLength: 6, endLength: 6 })}
          <OpenIcon fontSize="small" />
        </div>
      ),
      onHelperClick: () =>
        window.open(
          appChains[vault.chainId as number].chain.blockExplorers?.default.url + "/address/" + vault.id ?? vault.master.address,
          "_blank"
        ),
    })) ?? [];

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
      const isSafeMember = userSafes.some((safeAddress) => safeAddress.toLowerCase() === vault.committee.toLowerCase());
      const isGovInVaultChain = userSafes.includes(appChains[vault.chainId as number].govMultisig ?? "none");

      if ((isGovInVaultChain || isSafeMember) && (version !== "all" ? vault.version === version : true)) foundVaults.push(vault);
    }

    setUserVaults(foundVaults);
    setIsLoading(false);
  };

  return {
    isLoading,
    userVaults,
    selectInputOptions,
  };
};
