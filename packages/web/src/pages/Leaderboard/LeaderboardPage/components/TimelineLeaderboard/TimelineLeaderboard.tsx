import { IPayoutGraph } from "@hats.finance/shared";
import ArrowDown from "@mui/icons-material/KeyboardArrowDownOutlined";
import ArrowUp from "@mui/icons-material/KeyboardArrowUpOutlined";
import { VaultCard } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useWindowDimensions from "hooks/useWindowDimensions";
import moment from "moment";
import { VaultLeaderboardSection } from "pages/Honeypots/VaultDetailsPage/Sections/VaultLeaderboardSection/VaultLeaderboardSection";
import { useAuditCompetitionsVaults, useOldAuditCompetitions } from "pages/Honeypots/VaultsPage/hooks";
import { useEffect, useMemo, useState } from "react";
import { ipfsTransformUri } from "utils";
import { StyledTimelineLeaderboard } from "./styles";

const COMPETITIONS_PER_PAGE = 4;

export const TimelineLeaderboard = () => {
  const { allVaults } = useVaults();
  const { finished: finishedAuditPayouts } = useAuditCompetitionsVaults();
  const oldAudits = useOldAuditCompetitions();
  const allFinishedAuditCompetitions = [...finishedAuditPayouts, ...(oldAudits ?? [])].filter((audit) => audit.payoutDataHash);

  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string>(allFinishedAuditCompetitions[0].id);
  const selectedCompetitionPayout = allFinishedAuditCompetitions.find((audit) => audit.id === selectedCompetitionId);
  const selectedCompetitionVault = allVaults?.find((vault) => vault.id === selectedCompetitionPayout?.payoutData?.vault?.id);

  const { height } = useWindowDimensions();
  const [competitionsPerPage, setCompetitionsPerPage] = useState<number>(COMPETITIONS_PER_PAGE);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    if (height < 900) setCompetitionsPerPage(2);
    else if (height < 1200) setCompetitionsPerPage(3);
    else setCompetitionsPerPage(COMPETITIONS_PER_PAGE);
  }, [height]);

  const finishedCompetitionsPagesArray = useMemo(() => {
    return [...allFinishedAuditCompetitions].reduce((acc, curr, idx) => {
      const page = Math.floor(idx / competitionsPerPage);
      if (!acc[page]) acc[page] = [];
      acc[page].push(curr);
      return acc;
    }, [] as IPayoutGraph[][]);
  }, [allFinishedAuditCompetitions, competitionsPerPage]);

  const canPrevPage = page > 0;
  const goToPrevPage = () => {
    if (!canPrevPage) return;
    setPage(page - 1);
  };

  const canNextPage = page < finishedCompetitionsPagesArray.length - 1;
  const goToNextPage = () => {
    if (!canNextPage) return;
    setPage(page + 1);
  };

  return (
    <StyledTimelineLeaderboard>
      <div className="timeline">
        <div className="line" />

        {finishedCompetitionsPagesArray.length > 0 && (
          <div className={`control prev ${!canPrevPage ? "disabled" : ""}`} onClick={goToPrevPage}>
            <ArrowUp />
          </div>
        )}
        {finishedCompetitionsPagesArray[page]?.map((auditPayout) => {
          const vaultName = auditPayout.payoutData?.vault?.description?.["project-metadata"].name;
          const vaultIcon = auditPayout.payoutData?.vault?.description?.["project-metadata"].icon;
          const startTime = auditPayout.payoutData?.vault?.description?.["project-metadata"].starttime;
          const date = startTime ? +startTime * 1000 : 0;

          return (
            <div
              key={auditPayout.id}
              onClick={() => setSelectedCompetitionId(auditPayout.id)}
              className={`timeline-item ${selectedCompetitionId === auditPayout.id ? "selected" : ""}`}
            >
              <img src={ipfsTransformUri(vaultIcon)} alt={vaultName} />
              <p className="name">{vaultName}</p>
              <p className="date">{moment(date).format("MMM Do YYYY")}</p>
            </div>
          );
        })}
        {finishedCompetitionsPagesArray.length > 0 && (
          <div className={`control next ${!canNextPage ? "disabled" : ""}`} onClick={goToNextPage}>
            <ArrowDown />
          </div>
        )}
      </div>
      <div className="results">
        <div className="vaultInfo">
          <VaultCard auditPayout={selectedCompetitionPayout} reducedStyles hideStatusPill />
        </div>
        {selectedCompetitionPayout && selectedCompetitionVault && (
          <VaultLeaderboardSection
            vault={selectedCompetitionVault}
            auditPayout={selectedCompetitionPayout}
            hideClaimRewardsAction
          />
        )}
      </div>
    </StyledTimelineLeaderboard>
  );
};
