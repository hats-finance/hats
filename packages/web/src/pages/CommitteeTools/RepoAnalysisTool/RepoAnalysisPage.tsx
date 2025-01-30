import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, FormInput } from "components";
import { StyledRepoAnalysisPage } from "./styles";
import { useRepoAnalysis } from "./hooks/useRepoAnalysis";
import { AnalysisResponse } from "./types";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RoutePaths } from "navigation";
import { useNavigate } from "react-router-dom";

export const RepoAnalysisPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const { analyzeRepo, isLoading, data } = useRepoAnalysis();

  const handleAnalyze = async () => {
    if (!repoOwner || !repoName) return;
    await analyzeRepo(repoOwner, repoName);
  };

  const renderAnalysisResults = (data: AnalysisResponse) => {
    return (
      <div className="analysis-results">
        <div className="section">
          <h3>{t("RepoAnalysis.estimations")}</h3>
          <div className="estimation-grid">
            <div className="estimation-item">
              <span className="label">{t("RepoAnalysis.lowEstimate")}</span>
              <span className="value">${data.estimations.low}</span>
            </div>
            <div className="estimation-item">
              <span className="label">{t("RepoAnalysis.mediumEstimate")}</span>
              <span className="value">${data.estimations.medium}</span>
            </div>
            <div className="estimation-item">
              <span className="label">{t("RepoAnalysis.highEstimate")}</span>
              <span className="value">${data.estimations.high}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>{t("RepoAnalysis.summary")}</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">{t("RepoAnalysis.totalLines")}</span>
              <span className="value">{data.analysis.summary.total_lines}</span>
            </div>
            <div className="summary-item">
              <span className="label">{t("RepoAnalysis.sourceLines")}</span>
              <span className="value">{data.analysis.summary.source_lines}</span>
            </div>
            <div className="summary-item">
              <span className="label">{t("RepoAnalysis.commentLines")}</span>
              <span className="value">{data.analysis.summary.comment_lines}</span>
            </div>
            <div className="summary-item">
              <span className="label">{t("RepoAnalysis.commentRatio")}</span>
              <span className="value">{(data.analysis.summary.comment_ratio * 100).toFixed(1)}%</span>
            </div>
            <div className="summary-item">
              <span className="label">{t("RepoAnalysis.complexityScore")}</span>
              <span className="value">{data.analysis.summary.complexity_score}</span>
            </div>
            <div className="summary-item">
              <span className="label">{t("RepoAnalysis.contracts")}</span>
              <span className="value">{data.analysis.summary.num_contracts}</span>
            </div>
            <div className="summary-item">
              <span className="label">{t("RepoAnalysis.interfaces")}</span>
              <span className="value">{data.analysis.summary.num_interfaces}</span>
            </div>
            <div className="summary-item">
              <span className="label">{t("RepoAnalysis.libraries")}</span>
              <span className="value">{data.analysis.summary.num_libraries}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>{t("RepoAnalysis.capabilities")}</h3>
          <div className="capabilities-grid">
            {Object.entries(data.analysis.capabilities).map(([key, value]) => (
              <div key={key} className="capability-item">
                <span className="label">{t(`RepoAnalysis.${key}`)}</span>
                <span className={`value ${value ? "positive" : "negative"}`}>
                  {value ? "✓" : "✗"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {data.analysis.summary.deployable_contracts.length > 0 && (
          <div className="section">
            <h3>{t("RepoAnalysis.deployableContracts")}</h3>
            <div className="deployable-contracts">
              {data.analysis.summary.deployable_contracts.map((contract) => (
                <div key={contract} className="contract-item">
                  {contract}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <StyledRepoAnalysisPage>
      <div className="title-container">
        <div className="title" onClick={() => navigate(`${RoutePaths.committee_tools}/submissions`)}>
          <ArrowBackIcon />
          <p>
            {t("committeeTools")}/<span className="bold">{t("RepoAnalysis.title")}</span>
          </p>
        </div>
      </div>

      <div className="content">
        <div className="input-section">
          <FormInput
            label={t("RepoAnalysis.repoOwner")}
            value={repoOwner}
            onChange={(e) => setRepoOwner(e.target.value)}
            placeholder="e.g., ethereum"
          />
          <FormInput
            label={t("RepoAnalysis.repoName")}
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            placeholder="e.g., solidity"
          />
          <Button
            onClick={handleAnalyze}
            disabled={!repoOwner || !repoName || isLoading}
            className="analyze-button"
          >
            <SearchIcon className="mr-2" />
            {isLoading ? t("loading") : t("RepoAnalysis.analyze")}
          </Button>
        </div>

        {data && renderAnalysisResults(data)}
      </div>
    </StyledRepoAnalysisPage>
  );
}; 