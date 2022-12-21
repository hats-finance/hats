import { IAirdropData } from "hooks/nft/types";
import { createContext } from "react";

export interface IAirdropMachineContext {
  airdropData: IAirdropData;
  closeRedeemModal: () => void;
  address: string | undefined;
  handleRedeem: () => Promise<void>;
}

export const AirdropMachineContext = createContext<IAirdropMachineContext>(undefined as any);
