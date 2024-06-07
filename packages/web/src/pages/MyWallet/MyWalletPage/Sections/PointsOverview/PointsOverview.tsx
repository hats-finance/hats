import { useTranslation } from "react-i18next";
import { ConvertibleTokensCard } from "./cards/ConvertibleTokensCard/ConvertibleTokensCard";
import { HATHoldingsCard } from "./cards/HATHoldingsCard";
import { PointValueCard } from "./cards/PointValueCard/PointValueCard";
import { TotalPointsCard } from "./cards/TotalPointsCard";
import { StyledPointsOverview } from "./styles";

export const PointsOverview = () => {
  const { t } = useTranslation();

  return (
    <StyledPointsOverview>
      <h2>{t("MyWallet.overview")}</h2>

      <div className="cards">
        <TotalPointsCard />
        <HATHoldingsCard />
        <PointValueCard />
        <ConvertibleTokensCard />
      </div>
    </StyledPointsOverview>
  );
};
