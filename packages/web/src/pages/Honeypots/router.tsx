import { RoutePaths } from "navigation";
import { Navigate, RouteObject } from "react-router-dom";
import { VaultDetailsPage } from "./VaultDetailsPage/VaultDetailsPage";
import { AuditVaultsPage } from "./VaultsPage/AuditVaultsPage";
import { BugBountyVaultsPage } from "./VaultsPage/BugBountyVaultsPage";

export enum HoneypotsRoutePaths {
  bugBounties = "bug-bounty",
  audits = "audit-competition",
}

const vaultDetailsRoute: RouteObject = {
  path: ":vaultSlug", // vaultName-vaultId,
  children: [
    {
      path: "",
      element: <VaultDetailsPage />,
    },
  ],
};

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
        vaultDetailsRoute,
      ],
    },
    {
      path: HoneypotsRoutePaths.audits,
      children: [
        {
          path: "",
          element: <AuditVaultsPage />,
        },
        vaultDetailsRoute,
      ],
    },
  ],
});
