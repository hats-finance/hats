import InfoIcon from "@mui/icons-material/InfoOutlined";
import { WithTooltip } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { StyledSafePeriodBar } from "./styles";

export type SafePeriodBarProps = {
  type?: "bar" | "banner";
};

export function SafePeriodBar({ type = "bar" }: SafePeriodBarProps) {
  const { t } = useTranslation();

  const { withdrawSafetyPeriod } = useVaults();
  if (!withdrawSafetyPeriod) return null;

  const { ongoingSafetyEndsAt, nextSafetyStartsAt, isSafetyPeriod } = withdrawSafetyPeriod;
  const safetyPeriodDate = new Date(isSafetyPeriod ? ongoingSafetyEndsAt : nextSafetyStartsAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "shortOffset",
  });

  const safetyDuration = moment.duration(withdrawSafetyPeriod.safetyPeriod, "seconds").humanize();
  const withdrawDuration = moment.duration(withdrawSafetyPeriod.withdrawPeriod, "seconds").humanize();

  return (
    <StyledSafePeriodBar isSafetyPeriod={isSafetyPeriod} type={type}>
      <div className="info">
        {isSafetyPeriod
          ? t("withdrawalSafePeriodOnUntil", { safetyPeriodDate })
          : t("nextSafePeriodStartsAt", { safetyPeriodDate })}
      </div>
      <WithTooltip text={t("safePeriodExplanation", { safetyDuration, withdrawDuration })}>
        <InfoIcon className="icon" fontSize="inherit" />
      </WithTooltip>
    </StyledSafePeriodBar>
  );
}
