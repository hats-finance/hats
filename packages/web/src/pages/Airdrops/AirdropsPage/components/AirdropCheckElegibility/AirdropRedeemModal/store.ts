import { AirdropData } from "pages/Airdrops/types";
import { AirdropElegibility } from "pages/Airdrops/utils/getAirdropElegibility";
import { AirdropRedeemData } from "pages/Airdrops/utils/getAirdropRedeemedData";
import { createContext } from "react";

export interface IAirdropRedeemModalContext {
  airdropData: AirdropData;
  addressToCheck: string;
  airdropElegibility: AirdropElegibility | false | undefined;
  redeemData: AirdropRedeemData | undefined;
  selectedDelegatee: string | undefined;
  isDelegating: boolean;
  setSelectedDelegatee: (delegatee: string) => void;
  updateAirdropRedeemedData: () => Promise<AirdropRedeemData | undefined>;
  updateAirdropElegibility: () => Promise<false | AirdropElegibility | undefined>;
  nextStep: () => Promise<void>;
  prevStep: () => Promise<void>;
  handleClaimAirdrop: () => Promise<void>;
}

export const AirdropRedeemModalContext = createContext<IAirdropRedeemModalContext>(undefined as any);
