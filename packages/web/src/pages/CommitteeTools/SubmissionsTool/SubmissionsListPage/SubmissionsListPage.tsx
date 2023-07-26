import { ISubmittedSubmission } from "@hats-finance/shared";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyIcon from "@mui/icons-material/KeyOutlined";
import { Alert, Button, HatSpinner, WalletButton } from "components";
import { useKeystore } from "components/Keystore";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { useVaultSubmissionsByKeystore } from "../submissionsService.hooks";
import { SubmissionCard } from "./SubmissionCard";
import { StyledSubmissionsListPage } from "./styles";

const ITEMS_PER_PAGE = 20;

export const SubmissionsListPage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { keystore, initKeystore, openKeystore } = useKeystore();

  const { data: committeeSubmissions, isLoading } = useVaultSubmissionsByKeystore();
  const [page, setPage] = useState(1);
  const committeeSubmissionsGroups = useMemo<{ date: string; submissions: ISubmittedSubmission[] }[]>(() => {
    if (!committeeSubmissions) return [];
    const pagedSubmissions = committeeSubmissions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const submissionsGroupsByDate = pagedSubmissions.reduce<{ [key: string]: ISubmittedSubmission[] }>((groups, submission) => {
      const date = moment(+submission.createdAt * 1000).format("MM/DD/YYYY");
      if (!groups[date]) groups[date] = [];
      groups[date].push(submission);
      return groups;
    }, {});

    const submissionsGroupsByDateArray = Object.keys(submissionsGroupsByDate).map((date) => {
      return {
        date,
        submissions: submissionsGroupsByDate[date].sort(
          (a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
        ),
      };
    });

    // Order array by date
    submissionsGroupsByDateArray.sort((a, b) => {
      const dateA = moment(a.date, "MM/DD/YYYY");
      const dateB = moment(b.date, "MM/DD/YYYY");
      return dateB.diff(dateA);
    });

    return submissionsGroupsByDateArray;
  }, [committeeSubmissions, page]);

  useEffect(() => {
    if (!keystore) setTimeout(() => initKeystore(), 600);
  }, [keystore, initKeystore]);

  const handleDownloadAsCsv = () => {
    if (!committeeSubmissions) return;
    if (committeeSubmissions.length === 0) return;

    const csvString = [
      ["beneficiary", "severity", "title"],
      ...committeeSubmissions.map((submission, idx) => [
        submission.submissionDataStructure?.beneficiary,
        submission.submissionDataStructure?.severity?.toLowerCase(),
        submission.submissionDataStructure?.title.replaceAll(",", "."),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `hats-submissions-${new Date().getTime()}.csv`);
    a.click();
  };

  return (
    <StyledSubmissionsListPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title">
          <p>
            {t("committeeTools")}/<span className="bold">{t("submissions")}</span>
          </p>
        </div>
      </div>

      {!address ? (
        <>
          <Alert className="mb-4" type="error">
            {t("pleaseConnectYourCommitteeWallet")}
          </Alert>
          <WalletButton expanded />
        </>
      ) : (
        <>
          {!keystore ? (
            <>
              <Alert className="mb-4" type="error">
                {t("youNeedToOpenYourPGPTool")}
              </Alert>
              <Button onClick={() => initKeystore()}>
                <KeyIcon className="mr-2" />
                {t("openPGPTool")}
              </Button>
            </>
          ) : (
            <>
              {isLoading ? (
                <HatSpinner text={`${t("loadingSubmission")}...`} />
              ) : (
                <>
                  <div className="submissions-list">
                    {!committeeSubmissions || committeeSubmissions.length === 0 ? (
                      <>
                        <Alert className="mb-4" type="warning">
                          {t("submissionNotFound")}
                        </Alert>
                        <Button onClick={() => openKeystore()}>
                          <KeyIcon className="mr-2" />
                          {t("openPGPTool")}
                        </Button>
                      </>
                    ) : (
                      <>
                        {committeeSubmissionsGroups?.map((submissionsGroup, idx) => (
                          <div className="group">
                            <p className="group-date">{moment(submissionsGroup.date, "MM/DD/YYYY").format("MMM DD, YYYY")}</p>
                            {submissionsGroup.submissions.map((submission) => (
                              <SubmissionCard key={idx} submission={submission} />
                            ))}
                          </div>
                        ))}

                        <div className="buttons">
                          <Button onClick={handleDownloadAsCsv}>
                            <DownloadIcon className="mr-2" />
                            {t("downloadAsCsv")}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </StyledSubmissionsListPage>
  );
};
