import { Navigate, RouteObject } from "react-router-dom";
import { RoutePaths } from "navigation";
// Pages components
import { VaultEditorHome } from "./VaultEditorHome/VaultEditorHome";
import { VaultEditorFormPage } from "./VaultEditorFormPage/VaultEditorFormPage";
import { VaultStatusPage } from "./VaultStatusPage/VaultStatusPage";

export const vaultEditorRouter = (): RouteObject => ({
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
      path: "status/:vaultChainId/:vaultAddress",
      element: <VaultStatusPage />,
    },
  ],
});
