import { useTranslation } from "react-i18next";

interface DeployableContractsProps {
  contracts: string[];
  isLoading?: boolean;
}

export const DeployableContracts = ({ contracts, isLoading }: DeployableContractsProps) => {
  const { t } = useTranslation();

  if (contracts.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="section">
        <h3>{t("RepoAnalysis.deployableContracts")}</h3>
        <div className="deployable-contracts loading">
          {[1, 2, 3].map((key) => (
            <div key={key} className="contract-item shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h3>{t("RepoAnalysis.deployableContracts")}</h3>
      <div className="deployable-contracts">
        {contracts.map((contract) => (
          <div key={contract} className="contract-item">
            {contract}
          </div>
        ))}
      </div>
    </div>
  );
}; 