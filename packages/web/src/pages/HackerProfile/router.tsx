import { RoutePaths } from "navigation";
import { Navigate, RouteObject } from "react-router-dom";
import { HackerProfilePage } from "./HackerProfilePage/HackerProfilePage";

export const hackerProfileRouter = (): RouteObject => ({
  path: `${RoutePaths.profile}`,
  children: [
    {
      path: "",
      element: <Navigate to="/" replace={true} />,
    },
    {
      path: ":username",
      element: <HackerProfilePage />,
    },
  ],
});
