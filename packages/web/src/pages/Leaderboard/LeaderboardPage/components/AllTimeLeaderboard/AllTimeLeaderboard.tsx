import { IVault, parseSeverityName, severitiesOrder } from "@hats.finance/shared";
import { FormSelectInput, HackerProfileImage, HackerStreak, HatSpinner, Pill, WithTooltip } from "components";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import useModal from "hooks/useModal";
import millify from "millify";
import { RoutePaths } from "navigation";
import { useAddressesStats } from "pages/HackerProfile/useAddressesStats";
import { useAddressesStreak } from "pages/HackerProfile/useAddressesStreak";
import { useCachedProfile } from "pages/HackerProfile/useCachedProfile";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import { NavLink } from "react-router-dom";
import { formatNumber, ipfsTransformUri } from "utils";
import { shortenIfAddress } from "utils/addresses.utils";
import { StyledAllTimeLeaderboard } from "./styles";
import { IAllTimeLeaderboard, IAllTimeLeaderboardSortKey, useAllTimeLeaderboard } from "./useAllTimeLeaderboard";

export const AllTimeLeaderboard = () => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<IAllTimeLeaderboardSortKey>("streak");
  const { leaderboard, isLoading } = useAllTimeLeaderboard("all", sortBy);
  const sevLevels = [...new Set(leaderboard?.map((leaderboardEntry) => leaderboardEntry.highestSeverity))];
  const severityColors = getSeveritiesColorsArray(undefined, sevLevels.length);

  if (isLoading) return <HatSpinner text={`${t("Leaderboard.loadingLeaderboard")}...`} />;

  return (
    <StyledAllTimeLeaderboard>
      <div className="sort-by">
        <FormSelectInput
          label={t("sortBy")}
          options={[
            { label: t("streak"), value: "streak" },
            { label: t("rewards"), value: "totalAmount" },
            { label: t("findings"), value: "totalFindings" },
          ]}
          value={sortBy}
          onChange={(e) => setSortBy(e as IAllTimeLeaderboardSortKey)}
        />
      </div>

      <div className="leaderboard-table">
        <div className="header">#</div>
        <div className="header">{t("whiteHat")}</div>
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
  const profileStats = useAddressesStats([leaderboardEntry.address]);
  const { streakCount, maxStreak } = useAddressesStreak([leaderboardEntry.address]);
  const { isShowing: isShowingBreakdown, show: showBreakdown, hide: hideBreakdown } = useModal();

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
      <div className="content" onMouseEnter={showBreakdown} onMouseLeave={hideBreakdown}>
        {leaderboardEntry.totalSubmissions}
        <div className={`findings-breakdown ${isShowingBreakdown ? "show" : ""}`}>
          {profileStats?.findingsGlobalStats?.map((breakdown, idx) => {
            const prizeValue = breakdown?.rewards.usd || breakdown?.rewards.tokens;
            const isUSD = !!breakdown?.rewards.usd;

            return (
              <Fragment key={idx}>
                <div className="breakdown-severity">
                  <Pill
                    text={breakdown.severity}
                    textColor={severityColors[severitiesOrder.findIndex((s) => s === breakdown.severity)]}
                    isSeverity
                  />
                  <div className="logos">
                    {/* Unique vault logos */}
                    {breakdown.submissions
                      .reduce((acc, curr) => {
                        const vault = curr.linkedVault;
                        if (!vault) return acc;
                        if (!acc.find((a) => a.id === vault?.id)) acc.push(vault);
                        return acc;
                      }, [] as IVault[])
                      .map((vault, idx) => {
                        const vaultLogo = vault?.description?.["project-metadata"].icon;
                        const vaultName = vault?.description?.["project-metadata"].name;

                        return !vaultLogo ? null : (
                          <WithTooltip text={vaultName} key={idx}>
                            <img src={ipfsTransformUri(vaultLogo)} alt={vaultName} />
                          </WithTooltip>
                        );
                      })}
                  </div>
                </div>
                <div className="breakdown-prize">
                  {`${isUSD ? "~$" : ""}${formatNumber(prizeValue, isUSD ? 2 : 4)} ${!isUSD ? breakdown.stakingTokenSymbol : ""}`}
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
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
