import { createContext } from "react";
import { VaultEditorAddressRole } from "../types";
import { IVaultStatusData } from "./types";

interface IVaultStatusContext {
  vaultAddress: string;
  vaultChainId: number;
  vaultData: IVaultStatusData;
  loadVaultData: (vaultAddress: string, chainId: number) => Promise<void>;
  refreshVaultData: () => Promise<void>;
  userPermissionData: { canEditVault: boolean; role: VaultEditorAddressRole };
}

export const VaultStatusContext = createContext<IVaultStatusContext>(undefined as any);
