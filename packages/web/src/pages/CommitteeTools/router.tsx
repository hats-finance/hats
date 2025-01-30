import { RoutePaths } from "navigation";
import { RouteObject } from "react-router-dom";
import { DecryptionHomePage } from "./DecryptionTool/DecryptionHomePage";
import { PayoutFormPage } from "./PayoutsTool/PayoutFormPage/PayoutFormPage";
import { PayoutStatusPage } from "./PayoutsTool/PayoutStatusPage/PayoutStatusPage";
import { PayoutsListPage } from "./PayoutsTool/PayoutsListPage/PayoutsListPage";
import { SubmissionDetailsPage } from "./SubmissionsTool/SubmissionDetailsPage/SubmissionDetailsPage";
import { SubmissionsListPage } from "./SubmissionsTool/SubmissionsListPage/SubmissionsListPage";
import { RepoAnalysisPage } from "./RepoAnalysisTool/RepoAnalysisPage";

export const committeeToolsRouter = (): RouteObject => ({
  path: `${RoutePaths.committee_tools}`,
  children: [
    {
      path: "",
      element: <DecryptionHomePage />,
    },
    {
      path: "submissions",
      children: [
        {
          path: "",
          element: <SubmissionsListPage />,
        },
        {
          path: ":subId",
          element: <SubmissionDetailsPage />,
        },
      ],
    },
    {
      path: "payouts",
      children: [
        {
          path: "",
          element: <PayoutsListPage />,
        },
        {
          path: ":payoutId",
          element: <PayoutFormPage />,
        },
        {
          path: "status/:payoutId",
          element: <PayoutStatusPage />,
        },
      ],
    },
    {
      path: "repo-analysis",
      element: <RepoAnalysisPage />,
    },
  ],
});
