import { BasicLayout } from "layout";
import { HoneypotsPage } from "pages";
import { committeeToolsRouter } from "pages/CommitteeTools/router";
import { honeypotsRouter } from "pages/Honeypots/router";
import { submissionsRouter } from "pages/Submissions/router";
import { vaultEditorRouter } from "pages/VaultEditor/router";
import { Navigate, RouteObject } from "react-router-dom";
import { RoutePaths } from "./paths";

const routes: RouteObject[] = [
  {
    element: <BasicLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to={RoutePaths.vaults} replace={true} />,
      },
      {
        path: `${RoutePaths.vaults}-old`,
        children: [
          {
            path: "",
            element: <HoneypotsPage />,
          },
          {
            path: ":vaultId",
            element: <HoneypotsPage />,
          },
          {
            path: ":vaultId/deposit",
            element: <HoneypotsPage showDeposit={true} />,
          },
        ],
      },
      honeypotsRouter(),
      submissionsRouter(),
      committeeToolsRouter(),
      vaultEditorRouter(),
    ],
  },
  {
    path: "*",
    element: <Navigate to={RoutePaths.vaults} />,
  },
];

export { routes };
