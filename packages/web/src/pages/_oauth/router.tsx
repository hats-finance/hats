import { RoutePaths } from "navigation";
import { Navigate, RouteObject } from "react-router-dom";
import { GithubOauth } from "./GithubOauth";
import { TwitterOauth } from "./TwitterOauth";

export const oauthRouter = (): RouteObject => ({
  path: `${RoutePaths.oauth}`,
  children: [
    {
      path: "",
      element: <Navigate to="/" replace={true} />,
    },
    {
      path: "twitter",
      element: <TwitterOauth />,
    },
    {
      path: "github",
      element: <GithubOauth />,
    },
  ],
});
