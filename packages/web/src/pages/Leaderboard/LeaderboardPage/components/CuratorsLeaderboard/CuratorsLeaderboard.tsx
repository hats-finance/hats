import { Alert, FormSelectInput, HackerProfileImage, HatSpinner, WithTooltip } from "components";
import millify from "millify";
import { RoutePaths } from "navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import { NavLink } from "react-router-dom";
import { shortenIfAddress } from "utils/addresses.utils";
import { StyledAllTimeLeaderboard } from "./styles";
import { ICuratorsLeaderboard, ICuratorsLeaderboardSortKey, useCuratorsLeaderboard } from "./useCuratorsLeaderboard";

export const CuratorsLeaderboard = () => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<ICuratorsLeaderboardSortKey>("competitions");
  const { leaderboard, isLoading } = useCuratorsLeaderboard("all", sortBy);

  if (isLoading) return <HatSpinner text={`${t("Leaderboard.loadingLeaderboard")}...`} />;

  return (
    <StyledAllTimeLeaderboard>
      <div className="sort-by">
        <FormSelectInput
          label={t("sortBy")}
          options={[
            { label: t("competitions"), value: "competitions" },
            { label: t("competitionsRewards"), value: "competitionsRewards" },
            { label: t("earnedFees"), value: "earnedFees" },
          ]}
          value={sortBy}
          onChange={(e) => setSortBy(e as ICuratorsLeaderboardSortKey)}
        />
      </div>

      <div className="leaderboard-table">
        <div className="header">#</div>
        <div className="header">{t("username")}</div>
        <div className="header">{t("roles")}</div>
        <div className="header">{t("competitions")}</div>
        <div className="header">{t("competitionsRewards")}</div>
        <div className="header">{t("earnedFees")}</div>

        {leaderboard?.map((leaderboardEntry, idx) => (
          <LeaderboardEntry key={leaderboardEntry.address} leaderboardEntry={leaderboardEntry} idx={idx} />
        ))}
      </div>

      {leaderboard.length === 0 && <Alert type="info">{t("Leaderboard.noCuratorYet")}</Alert>}
    </StyledAllTimeLeaderboard>
  );
};

type ILeaderboardEntryProps = {
  leaderboardEntry: ICuratorsLeaderboard[0];
  idx: number;
};

const LeaderboardEntry = ({ leaderboardEntry, idx }: ILeaderboardEntryProps) => {
  const { t } = useTranslation();

  const hackerProfile = leaderboardEntry.profile;

  return (
    <>
      <div className="content">{idx + 1}.</div>
      <WithTooltip text={hackerProfile?.addresses.join("\n")}>
        <div className="content sr-data">
          {hackerProfile ? (
            <NavLink to={`${RoutePaths.profile}/${hackerProfile.username}`} className="address profile">
              <HackerProfileImage noMargin hackerProfile={hackerProfile} size="xsmall" />
              <p>{hackerProfile.username}</p>
            </NavLink>
          ) : (
            <div className="address">
              <Identicon string={leaderboardEntry.address} size={24} bg="#fff" />
              {shortenIfAddress(leaderboardEntry.address, { startLength: 6 })}
            </div>
          )}
        </div>
      </WithTooltip>
      <div className="content">{hackerProfile?.curatorApplication?.roles.map((role) => t(`CuratorForm.${role}`)).join("\n")}</div>
      <div className="content">{leaderboardEntry.totalCompetitions}</div>
      <div className="content prize">≈${millify(leaderboardEntry.totalAmountCompetitionsPaid.usd)}</div>
      <div className="content prize">≈${millify(leaderboardEntry.totalAmountEarned.usd)}</div>
    </>
  );
};
