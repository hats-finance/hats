import { createContext } from "react";
import { IAddressRoleInVault, IVaultStatusData } from "@hats.finance/shared";

interface IVaultStatusContext {
  vaultAddress: string;
  vaultChainId: number;
  vaultData: IVaultStatusData;
  loadVaultData: (vaultAddress: string, chainId: number) => Promise<void>;
  refreshVaultData: () => Promise<void>;
  userPermissionData: { canEditVault: boolean; role: IAddressRoleInVault };
}

export const VaultStatusContext = createContext<IVaultStatusContext>(undefined as any);
