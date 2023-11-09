import PrevIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import NextIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { Alert, Pill, WithTooltip } from "components";
import { getSeveritiesColorsArray } from "hooks/severities/useSeverityRewardInfo";
import useWindowDimensions from "hooks/useWindowDimensions";
import moment from "moment";
import PublicSubmissionCard from "pages/Honeypots/VaultDetailsPage/Sections/VaultSubmissionsSection/PublicSubmissionCard/PublicSubmissionCard";
import { IGithubIssue } from "pages/Honeypots/VaultDetailsPage/types";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatNumber, ipfsTransformUri } from "utils";
import { IHackerRewardsStats } from "../useAddressesStats";
import { StyledHackerActivity } from "./styles";

const PAYOUTS_PER_PAGE = 3;

type IHackerActivityProps = {
  activity: IHackerRewardsStats[];
};

export const HackerActivity = ({ activity }: IHackerActivityProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [payoutsPerPage, setPayoutsPerPage] = useState<number>(PAYOUTS_PER_PAGE);

  useEffect(() => {
    if (width < 800) setPayoutsPerPage(3);
    else setPayoutsPerPage(PAYOUTS_PER_PAGE);
  }, [width]);

  const activityPagesArray = useMemo(() => {
    return [...activity]
      .reverse()
      .reduce((acc, curr, idx) => {
        const page = Math.floor(idx / payoutsPerPage);
        if (!acc[page]) acc[page] = [];
        acc[page].unshift(curr);
        return acc;
      }, [] as IHackerRewardsStats[][])
      .reverse();
  }, [activity, payoutsPerPage]);

  const [selectedPayout, setSelectedPayout] = useState<string>(activity[activity.length - 1].id);
  const [page, setPage] = useState<number>(activityPagesArray.length - 1);

  useEffect(() => setPage(activityPagesArray.length - 1), [activityPagesArray]);

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
      <h3 className="subtitle">{t("HackerProfile.activity")}</h3>

      <div className="activity-timeline">
        <div className="line" />

        {activityPagesArray.length > 0 && (
          <div className={`control prev ${!canPrevPage ? "disabled" : ""}`} onClick={goToPrevPage}>
            <PrevIcon />
          </div>
        )}
        {activityPagesArray[page]?.map((hackerPayout, idx) => {
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

      {selectedPayout &&
        (() => {
          const payout = activity.find((payout) => payout.id === selectedPayout);
          const vaultName = payout?.vault?.description?.["project-metadata"].name;
          const prizeValue = payout?.rewards.usd || payout?.rewards.tokens;
          const isUSD = !!payout?.rewards.usd;
          const findings = payout?.findings.map((a) => a.submissions).flat();

          if (!payout || !payout.vault) return null;

          return (
            <div className="payout-details">
              <div className="header">
                <div className="name">
                  <h2>{vaultName}</h2>
                  <p className="date">{moment(payout?.date).format("MMM Do YYYY")}</p>
                </div>
                <WithTooltip text={`${formatNumber(payout.rewards.tokens, 4)} ${payout?.vault?.stakingTokenSymbol}`}>
                  <div className="prize">
                    <h3>{`${isUSD ? "~$" : ""}${formatNumber(prizeValue, isUSD ? 2 : 4)} ${
                      !isUSD ? payout?.vault?.stakingTokenSymbol : ""
                    }`}</h3>
                    <p>{t("HackerProfile.personalPayout")}</p>
                  </div>
                </WithTooltip>
              </div>

              <div className="review">
                <h3>{t("HackerProfile.findings")}:</h3>

                <div className="findings">
                  {payout.findings.map((finding, idx) => {
                    const severityColors = getSeveritiesColorsArray(undefined, payout.findings.length);
                    const prizeValue = finding.rewards.usd || finding.rewards.tokens;
                    const isUSD = !!finding.rewards.usd;

                    return (
                      <WithTooltip
                        key={idx}
                        text={`${formatNumber(finding.rewards.tokens, 4)} ${payout?.vault?.stakingTokenSymbol}`}
                      >
                        <div className="finding-stats">
                          <Pill textColor={severityColors[idx]} isSeverity text={`${finding.count} ${finding.severity}`} />
                          <p className="prize">{`${isUSD ? "~$" : ""}${formatNumber(prizeValue, isUSD ? 2 : 4)} ${
                            !isUSD ? payout?.vault?.stakingTokenSymbol : ""
                          }`}</p>
                        </div>
                      </WithTooltip>
                    );
                  })}
                </div>
              </div>

              <div className="submissions">
                {findings?.length === 0 && <Alert type="info" content={t("HackerProfile.thereIsNoSubmissionToShow")} />}
                {findings?.map((finding, idx) => {
                  const submission: IGithubIssue = {
                    _id: finding.id,
                    createdAt: new Date(+finding.createdAt * 1000),
                    vaultId: payout.vault!.id,
                    severity: finding.submissionDataStructure?.severity,
                    repoName: "",
                    issueData: {
                      issueFiles: [],
                      issueTitle: finding.submissionDataStructure?.title ?? "",
                      issueDescription: finding.submissionDataStructure?.content ?? "",
                    },
                  };

                  return <PublicSubmissionCard key={idx} vault={payout.vault!} submission={submission} />;
                })}
              </div>
            </div>
          );
        })()}
    </StyledHackerActivity>
  );
};
