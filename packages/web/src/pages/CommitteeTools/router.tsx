import { RouteObject } from "react-router-dom";
import { RoutePaths } from "navigation";
// Pages components
import { MessageDecryptionHome } from "./MessageDecryptionTool/MessageDecryptionHome";
import { PayoutsHomePage } from "./PayoutsTool/PayoutsHomePage/PayoutsHomePage";
import { PayoutsListPage } from "./PayoutsTool/PayoutsListPage/PayoutsListPage";
import { PayoutFormPage } from "./PayoutsTool/PayoutFormPage/PayoutFormPage";
import { PayoutStatusPage } from "./PayoutsTool/PayoutStatusPage/PayoutStatusPage";

export const committeeToolsRouter = (): RouteObject => ({
  path: `${RoutePaths.committee_tools}`,
  children: [
    {
      path: "",
      element: <MessageDecryptionHome />,
    },
    {
      path: "payouts",
      children: [
        {
          path: "",
          element: <PayoutsHomePage />,
        },
        {
          path: ":vaultChainId/:vaultAddress",
          element: <PayoutsListPage />,
        },
        {
          path: ":vaultChainId/:vaultAddress",
          element: <PayoutFormPage />,
        },
        {
          path: ":vaultChainId/:vaultAddress",
          element: <PayoutStatusPage />,
        },
      ],
    },
  ],
});
