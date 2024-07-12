import { useTranslation } from "react-i18next";
import { LeaderMultiplierCard } from "./MultipliersCards/LeaderMultiplierCard";
import { StreakMultiplierCard } from "./MultipliersCards/StreakMultiplierCard";
import { StyledEarningsMultipliers } from "./styles";

export const EarningsMultipliers = () => {
  const { t } = useTranslation();

  return (
    <StyledEarningsMultipliers>
      <h3>{t("MyWallet.multipliers")}</h3>
      <div className="multipliers">
        <StreakMultiplierCard />
        <LeaderMultiplierCard />
      </div>
    </StyledEarningsMultipliers>
  );
};
