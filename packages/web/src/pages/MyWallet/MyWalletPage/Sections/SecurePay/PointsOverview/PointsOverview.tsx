import { useTranslation } from "react-i18next";
import { ConvertibleTokensCard } from "./cards/ConvertibleTokensCard/ConvertibleTokensCard";
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
        <PointValueCard />
        <ConvertibleTokensCard />
      </div>
    </StyledPointsOverview>
  );
};
