import { useTranslation } from "react-i18next";
import { formatNumber, formatPercentage } from "../utils/format";
import { AnalysisResponse } from "../types";

interface SummaryItemProps {
  label: string;
  value: string | number;
  formatter?: (value: number) => string;
}

const SummaryItem = ({ label, value, formatter = formatNumber }: SummaryItemProps) => (
  <div className="summary-item">
    <span className="label">{label}</span>
    <span className="value">{typeof value === 'number' ? formatter(value) : value}</span>
  </div>
);

interface CodeSummaryProps {
  summary: AnalysisResponse['analysis']['summary'];
  isLoading?: boolean;
}

export const CodeSummary = ({ summary, isLoading }: CodeSummaryProps) => {
  const { t } = useTranslation();

  const summaryItems = [
    { key: 'total_lines', formatter: formatNumber },
    { key: 'source_lines', formatter: formatNumber },
    { key: 'comment_lines', formatter: formatNumber },
    { key: 'comment_ratio', formatter: formatPercentage },
    { key: 'complexity_score', formatter: formatNumber },
    { key: 'num_contracts', formatter: formatNumber },
    { key: 'num_interfaces', formatter: formatNumber },
    { key: 'num_libraries', formatter: formatNumber },
  ];

  if (isLoading) {
    return (
      <div className="section">
        <h3>{t("RepoAnalysis.summary")}</h3>
        <div className="summary-grid loading">
          {summaryItems.map(({ key }) => (
            <div key={key} className="summary-item shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h3>{t("RepoAnalysis.summary")}</h3>
      <div className="summary-grid">
        {summaryItems.map(({ key, formatter }) => (
          <SummaryItem
            key={key}
            label={t(`RepoAnalysis.${key}`)}
            value={summary[key as keyof typeof summary]}
            formatter={formatter}
          />
        ))}
      </div>
    </div>
  );
}; 