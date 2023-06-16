import { IVault } from "@hats-finance/shared";
import { StyledEnvSetupSection } from "./styles";

type EnvSetupSectionProps = {
  vault: IVault;
};

export const EnvSetupSection = ({ vault }: EnvSetupSectionProps) => {
  return <StyledEnvSetupSection className="scope-section-container">EnvSetupSection</StyledEnvSetupSection>;
};
