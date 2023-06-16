import { IVault } from "@hats-finance/shared";
import MDEditor from "@uiw/react-md-editor";
import { StyledOutOfScopeSection } from "./styles";

type OutOfScopeSectionProps = {
  vault: IVault;
};

export const OutOfScopeSection = ({ vault }: OutOfScopeSectionProps) => {
  if (!vault.description?.scope?.outOfScope) return null;

  return (
    <StyledOutOfScopeSection className="scope-section-container">
      <MDEditor.Markdown
        source={vault.description.scope.outOfScope}
        style={{ whiteSpace: "normal", fontSize: "var(--xsmall)", background: "transparent" }}
      />
    </StyledOutOfScopeSection>
  );
};
