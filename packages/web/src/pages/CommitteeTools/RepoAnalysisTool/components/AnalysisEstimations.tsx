import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/format";

interface EstimationItemProps {
  label: string;
  value: string;
}

const EstimationItem = ({ label, value }: EstimationItemProps) => (
  <div className="estimation-item">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

interface AnalysisEstimationsProps {
  estimations: {
    low: number;
    medium: number;
    high: number;
  };
  isLoading?: boolean;
}

export const AnalysisEstimations = ({ estimations, isLoading }: AnalysisEstimationsProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="section">
        <h3>{t("RepoAnalysis.estimations")}</h3>
        <div className="estimation-grid loading">
          {["low", "medium", "high"].map((key) => (
            <div key={key} className="estimation-item shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h3>{t("RepoAnalysis.estimations")}</h3>
      <div className="estimation-grid">
        {Object.entries(estimations).map(([key, value]) => (
          <EstimationItem
            key={key}
            label={t(`RepoAnalysis.${key}Estimate`)}
            value={formatCurrency(value)}
          />
        ))}
      </div>
    </div>
  );
}; 