import { Seo } from "components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AllTimeLeaderboard } from "./components/AllTimeLeaderboard/AllTimeLeaderboard";
import { CuratorsLeaderboard } from "./components/CuratorsLeaderboard/CuratorsLeaderboard";
import { TimelineLeaderboard } from "./components/TimelineLeaderboard/TimelineLeaderboard";
import { StyledLeaderboardPage } from "./styles";

export const LeaderboardPage = () => {
  const { t } = useTranslation();
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<"alltime" | "timeline" | "curators">("alltime");

  const leaderboards = {
    alltime: <AllTimeLeaderboard />,
    timeline: <TimelineLeaderboard />,
    curators: <CuratorsLeaderboard />,
  };

  return (
    <>
      <Seo title={t("seo.leaderboardTitle")} />
      <StyledLeaderboardPage className="content-wrapper">
        <h2 className="subtitle">{t("leaderboard")}</h2>

        <div className="sections-handler">
          <h3
            className={`section ${selectedLeaderboard === "alltime" ? "selected" : ""}`}
            onClick={() => setSelectedLeaderboard("alltime")}
          >
            {t("Leaderboard.allTime")}
          </h3>
          <h3
            className={`section section--timeline ${selectedLeaderboard === "timeline" ? "selected" : ""}`}
            onClick={() => setSelectedLeaderboard("timeline")}
          >
            {t("Leaderboard.auditsTimeline")}
          </h3>
          <h3
            className={`section section--curators ${selectedLeaderboard === "curators" ? "selected" : ""}`}
            onClick={() => setSelectedLeaderboard("curators")}
          >
            {t("Leaderboard.curators")}
          </h3>
        </div>

        <div className="leaderboard-container">{leaderboards[selectedLeaderboard]}</div>
      </StyledLeaderboardPage>
    </>
  );
};
