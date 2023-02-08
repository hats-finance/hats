import { createContext } from "react";
import { IVaultStatusData } from "./types";

interface IVaultStatusContext {
  vaultAddress: string;
  vaultChainId: number;
  vaultData: IVaultStatusData;
  loadVaultData: (vaultAddress: string, chainId: number) => Promise<void>;
}

export const VaultStatusContext = createContext<IVaultStatusContext>(undefined as any);
