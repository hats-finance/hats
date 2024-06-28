import { useTranslation } from "react-i18next";
import HatsAllocationChart from "../assets/tokenomics-chart.webp";
import HatsAllocationTable from "../assets/tokenomics-table.webp";

export const HatsAllocation = () => {
  const { t } = useTranslation();

  return (
    <div className="hats-allocation">
      <div className="header">
        <h1>{t("Airdrop.hatsTokenomics")}</h1>
        <div className="distribution">
          {t("Airdrop.hatsTotalSupply")}: <strong>100M</strong>
        </div>
      </div>
      <img className="chart" src={HatsAllocationChart} alt="hats allocation chart" />
      <img className="table" src={HatsAllocationTable} alt="hats allocation table" />
    </div>
  );
};
