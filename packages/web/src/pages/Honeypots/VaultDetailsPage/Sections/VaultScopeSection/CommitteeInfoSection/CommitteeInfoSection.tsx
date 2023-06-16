import { IVault } from "@hats-finance/shared";
import { StyledCommitteeInfoSection } from "./styles";

type CommitteeInfoSectionProps = {
  vault: IVault;
};

export const CommitteeInfoSection = ({ vault }: CommitteeInfoSectionProps) => {
  return <StyledCommitteeInfoSection className="scope-section-container">CommitteeInfoSection</StyledCommitteeInfoSection>;
};
