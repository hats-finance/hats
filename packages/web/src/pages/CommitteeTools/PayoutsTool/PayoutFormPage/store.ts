import { FormSelectInputOption } from "components";
import { createContext } from "react";
import { IPayoutResponse, IVault } from "types";

export interface IPayoutFormContext {
  payout: IPayoutResponse | undefined;
  vault: IVault | undefined;
  isPayoutCreated: boolean;
  severitiesOptions: FormSelectInputOption[] | undefined;
}

export const PayoutFormContext = createContext<IPayoutFormContext>(undefined as any);
