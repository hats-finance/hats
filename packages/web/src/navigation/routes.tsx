import { BasicLayout } from "layout";
import { airdropsRouter } from "pages/Airdrops/router";
import { committeeToolsRouter } from "pages/CommitteeTools/router";
import { hackerProfileRouter } from "pages/HackerProfile/router";
import { HoneypotsRoutePaths, honeypotsRouter } from "pages/Honeypots/router";
import { leaderboardRouter } from "pages/Leaderboard/router";
import { myWalletRouter } from "pages/MyWallet/router";
import { submissionsRouter } from "pages/Submissions/router";
import { vaultEditorRouter } from "pages/VaultEditor/router";
import { Navigate, RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    element: <BasicLayout />,
    children: [
      {
        path: "",
        element: <Navigate to={HoneypotsRoutePaths.bugBounties} replace={true} />,
      },
      honeypotsRouter(),
      submissionsRouter(),
      committeeToolsRouter(),
      vaultEditorRouter(),
      hackerProfileRouter(),
      leaderboardRouter(),
      airdropsRouter(),
      myWalletRouter(),
    ],
  },
  {
    path: "*",
    element: <Navigate to={HoneypotsRoutePaths.bugBounties} />,
  },
];

export { routes };
