import { IVault } from "@hats-finance/shared";
import MDEditor from "@uiw/react-md-editor";

type OutOfScopeSectionProps = {
  vault: IVault;
};

export const OutOfScopeSection = ({ vault }: OutOfScopeSectionProps) => {
  if (!vault.description?.scope?.outOfScope) return null;

  return (
    <div className="subsection-container">
      <MDEditor.Markdown
        disallowedElements={["script", "iframe"]}
        source={vault.description.scope.outOfScope}
        style={{ whiteSpace: "normal", fontSize: "var(--xsmall)", background: "transparent", color: "var(--white)" }}
      />
    </div>
  );
};
