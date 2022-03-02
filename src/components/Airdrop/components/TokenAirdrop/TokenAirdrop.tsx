import { createContext, useState } from "react";
import { TokenAirdropET } from "types/types";
import CheckEligibility from "./components/CheckEligibility/CheckEligibility";
import Terms from "./components/Terms/Terms";
import ChooseDelegatee from "./components/ChooseDelegatee/ChooseDelegatee";
import Claim from "./components/Claim/Claim";
import "./index.scss";

interface IProps {
  address: string
  tokenAmount: number
  eligibleTokens: TokenAirdropET
}

export const enum Stage {
  CheckEligibility,
  Terms,
  ChooseDelegatee,
  Claim
}

export const TokenAirdropContext = createContext({ setStage: (value: Stage) => { } });

export default function TokenAirdrop({ address, tokenAmount, eligibleTokens }: IProps) {
  const [stage, setStage] = useState(Stage.CheckEligibility);

  const renderStage = (stage: Stage) => {
    switch (stage) {
      case Stage.CheckEligibility:
        return <CheckEligibility tokenAmount={tokenAmount} />
      case Stage.Terms:
        return <Terms />
      case Stage.ChooseDelegatee:
        return <ChooseDelegatee />;
      case Stage.Claim:
        return <Claim address={address} tokenAmount={tokenAmount} eligibleTokens={eligibleTokens} />;
    }
  }

  return (
    <div className="token-airdrop-wrapper">
      <TokenAirdropContext.Provider value={{ setStage: setStage }}>
        {renderStage(stage)}
      </TokenAirdropContext.Provider>
    </div>
  )
}
