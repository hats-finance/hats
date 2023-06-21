import { createContext } from "react";

export interface IVaultDepositsSectionContext {
  handleWithdrawRequest: () => void;
}

export const VaultDepositsSectionContext = createContext<IVaultDepositsSectionContext>(undefined as any);
