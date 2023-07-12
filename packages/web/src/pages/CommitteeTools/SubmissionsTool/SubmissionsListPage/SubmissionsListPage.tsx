import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyIcon from "@mui/icons-material/KeyOutlined";
import { Alert, Button, HatSpinner, WalletButton } from "components";
import { useKeystore } from "components/Keystore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { useVaultSubmissionsByKeystore } from "../submissionsService.hooks";
import { SubmissionCard } from "./SubmissionCard";
import { StyledSubmissionsListPage } from "./styles";

export const SubmissionsListPage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { keystore, initKeystore, openKeystore } = useKeystore();

  const { data: committeeSubmissions, isLoading } = useVaultSubmissionsByKeystore();

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
                        {committeeSubmissions?.map((submission, idx) => (
                          <SubmissionCard key={idx} submission={submission} />
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
