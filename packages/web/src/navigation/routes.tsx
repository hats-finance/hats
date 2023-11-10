import { BasicLayout } from "layout";
import { committeeToolsRouter } from "pages/CommitteeTools/router";
import { hackerProfileRouter } from "pages/HackerProfile/router";
import { HoneypotsRoutePaths, honeypotsRouter } from "pages/Honeypots/router";
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
    ],
  },
  {
    path: "*",
    element: <Navigate to={HoneypotsRoutePaths.bugBounties} />,
  },
];

export { routes };
