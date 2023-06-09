import { createContext } from "react";
import { IVault } from "types";

interface IVaultDetailsContext {
  vault: IVault;
}

export const VaultDetailsContext = createContext<IVaultDetailsContext>(undefined as any);
