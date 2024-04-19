import { AirdropElegibility } from "pages/Airdrops/utils/getAirdropElegibility";
import { AirdropRedeemData } from "pages/Airdrops/utils/getAirdropRedeemedData";
import { createContext } from "react";

export interface IAirdropRedeemModalContext {
  addressToCheck: string;
  airdropElegibility: AirdropElegibility | false | undefined;
  redeemData: AirdropRedeemData | undefined;
  updateAirdropRedeemedData: () => Promise<AirdropRedeemData | undefined>;
  updateAirdropElegibility: () => Promise<false | AirdropElegibility | undefined>;
  nextStep: () => Promise<void>;
  prevStep: () => Promise<void>;
}

export const AirdropRedeemModalContext = createContext<IAirdropRedeemModalContext>(undefined as any);
