import InfoIcon from "assets/icons/info.icon";
import { WithTooltip } from "components";
import { useTranslation } from "react-i18next";

export const PointValueCard = () => {
  const { t } = useTranslation();

  return (
    <div className="overview-card">
      <WithTooltip text={"TODO: Define text"} placement="bottom">
        <div>
          <p className="main-content">0.1 HAT</p>
          <div className="flex mt-4">
            <p>{t("MyWallet.pointValue")}</p>
            <InfoIcon width={16} height={16} />
          </div>
        </div>
      </WithTooltip>
    </div>
  );
};
