import { RoutePaths } from "navigation";
import { RouteObject } from "react-router-dom";
// Pages components
import { AirdropsPage } from "./AirdropsPage/AirdropsPage";

export const airdropsRouter = (): RouteObject => ({
  path: `${RoutePaths.airdrop}`,
  children: [
    {
      path: "",
      element: <AirdropsPage />,
    },
  ],
});
