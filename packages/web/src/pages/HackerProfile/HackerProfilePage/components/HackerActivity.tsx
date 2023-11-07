import PrevIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import NextIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import moment from "moment";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ipfsTransformUri } from "utils";
import { IHackerRewardsStats } from "../useAddressesStats";
import { StyledHackerActivity } from "./styles";

const PAYOUTS_PER_PAGE = 2;

type IHackerActivityProps = {
  activity: IHackerRewardsStats[];
};

export const HackerActivity = ({ activity }: IHackerActivityProps) => {
  const { t } = useTranslation();

  const activityPagesArray = useMemo(
    () =>
      activity.reduce((acc, curr, idx) => {
        const page = Math.floor(idx / PAYOUTS_PER_PAGE);
        if (!acc[page]) acc[page] = [];
        acc[page].push(curr);
        return acc;
      }, [] as IHackerRewardsStats[][]),
    [activity]
  );

  const [selectedPayout, setSelectedPayout] = useState<string>(activity[activity.length - 1].id);
  const [page, setPage] = useState<number>(activityPagesArray.length - 1);

  const canPrevPage = page > 0;
  const goToPrevPage = () => {
    if (!canPrevPage) return;
    setPage(page - 1);
  };

  const canNextPage = page < activityPagesArray.length - 1;
  const goToNextPage = () => {
    if (!canNextPage) return;
    setPage(page + 1);
  };

  if (!activity.length) return null;

  return (
    <StyledHackerActivity>
      <h3>{t("HackerProfile.activity")}</h3>

      <div className="activity-timeline">
        <div className="line" />

        {activityPagesArray.length > 0 && (
          <div className={`control prev ${!canPrevPage ? "disabled" : ""}`} onClick={goToPrevPage}>
            <PrevIcon />
          </div>
        )}
        {activityPagesArray[page].map((hackerPayout, idx) => {
          const vaultName = hackerPayout.vault?.description?.["project-metadata"].name;
          const vaultIcon = hackerPayout.vault?.description?.["project-metadata"].icon;

          return (
            <div
              key={idx}
              onClick={() => setSelectedPayout(hackerPayout.id)}
              className={`item ${selectedPayout === hackerPayout.id ? "selected" : ""}`}
            >
              <p className="date">{moment(hackerPayout.date).format("MMM Do YYYY")}</p>
              <img src={ipfsTransformUri(vaultIcon)} alt={vaultName} />
              <p className="name">{vaultName}</p>
            </div>
          );
        })}
        {activityPagesArray.length > 0 && (
          <div className={`control next ${!canNextPage ? "disabled" : ""}`} onClick={goToNextPage}>
            <NextIcon />
          </div>
        )}
      </div>
    </StyledHackerActivity>
  );
};
