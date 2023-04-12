import { useTranslation } from "react-i18next";
import { WithTooltip } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { StyledSafePeriodBar } from "./styles";
import InfoIcon from "@mui/icons-material/InfoOutlined";

export function SafePeriodBar() {
  const { t } = useTranslation();

  const { withdrawSafetyPeriod } = useVaults();
  if (!withdrawSafetyPeriod) return null;

  const { ongoingSafetyEndsAt, nextSafetyStartsAt, isSafetyPeriod } = withdrawSafetyPeriod;
  const safetyPeriodDate = new Date(isSafetyPeriod ? ongoingSafetyEndsAt : nextSafetyStartsAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <StyledSafePeriodBar isSafetyPeriod={isSafetyPeriod}>
      <div className="info">
        {isSafetyPeriod
          ? t("withdrawalSafePeriodOnUntil", { safetyPeriodDate })
          : t("nextSafePeriodStartsAt", { safetyPeriodDate })}
      </div>
      <WithTooltip text={t("safePeriodExplanation")}>
        <InfoIcon className="icon" />
      </WithTooltip>
    </StyledSafePeriodBar>
  );
}
