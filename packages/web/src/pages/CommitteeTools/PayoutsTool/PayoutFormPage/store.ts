import { createContext } from "react";
import { IPayoutResponse, IVault } from "types";

export interface IPayoutFormContext {
  payout: IPayoutResponse | undefined;
  vault: IVault | undefined;
  isPayoutCreated: boolean;
  severitiesOptions:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
}

export const PayoutFormContext = createContext<IPayoutFormContext>(undefined as any);
