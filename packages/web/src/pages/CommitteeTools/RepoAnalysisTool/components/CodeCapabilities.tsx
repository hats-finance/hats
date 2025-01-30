import { useTranslation } from "react-i18next";
import { AnalysisResponse } from "../types";

interface CapabilityItemProps {
  label: string;
  value: boolean;
}

const CapabilityItem = ({ label, value }: CapabilityItemProps) => (
  <div className="capability-item">
    <span className="label">{label}</span>
    <span className={`value ${value ? "positive" : "negative"}`}>
      {value ? "✓" : "✗"}
    </span>
  </div>
);

interface CodeCapabilitiesProps {
  capabilities: AnalysisResponse['analysis']['capabilities'];
  isLoading?: boolean;
}

export const CodeCapabilities = ({ capabilities, isLoading }: CodeCapabilitiesProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="section">
        <h3>{t("RepoAnalysis.capabilities")}</h3>
        <div className="capabilities-grid loading">
          {Object.keys(capabilities).map((key) => (
            <div key={key} className="capability-item shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h3>{t("RepoAnalysis.capabilities")}</h3>
      <div className="capabilities-grid">
        {Object.entries(capabilities).map(([key, value]) => (
          <CapabilityItem
            key={key}
            label={t(`RepoAnalysis.${key}`)}
            value={value}
          />
        ))}
      </div>
    </div>
  );
}; 