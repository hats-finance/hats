import { useTranslation } from "react-i18next";
import HatsAllocationChart from "../assets/hats_allocation_chart.png";

export const HatsAllocation = () => {
  const { t } = useTranslation();

  return (
    <div className="hats-allocation">
      <h3>{t("Airdrop.hatsAllocation")}</h3>
      <img src={HatsAllocationChart} alt="hats allocation" />
    </div>
  );
};
