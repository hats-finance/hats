import { IVault } from "@hats-finance/shared";
import { StyledSeverityLevelsSection } from "./styles";

type SeverityLevelsSectionProps = {
  vault: IVault;
};

export const SeverityLevelsSection = ({ vault }: SeverityLevelsSectionProps) => {
  return <StyledSeverityLevelsSection className="scope-section-container">SeverityLevelsSection</StyledSeverityLevelsSection>;
};
