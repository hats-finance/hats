import { IVault } from "@hats-finance/shared";
import MDEditor from "@uiw/react-md-editor";
import { allowedElementsMarkdown } from "constants/constants";

type OutOfScopeSectionProps = {
  vault: IVault;
};

export const OutOfScopeSection = ({ vault }: OutOfScopeSectionProps) => {
  if (!vault.description?.scope?.outOfScope) return null;

  return (
    <div className="subsection-container">
      <MDEditor.Markdown
        allowedElements={allowedElementsMarkdown}
        source={vault.description.scope.outOfScope}
        style={{ whiteSpace: "normal", fontSize: "var(--xsmall)", background: "transparent", color: "var(--white)" }}
      />
    </div>
  );
};
