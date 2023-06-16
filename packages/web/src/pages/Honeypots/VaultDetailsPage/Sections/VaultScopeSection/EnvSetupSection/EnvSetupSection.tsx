import { IVault } from "@hats-finance/shared";
import MDEditor from "@uiw/react-md-editor";

type EnvSetupSectionProps = {
  vault: IVault;
};

export const EnvSetupSection = ({ vault }: EnvSetupSectionProps) => {
  if (!vault.description?.scope?.protocolSetupInstructions.instructions) return null;

  return (
    <div className="scope-section-container">
      <MDEditor.Markdown
        source={vault.description?.scope?.protocolSetupInstructions.instructions}
        style={{ whiteSpace: "normal", fontSize: "var(--xsmall)", background: "transparent" }}
      />
    </div>
  );
};
