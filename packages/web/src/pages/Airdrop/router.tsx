import { RoutePaths } from "navigation";
import { RouteObject } from "react-router-dom";
// Pages components
import { AirdropPage } from "./AirdropPage/AirdropPage";

export const airdropRouter = (): RouteObject => ({
  path: `${RoutePaths.airdrop}`,
  children: [
    {
      path: "",
      element: <AirdropPage />,
    },
  ],
});
