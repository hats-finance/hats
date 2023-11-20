import { RoutePaths } from "navigation";
import { RouteObject } from "react-router-dom";
import { LeaderboardPage } from "./LeaderboardPage/LeaderboardPage";

export const leaderboardRouter = (): RouteObject => ({
  path: `${RoutePaths.leaderboard}`,
  children: [
    {
      path: "",
      element: <LeaderboardPage />,
    },
    {
      path: ":section",
      element: <LeaderboardPage />,
    },
  ],
});
