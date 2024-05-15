import { useTranslation } from "react-i18next";
import HatsDistributionChart from "../assets/hats_distribution_chart.png";

export const HatsDistribution = () => {
  const { t } = useTranslation();

  return (
    <div className="hats-distribution">
      <h3>{t("Airdrop.hatsDistribution")}</h3>
      <img src={HatsDistributionChart} alt="hats distribution" />
    </div>
  );
};
