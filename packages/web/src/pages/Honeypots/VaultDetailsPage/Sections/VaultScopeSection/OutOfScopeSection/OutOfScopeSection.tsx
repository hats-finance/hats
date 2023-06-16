import { IVault } from "@hats-finance/shared";
import MDEditor from "@uiw/react-md-editor";

type OutOfScopeSectionProps = {
  vault: IVault;
};

export const OutOfScopeSection = ({ vault }: OutOfScopeSectionProps) => {
  if (!vault.description?.scope?.outOfScope) return null;

  return (
    <div className="scope-section-container">
      <MDEditor.Markdown
        source={vault.description.scope.outOfScope}
        style={{ whiteSpace: "normal", fontSize: "var(--xsmall)", background: "transparent" }}
      />
    </div>
  );
};
