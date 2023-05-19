import { RoutePaths } from "navigation";
import { Navigate, RouteObject } from "react-router-dom";
import { VaultDetailsPage } from "./VaultDetailsPage/VaultDetailsPage";
import { AuditVaultsPage } from "./VaultsPage/AuditVaultsPage";
import { BugBountyVaultsPage } from "./VaultsPage/BugBountyVaultsPage";

export enum HoneypotsRoutePaths {
  bugBounties = "bug-bounties",
  audits = "audits",
}

export const honeypotsRouter = (): RouteObject => ({
  path: `${RoutePaths.vaults}`,
  children: [
    {
      path: "",
      element: <Navigate to={HoneypotsRoutePaths.bugBounties} replace={true} />,
    },
    {
      path: HoneypotsRoutePaths.bugBounties,
      children: [
        {
          path: "",
          element: <BugBountyVaultsPage />,
        },
        {
          path: ":vaultId",
          element: <VaultDetailsPage />,
        },
      ],
    },
    {
      path: HoneypotsRoutePaths.audits,
      children: [
        {
          path: "",
          element: <AuditVaultsPage />,
        },
        {
          path: ":vaultId",
          element: <VaultDetailsPage />,
        },
      ],
    },
  ],
});
