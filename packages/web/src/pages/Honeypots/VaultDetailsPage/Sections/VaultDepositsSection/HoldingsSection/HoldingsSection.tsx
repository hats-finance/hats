import { IVault } from "@hats.finance/shared";
import ArrowIcon from "@mui/icons-material/ArrowRightAltOutlined";
import { Button } from "components";
import { useTranslation } from "react-i18next";
import { VaultAPYRewards } from "./components/VaultAPYRewards";
import { VaultHoldings } from "./components/VaultHoldings";
import { StyledHoldingsSection } from "./styles";

type HoldingsSectionProps = {
  vault: IVault;
};

export const HoldingsSection = ({ vault }: HoldingsSectionProps) => {
  const { t } = useTranslation();

  const isAudit = vault.description && vault.description["project-metadata"].type === "audit";

  return (
    <StyledHoldingsSection>
      <div className="how-to-withdraw mt-5">
        <h4 className="mb-2">{t("howToWithdraw")}</h4>
        <p className="explanation">{t("howToWithdrawExplanation")}</p>

        <div className="process-flow">
          <div className="step">
            <p className="hidden">{t("7days")}</p>
            <Button size="medium" filledColor={isAudit ? "primary" : "secondary"}>
              {t("withdrawRequest")}
            </Button>
          </div>
          <ArrowIcon className="mt-5" />
          <div className="step">
            <p>{t("7days")}</p>
            <Button size="medium" filledColor="grey">
              {t("requestPending")}
            </Button>
          </div>
          <ArrowIcon className="mt-5" />
          <div className="step">
            <p>{t("7days")}</p>

            <Button size="medium" filledColor={isAudit ? "primary" : "secondary"}>
              {t("withdraw")}
            </Button>
          </div>
        </div>

        <h4 className="mb-2">{t("why7daysPeriods")}</h4>
        <p className="explanation">{t("why7daysPeriodsExplanation")}</p>
      </div>

      <div className="subsection-container holdings">
        <div className="header">
          <div>{t("token")}</div>
          <div>{t("deposited")}</div>
          <div>{t("value")} ($)</div>
          <div className="last">{t("status")}</div>
          <div className="last" />
        </div>

        <div className="separator small" />

        <VaultHoldings vault={vault} />
      </div>

      <h2 className="my-5">{t("yourRewards")}</h2>
      <div className="subsection-container rewards">
        <div className="header">
          <div>{t("token")}</div>
          <div>{t("rewards")}</div>
          <div>{t("claimedRewards")}</div>
          <div className="last" />
        </div>

        <div className="separator small" />

        <VaultAPYRewards vault={vault} />
      </div>
    </StyledHoldingsSection>
  );
};
