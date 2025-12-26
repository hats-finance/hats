import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, FormInput } from "components";
import { StyledRepoAnalysisPage } from "./styles";
import { useRepoAnalysis } from "./hooks/useRepoAnalysis";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RoutePaths } from "navigation";
import { useNavigate } from "react-router-dom";
import { AnalysisEstimations } from "./components/AnalysisEstimations";
import { CodeSummary } from "./components/CodeSummary";
import { CodeCapabilities } from "./components/CodeCapabilities";
import { DeployableContracts } from "./components/DeployableContracts";

export const RepoAnalysisPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const { analyzeRepo, isLoading, data, error } = useRepoAnalysis();

  const handleAnalyze = async () => {
    if (!repoOwner || !repoName) return;
    await analyzeRepo(repoOwner, repoName);
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

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {(data || isLoading) && (
          <div className="analysis-results">
            <AnalysisEstimations
              estimations={data?.estimations ?? { low: 0, medium: 0, high: 0 }}
              isLoading={isLoading}
            />
            <CodeSummary
              summary={data?.analysis.summary ?? {
                total_lines: 0,
                source_lines: 0,
                comment_lines: 0,
                comment_ratio: 0,
                complexity_score: 0,
                num_contracts: 0,
                num_interfaces: 0,
                num_abstract: 0,
                num_libraries: 0,
                num_public_functions: 0,
                num_payable_functions: 0,
                deployable_contracts: [],
              }}
              isLoading={isLoading}
            />
            <CodeCapabilities
              capabilities={data?.analysis.capabilities ?? {
                can_receive_funds: false,
                has_destroy_function: false,
                uses_assembly: false,
                uses_hash_functions: false,
                uses_unchecked_blocks: false,
                uses_try_catch: false,
              }}
              isLoading={isLoading}
            />
            <DeployableContracts
              contracts={data?.analysis.summary.deployable_contracts ?? []}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </StyledRepoAnalysisPage>
  );
}; 