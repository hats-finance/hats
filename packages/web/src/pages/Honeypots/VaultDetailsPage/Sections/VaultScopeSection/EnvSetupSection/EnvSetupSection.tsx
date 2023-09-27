import { IVault, allowedElementsMarkdown } from "@hats-finance/shared";
import MDEditor from "@uiw/react-md-editor";
import { Pill } from "components";
import { useTranslation } from "react-i18next";

type EnvSetupSectionProps = {
  vault: IVault;
};

export const EnvSetupSection = ({ vault }: EnvSetupSectionProps) => {
  const { t } = useTranslation();

  if (!vault.description?.scope?.protocolSetupInstructions?.instructions) return null;

  return (
    <div className="subsection-container">
      <div className="flex-horizontal mb-4">
        <span className="bold">{t("toolUsed")}:</span> <Pill text={vault.description?.scope?.protocolSetupInstructions.tooling} />
      </div>

      <MDEditor.Markdown
        allowedElements={allowedElementsMarkdown}
        source={vault.description?.scope?.protocolSetupInstructions.instructions}
        style={{ whiteSpace: "normal", fontSize: "var(--xsmall)", background: "transparent", color: "var(--white)" }}
      />
    </div>
  );
};
