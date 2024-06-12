import InfoIcon from "assets/icons/info.icon";
import { WithTooltip } from "components";
import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { usePointsDataByUser } from "../../../../hooks";

export const TotalPointsCard = () => {
  const { t } = useTranslation();

  const { address: account } = useAccount();
  const { data: profile } = useProfileByAddress(account);
  const { data: pointsData } = usePointsDataByUser(profile?.username);

  return (
    <div className="overview-card">
      <WithTooltip text={"TODO: Define text"} placement="bottom">
        <div>
          <p className="main-content">{pointsData?.hatsPoints ?? "--"}</p>
          <div className="flex mt-4">
            <p>{t("MyWallet.totalEarnedPoints")}</p>
            <InfoIcon width={16} height={16} />
          </div>
        </div>
      </WithTooltip>
    </div>
  );
};
