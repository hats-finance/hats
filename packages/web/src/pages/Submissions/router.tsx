import { RoutePaths } from "navigation";
import { RouteObject } from "react-router-dom";
import { SubmissionFormPage } from "./SubmissionFormPage/SubmissionFormPage";

export const submissionsRouter = (): RouteObject => ({
  path: `${RoutePaths.vulnerability}`,
  children: [
    {
      path: "",
      element: <SubmissionFormPage />,
    },
  ],
});
