import { IVault } from "@hats-finance/shared";
import { StyledOutOfScopeSection } from "./styles";

type OutOfScopeSectionProps = {
  vault: IVault;
};

export const OutOfScopeSection = ({ vault }: OutOfScopeSectionProps) => {
  return <StyledOutOfScopeSection className="scope-section-container">OutOfScopeSection</StyledOutOfScopeSection>;
};
