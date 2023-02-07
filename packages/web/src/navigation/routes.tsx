import { Navigate, RouteObject } from "react-router-dom";
import { RoutePaths } from "./paths";
// Page Components
import { BasicLayout } from "layout";
import {
  HoneypotsPage,
  GovPage,
  // VulnerabilityListPage,
  VulnerabilityFormPage,
  CommitteeToolsPage,
  VaultEditorFormPage,
  AirdropMachinePage,
  VaultEditorHome,
  VaultStatusPage,
} from "pages";

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
        path: `${RoutePaths.committee_tools}`,
        element: <CommitteeToolsPage />,
      },
      {
        path: `${RoutePaths.vault_editor}`,
        children: [
          {
            path: "",
            element: <VaultEditorHome />,
          },
          {
            path: ":editSessionId",
            element: <VaultEditorFormPage />,
          },
          {
            path: "status",
            element: <Navigate to={RoutePaths.vault_editor} replace={true} />,
          },
          {
            path: "status/:vaultAddress",
            element: <VaultStatusPage />,
          },
        ],
      },
      {
        path: `${RoutePaths.airdrop_machine}`,
        element: <AirdropMachinePage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={RoutePaths.vaults} />,
  },
];

export { routes };
