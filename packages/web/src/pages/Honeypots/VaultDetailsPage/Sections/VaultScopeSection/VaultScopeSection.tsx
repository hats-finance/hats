import { IPayoutGraph, IVault } from "@hats-finance/shared";
import { Alert } from "components";
import { useTranslation } from "react-i18next";
import { CommitteeInfoSection } from "./CommitteeInfoSection/CommitteeInfoSection";
import { EnvSetupSection } from "./EnvSetupSection/EnvSetupSection";
import { InScopeSection } from "./InScopeSection/InScopeSection";
import { OutOfScopeSection } from "./OutOfScopeSection/OutOfScopeSection";
import { SeverityLevelsSection } from "./SeverityLevelsSection/SeverityLevelsSection";
import { StyledVaultScopeSection } from "./styles";

type VaultScopeSectionProps = {
  vault: IVault;
  noDeployed?: boolean;
  auditPayout?: IPayoutGraph | undefined;
};

export const VaultScopeSection = ({ vault, noDeployed = false }: VaultScopeSectionProps) => {
  const { t } = useTranslation();

  const isPrivateAudit = vault?.description?.["project-metadata"].isPrivateAudit;

  return (
    <StyledVaultScopeSection>
      {isPrivateAudit && (
        <Alert className="mt-5" type="info">
          {t("privateAuditSubmissionsScopeInGithub")}
        </Alert>
      )}

      <div>
        <h2>{t("inScope")}</h2>
        <InScopeSection vault={vault} />
      </div>

      {vault.description?.scope?.outOfScope && (
        <div>
          <h2>{t("outOfScope")}</h2>
          <OutOfScopeSection vault={vault} />
        </div>
      )}

      {vault.description?.scope?.protocolSetupInstructions?.instructions && (
        <div>
          <h2>{t("envSetupInstructions")}</h2>
          <EnvSetupSection vault={vault} />
        </div>
      )}

      {vault.description?.severities?.length && (
        <div>
          <h2>{t("severityLevels")}</h2>
          <SeverityLevelsSection vault={vault} />
        </div>
      )}

      {vault.description?.committee?.members?.length && (
        <div>
          <h2>{t("committeeInfo")}</h2>
          <CommitteeInfoSection vault={vault} noDeployed={noDeployed} />
        </div>
      )}
    </StyledVaultScopeSection>
  );
};
