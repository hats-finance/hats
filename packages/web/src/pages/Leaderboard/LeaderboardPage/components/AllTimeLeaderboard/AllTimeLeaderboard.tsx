import { HackerProfileImage, HackerStreak, HatSpinner, Pill, WithTooltip } from "components";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import millify from "millify";
import { RoutePaths } from "navigation";
import { severitiesOrder } from "pages/HackerProfile/constants";
import { useAddressesStreak } from "pages/HackerProfile/useAddressesStreak";
import { useCachedProfile } from "pages/HackerProfile/useCachedProfile";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import { NavLink } from "react-router-dom";
import { shortenIfAddress } from "utils/addresses.utils";
import { parseSeverityName } from "utils/severityName";
import { StyledAllTimeLeaderboard } from "./styles";
import { IAllTimeLeaderboard, useAllTimeLeaderboard } from "./useAllTimeLeaderboard";

export const AllTimeLeaderboard = () => {
  const { t } = useTranslation();
  const { leaderboard, isLoading } = useAllTimeLeaderboard();
  const sevLevels = [...new Set(leaderboard?.map((leaderboardEntry) => leaderboardEntry.highestSeverity))];
  const severityColors = getSeveritiesColorsArray(undefined, sevLevels.length);

  if (isLoading) return <HatSpinner text={`${t("Leaderboard.loadingLeaderboard")}...`} />;

  return (
    <StyledAllTimeLeaderboard>
      <div className="leaderboard-table">
        <div className="header">#</div>
        <div className="header">Security Researcher</div>
        <div className="header">{t("rewards")}</div>
        <div className="header">{t("findings")}</div>
        <div className="header">{t("Leaderboard.highestSeverity")}</div>

        {leaderboard?.map((leaderboardEntry, idx) => (
          <LeaderboardEntry
            key={leaderboardEntry.address}
            leaderboardEntry={leaderboardEntry}
            idx={idx}
            severityColors={severityColors}
          />
        ))}
      </div>
    </StyledAllTimeLeaderboard>
  );
};

type ILeaderboardEntryProps = {
  leaderboardEntry: IAllTimeLeaderboard[0];
  idx: number;
  severityColors: string[];
};

const LeaderboardEntry = ({ leaderboardEntry, idx, severityColors }: ILeaderboardEntryProps) => {
  const hackerProfile = useCachedProfile(leaderboardEntry.address);
  const { streakCount, maxStreak } = useAddressesStreak([leaderboardEntry.address]);

  const highestSeverity = parseSeverityName(leaderboardEntry.highestSeverity);

  return (
    <>
      <div className="content">{idx + 1}.</div>
      <WithTooltip text={leaderboardEntry.address}>
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
      <div className="content prize">${millify(leaderboardEntry.totalAmount.usd)}</div>
      <div className="content">{leaderboardEntry.totalSubmissions}</div>
      <div className="content">
        <Pill
          textColor={severityColors[severitiesOrder.findIndex((s) => s === highestSeverity)]}
          isSeverity
          text={highestSeverity}
        />
      </div>
      {streakCount !== 0 && (
        <div className="content streak">
          <HackerStreak streak={streakCount} maxStreak={maxStreak} />
        </div>
      )}
    </>
  );
};
