import { DropData } from "pages/Airdrops/types";
import { AirdropElegibility } from "pages/Airdrops/utils/getAirdropElegibility";
import { AirdropRedeemData } from "pages/Airdrops/utils/getAirdropRedeemedData";
import { createContext } from "react";

export interface IAirdropRedeemModalContext {
  airdropsData: DropData[];
  addressToCheck: string;
  airdropsElegibility: (AirdropElegibility | false | undefined)[];
  airdropsRedeemData: (AirdropRedeemData | undefined)[];
  selectedDelegatee: string | undefined;
  onlyTokenLocks: boolean;
  setSelectedDelegatee: (delegatee: string | "self") => void;
  updateAirdropsRedeemedData: () => Promise<(AirdropRedeemData | undefined)[]>;
  updateAirdropsElegibility: () => Promise<(false | AirdropElegibility | undefined)[]>;
  nextStep: () => Promise<void>;
  prevStep: () => Promise<void>;
  handleClaimAirdrops: (percentageToDeposit: number | undefined, vaultToDeposit: string | undefined) => Promise<void>;
}

export const AirdropRedeemModalContext = createContext<IAirdropRedeemModalContext>(undefined as any);
