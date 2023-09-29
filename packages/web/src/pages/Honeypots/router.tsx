import { Navigate, RouteObject } from "react-router-dom";
import { VaultDetailsPage } from "./VaultDetailsPage/VaultDetailsPage";
import { AuditVaultsPage } from "./VaultsPage/AuditVaultsPage";
import { BugBountyVaultsPage } from "./VaultsPage/BugBountyVaultsPage";
import { PrivateAuditVaultsPage } from "./VaultsPage/PrivateAuditVaultsPage";

export enum HoneypotsRoutePaths {
  bugBounties = "bug-bounties",
  audits = "audit-competitions",
  privateAudits = "private-audit-competitions",
}

const vaultDetailsRoutes: RouteObject[] = [
  {
    path: ":vaultSlug", // vaultName-vaultId,
    children: [
      {
        path: "",
        element: <Navigate to="rewards" replace={true} />,
      },
      {
        path: ":sectionId",
        element: <VaultDetailsPage />,
      },
    ],
  },
];

export const honeypotsRouter = (): RouteObject => ({
  path: "",
  children: [
    {
      path: HoneypotsRoutePaths.bugBounties,
      children: [
        {
          path: "",
          element: <BugBountyVaultsPage />,
        },
        ...vaultDetailsRoutes,
      ],
    },
    {
      path: HoneypotsRoutePaths.audits,
      children: [
        {
          path: "",
          element: <AuditVaultsPage />,
        },
        ...vaultDetailsRoutes,
      ],
    },
    {
      path: HoneypotsRoutePaths.privateAudits,
      children: [
        {
          path: "",
          element: <PrivateAuditVaultsPage />,
        },
        ...vaultDetailsRoutes,
      ],
    },
  ],
});
