import { DropData } from "pages/Airdrops/types";
import { AirdropEligibility } from "pages/Airdrops/utils/getAirdropEligibility";
import { AirdropRedeemData } from "pages/Airdrops/utils/getAirdropRedeemedData";
import { createContext } from "react";

export interface IAirdropRedeemModalContext {
  airdropsData: DropData[];
  addressToCheck: string;
  airdropsEligibility: (AirdropEligibility | false | undefined)[];
  airdropsRedeemData: (AirdropRedeemData | undefined)[];
  selectedDelegatee: string | undefined;
  onlyTokenLocks: boolean;
  setSelectedDelegatee: (delegatee: string | "self") => void;
  updateAirdropsRedeemedData: () => Promise<(AirdropRedeemData | undefined)[]>;
  updateAirdropsEligibility: () => Promise<(false | AirdropEligibility | undefined)[]>;
  nextStep: () => Promise<void>;
  prevStep: () => Promise<void>;
  handleClaimAirdrops: (percentageToDeposit: number | undefined, vaultToDeposit: string | undefined) => Promise<void>;
}

export const AirdropRedeemModalContext = createContext<IAirdropRedeemModalContext>(undefined as any);
