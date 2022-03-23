import { createContext, useState } from "react";
import { TokenAirdropET } from "types/types";
import CheckEligibility from "./components/CheckEligibility/CheckEligibility";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import Protocol from "./components/Protocol/Protocol";
import ChooseDelegatee from "./components/ChooseDelegatee/ChooseDelegatee";
import Claim from "./components/Claim/Claim";
import { EligibilityStatus, IDelegateeData } from "components/Airdrop/constants";
import ClaimSuccess from "./components/ClaimSuccess/ClaimSuccess";
import "./index.scss";

interface IProps {
  address: string
  eligibilityStatus: EligibilityStatus
  tokenAmount: number
  eligibleTokens: TokenAirdropET
  setInTokenAirdrop: (value: boolean) => void
  setTokenEligibilityStatus: (value: EligibilityStatus) => void
}

export const enum Stage {
  CheckEligibility,
  Protocol,
  ChooseDelegatee,
  Claim,
  Success
}

export const TokenAirdropContext = createContext({ setStage: (value: Stage) => { } });

export default function TokenAirdrop({ address, eligibilityStatus, tokenAmount, eligibleTokens, setInTokenAirdrop, setTokenEligibilityStatus }: IProps) {
  const [stage, setStage] = useState(Stage.CheckEligibility);
  const [delegatee, setDelegatee] = useState<IDelegateeData | undefined>();

  const renderStage = (stage: Stage) => {
    switch (stage) {
      case Stage.CheckEligibility:
        return <CheckEligibility eligibilityStatus={eligibilityStatus} setInTokenAirdrop={setInTokenAirdrop} tokenAmount={tokenAmount} />
      case Stage.Protocol:
        return <Protocol setInTokenAirdrop={setInTokenAirdrop} />
      case Stage.ChooseDelegatee:
        return <ChooseDelegatee address={address} selectedDelegatee={delegatee} setDelegatee={setDelegatee} />;
      case Stage.Claim:
        return <Claim delegateeData={delegatee!} address={address} tokenAmount={tokenAmount} eligibleTokens={eligibleTokens} />;
      case Stage.Success:
        return <ClaimSuccess tokenAmount={tokenAmount} backToAirdrop={() => {
          setInTokenAirdrop(false);
          setTokenEligibilityStatus(EligibilityStatus.REDEEMED);
          setStage(Stage.CheckEligibility);
        }} />
    }
  }

  return (
    <div className="token-airdrop-wrapper">
      {stage !== Stage.CheckEligibility && stage !== Stage.Success && <ProgressBar stage={stage} />}
      <TokenAirdropContext.Provider value={{ setStage: setStage }}>
        {renderStage(stage)}
      </TokenAirdropContext.Provider>
    </div>
  )
}
