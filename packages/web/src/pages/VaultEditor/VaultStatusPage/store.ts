import { createContext } from "react";
import { IVaultStatusData } from "./types";

interface IVaultStatusContext {
  vaultAddress: string;
  vaultChainId: number;
  vaultData: IVaultStatusData;
}

export const VaultStatusContext = createContext<IVaultStatusContext>(undefined as any);
