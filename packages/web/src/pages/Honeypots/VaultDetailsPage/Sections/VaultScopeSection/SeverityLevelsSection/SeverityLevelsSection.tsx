import { IVault, IVulnerabilitySeverity } from "@hats-finance/shared";
import MDEditor from "@uiw/react-md-editor";
import { Pill } from "components";
import { allowedElementsMarkdown } from "constants/constants";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import { StyledSeverityLevelsSection } from "./styles";

type SeverityLevelsSectionProps = {
  vault: IVault;
};

export const SeverityLevelsSection = ({ vault }: SeverityLevelsSectionProps) => {
  if (!vault.description) return null;

  const severityColors = getSeveritiesColorsArray(vault);

  return (
    <StyledSeverityLevelsSection className="subsection-container severities">
      {vault.description.severities.map((severity: IVulnerabilitySeverity, idx: number) => (
        <div className="severity" key={idx}>
          <Pill isSeverity transparent text={severity.name} textColor={severityColors[idx]} />
          <MDEditor.Markdown
            allowedElements={allowedElementsMarkdown}
            className="mt-4 pl-2"
            source={severity.description}
            style={{ whiteSpace: "normal", fontSize: "var(--xsmall)", background: "transparent", color: "var(--white)" }}
          />
        </div>
      ))}
    </StyledSeverityLevelsSection>
  );
};
