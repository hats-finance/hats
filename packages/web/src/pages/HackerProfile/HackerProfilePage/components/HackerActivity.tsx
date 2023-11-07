import moment from "moment";
import { useTranslation } from "react-i18next";
import { ipfsTransformUri } from "utils";
import { IHackerRewardsStats } from "../useAddressesStats";
import { StyledHackerActivity } from "./styles";

type IHackerActivityProps = {
  activity: IHackerRewardsStats[];
};

export const HackerActivity = ({ activity }: IHackerActivityProps) => {
  const { t } = useTranslation();

  if (!activity.length) return null;

  return (
    <StyledHackerActivity>
      <h3>{t("HackerProfile.activity")}</h3>

      <div className="activity-timeline">
        <div className="line" />
        {activity.map((payout, idx) => {
          const vaultName = payout.vault?.description?.["project-metadata"].name;
          const vaultIcon = payout.vault?.description?.["project-metadata"].icon;

          return (
            <div className="item" key={idx}>
              <p className="date">{moment(payout.date).format("MMM Do YYYY")}</p>
              <img src={ipfsTransformUri(vaultIcon)} alt={vaultName} />
              <p className="name">{vaultName}</p>
            </div>
          );
        })}
      </div>
    </StyledHackerActivity>
  );
};
