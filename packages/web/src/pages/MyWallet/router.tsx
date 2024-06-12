import { RoutePaths } from "navigation";
import { RouteObject } from "react-router-dom";
// Pages components
import { MyWalletPage } from "./MyWalletPage/MyWalletPage";

export const myWalletRouter = (): RouteObject => ({
  path: `${RoutePaths.myWallet}`,
  children: [
    {
      path: "",
      element: <MyWalletPage />,
    },
  ],
});
