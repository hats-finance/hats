import { IVault } from "@hats-finance/shared";
import OverviewIcon from "@mui/icons-material/SelfImprovementOutlined";
import { StyledInScopeSection } from "./styles";

type InScopeSectionProps = {
  vault: IVault;
};

export const InScopeSection = ({ vault }: InScopeSectionProps) => {
  return (
    <StyledInScopeSection className="scope-section-container">
      <h3 className="section-subtitle">
        <OverviewIcon className="icon" />
        <span>Overview</span>
      </h3>
    </StyledInScopeSection>
  );
};
