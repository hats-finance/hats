import { Navigate, RouteObject } from "react-router-dom";
import { RoutePaths } from "./paths";
// Page Components
import { BasicLayout } from "layout";
import { HoneypotsPage, GovPage, VulnerabilityFormPage, AirdropMachinePage } from "pages";
import { committeeToolsRouter } from "pages/CommitteeTools/router";
import { vaultEditorRouter } from "pages/VaultEditor/router";

const routes: RouteObject[] = [
  {
    element: <BasicLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to={RoutePaths.vaults} replace={true} />,
      },
      {
        path: `${RoutePaths.vaults}`,
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
      {
        path: `${RoutePaths.gov}`,
        element: <GovPage />,
      },
      {
        path: `${RoutePaths.vulnerability}`,
        children: [
          {
            path: "",
            element: <VulnerabilityFormPage />,
          },
          // {
          //   path: '',
          //   element: <VulnerabilityListPage />,
          // },
          // {
          //   path: 'new',
          //   element: <VulnerabilityListPage />,
          // },
          // {
          //   path: ':vid',
          //   element: <VulnerabilityForm />,
          // }
        ],
      },
      {
        path: `${RoutePaths.airdrop_machine}`,
        element: <AirdropMachinePage />,
      },
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
