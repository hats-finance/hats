import {
  IPayoutData,
  ISinglePayoutData,
  ISplitPayoutData,
  ISubmittedSubmission,
  IVaultDescriptionV2,
  IVulnerabilitySeverity,
  PayoutType,
  createNewPayoutData,
  createNewSplitPayoutBeneficiary,
  getVaultDepositors,
  getVaultInfoFromVault,
  parseSeverityName,
} from "@hats.finance/shared";
import ArrowLeftIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowRightIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";
import BoxUnselected from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import BoxSelected from "@mui/icons-material/CheckBoxOutlined";
import ClearIcon from "@mui/icons-material/ClearOutlined";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyIcon from "@mui/icons-material/KeyOutlined";
import RescanIcon from "@mui/icons-material/ReplayOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import SyncIcon from "@mui/icons-material/SyncOutlined";
import PayoutIcon from "@mui/icons-material/TollOutlined";
import { AxiosError } from "axios";
import { Alert, Button, FormDateInput, FormInput, FormSelectInput, HatSpinner, Loading, Modal, WalletButton } from "components";
import { useKeystore } from "components/Keystore";
import { IndexedDBs } from "config/DBConfig";
import { LocalStorage } from "constants/constants";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useConfirm from "hooks/useConfirm";
import moment from "moment";
import { RoutePaths } from "navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useIndexedDB } from "react-indexed-db-hook";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useCreatePayoutFromSubmissions, useVaultSubmissionsByKeystore } from "../submissionsService.hooks";
import { SubmissionCard } from "./SubmissionCard";
import { StyledSubmissionsListPage } from "./styles";

const ITEMS_PER_PAGE = 20;

export const SubmissionsListPage = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { tryAuthentication } = useSiweAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { address } = useAccount();
  const { keystore, initKeystore, openKeystore } = useKeystore();
  const { clear: deleteDecryptedSubmissionsDB } = useIndexedDB(IndexedDBs.DecryptedSubmissions);
  const { allVaults, vaultsReadyAllChains } = useVaults();

  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState({ from: 0, to: 0, active: false });
  const [severityFilter, setSeverityFilter] = useState<string>();
  const [titleFilter, setTitleFilter] = useState<string>("");

  const { data: committeeSubmissions, isLoading, loadingProgress } = useVaultSubmissionsByKeystore();

  const filteredSubmissions = useMemo(() => {
    if (!committeeSubmissions) return [];

    let filteredSubmissions = [...committeeSubmissions];
    if (dateFilter.active) {
      filteredSubmissions = filteredSubmissions.filter((submission) => {
        return +submission.createdAt >= dateFilter.from && +submission.createdAt <= dateFilter.to;
      });
    }
    if (severityFilter && severityFilter !== "all") {
      filteredSubmissions = filteredSubmissions.filter((submission) => {
        if (!submission.submissionDataStructure?.severity) return false;
        return parseSeverityName(submission.submissionDataStructure.severity) === severityFilter;
      });
    }
    if (titleFilter) {
      filteredSubmissions = filteredSubmissions.filter((submission) => {
        if (!submission.submissionDataStructure?.title) return false;
        console.log(titleFilter);
        return submission.submissionDataStructure.title.toLowerCase().includes(titleFilter.toLowerCase());
      });
    }
    return filteredSubmissions;
  }, [committeeSubmissions, dateFilter, severityFilter, titleFilter]);

  const allSeveritiesOptions = useMemo(() => {
    if (!committeeSubmissions) return [];
    const severities = committeeSubmissions.reduce<string[]>((prev, submission) => {
      if (!submission.submissionDataStructure?.severity) return prev;
      const severity = parseSeverityName(submission.submissionDataStructure?.severity);
      if (severity && !prev.includes(severity)) prev.push(severity);
      return prev;
    }, []);

    const options = severities.map((severity) => ({ label: severity, value: severity }));
    options.unshift({ label: t("all"), value: "all" });
    return options;
  }, [committeeSubmissions, t]);

  const createPayoutFromSubmissions = useCreatePayoutFromSubmissions();

  const [page, setPage] = useState(1);
  const savedSelectedSubmissions = sessionStorage.getItem(LocalStorage.SelectedSubmissions);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>(
    savedSelectedSubmissions ? JSON.parse(savedSelectedSubmissions) : []
  );

  const vault = allVaults?.find(
    (vault) =>
      vault.id.toLowerCase() === committeeSubmissions?.find((sub) => sub.subId === selectedSubmissions[0])?.linkedVault?.id
  );
  const isAuditComp = vault?.description?.["project-metadata"].type === "audit";
  const shouldCreateSinglePayout = vault && selectedSubmissions.length === 1 && !isAuditComp;

  const committeeSubmissionsGroups = useMemo<{ date: string; submissions: ISubmittedSubmission[] }[]>(() => {
    if (!filteredSubmissions) return [];
    const pagedSubmissions = filteredSubmissions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
  }, [filteredSubmissions, page]);
  const allInPage = committeeSubmissionsGroups.reduce((prev, acc) => [...prev, ...acc.submissions], [] as ISubmittedSubmission[]);
  const allPageSelected = allInPage.every((submission) => selectedSubmissions.includes(submission.subId));
  const quantityInPage = allInPage.length;

  useEffect(() => {
    if (!keystore) setTimeout(() => initKeystore(), 600);
  }, [keystore, initKeystore]);

  useEffect(() => {
    sessionStorage.setItem(LocalStorage.SelectedSubmissions, JSON.stringify(selectedSubmissions));
  }, [selectedSubmissions]);

  // Get selected submissions from navigation state
  useEffect(() => {
    const navigationState = location.state as { selectedSubmissions?: string[] };
    if (!navigationState || !navigationState.selectedSubmissions) return;

    setSelectedSubmissions(navigationState.selectedSubmissions as string[]);
    navigate(location.pathname, { replace: true });
  }, [location, navigate]);

  const handleDownloadAsCsv = () => {
    if (!filteredSubmissions) return;
    if (filteredSubmissions.length === 0) return;

    const submissionsToDownload =
      selectedSubmissions.length === 0
        ? filteredSubmissions
        : filteredSubmissions.filter((submission) => selectedSubmissions.includes(submission.subId));

    const csvString = [
      ["beneficiary", "severity", "title"],
      ...submissionsToDownload.map((submission, idx) => [
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

  const handleChangePage = (direction: number) => () => {
    if (direction === -1) {
      if (page === 1) return;
      setPage(page - 1);
    } else {
      if (page * ITEMS_PER_PAGE >= (filteredSubmissions?.length ?? 0)) return;
      setPage(page + 1);
    }
  };

  const handleRescan = async () => {
    const wantToRescan = await confirm({
      title: t("SubmissionsTool.rescanSubmissions"),
      titleIcon: <RescanIcon className="mr-2" fontSize="large" />,
      description: t("SubmissionsTool.rescanSubmissionsDescription"),
      cancelText: t("no"),
      confirmText: t("rescan"),
    });

    if (!wantToRescan) return;

    await deleteDecryptedSubmissionsDB();
    sessionStorage.removeItem(`${LocalStorage.SelectedSubmissions}`);
    window.location.reload();
  };

  const handleSelectAll = () => {
    if (allPageSelected) {
      setSelectedSubmissions((selected) =>
        selected.filter((subId) => !allInPage.map((submission) => submission.subId).includes(subId))
      );
    } else {
      setSelectedSubmissions((selected) => [...selected, ...allInPage.map((submission) => submission.subId)]);
    }
  };

  const handleDateFiltering = () => {
    setOpenDateFilter(false);

    if (dateFilter.from === 0 && dateFilter.to === 0) return setDateFilter((prev) => ({ ...prev, active: false }));

    setPage(1);
    setDateFilter((prev) => ({ ...prev, active: true }));
  };

  const handleCreatePayout = async () => {
    if (!vaultsReadyAllChains) return;
    if (!vault || !committeeSubmissions) return;
    if (!vault.description || !vault.description.severities) return;

    console.log(vault);

    const wantToCreatePayout = await confirm({
      title: t("SubmissionsTool.createPayout"),
      titleIcon: <PayoutIcon className="mr-2" fontSize="large" />,
      description: t("SubmissionsTool.createPayoutDescription"),
      cancelText: t("no"),
      confirmText: t("create"),
    });
    if (!wantToCreatePayout) return;

    const authenticated = await tryAuthentication();
    if (!authenticated) return;

    const vaultInfo = getVaultInfoFromVault(vault);
    const payoutType: PayoutType = shouldCreateSinglePayout ? "single" : "split";
    let payoutData: IPayoutData;

    if (payoutType === "single") {
      const submission = committeeSubmissions.find((sub) => sub.subId === selectedSubmissions[0]);
      const severity =
        (vault.description.severities as IVulnerabilitySeverity[])
          .find((sev) => submission?.submissionDataStructure?.severity?.includes(sev.name.toLowerCase()))
          ?.name.toLowerCase() ?? submission?.submissionDataStructure?.severity;

      payoutData = {
        ...(createNewPayoutData("single") as ISinglePayoutData),
        beneficiary: submission?.submissionDataStructure?.beneficiary,
        severity: severity ?? "",
        submissionData: { id: submission?.id, subId: submission?.subId, idx: submission?.submissionIdx },
        depositors: getVaultDepositors(vault),
      } as ISinglePayoutData;
    } else {
      const submissions = committeeSubmissions.filter((sub) => selectedSubmissions.includes(sub.subId));
      payoutData = {
        ...(createNewPayoutData("split") as ISplitPayoutData),
        beneficiaries: submissions.map((submission) => {
          const severity =
            (vault.description?.severities as IVulnerabilitySeverity[])
              .find((sev) => submission?.submissionDataStructure?.severity?.includes(sev.name.toLowerCase()))
              ?.name.toLowerCase() ?? submission?.submissionDataStructure?.severity;

          return {
            ...createNewSplitPayoutBeneficiary(),
            beneficiary: submission?.submissionDataStructure?.beneficiary,
            severity: severity ?? "",
            submissionData: { id: submission?.id, subId: submission?.subId, idx: submission?.submissionIdx },
          };
        }),
        usingPointingSystem: (vault.description as IVaultDescriptionV2).usingPointingSystem,
        depositors: getVaultDepositors(vault),
      } as ISplitPayoutData;
    }

    try {
      const payoutId = await createPayoutFromSubmissions.mutateAsync({ vaultInfo, type: payoutType, payoutData });
      setSelectedSubmissions([]);

      if (payoutId) navigate(`${RoutePaths.payouts}/${payoutId}`);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          alert(t("SubmissionsTool.notAllowedToCreatePayout"));
        }
      }
    }
  };

  return (
    <StyledSubmissionsListPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title">
          <p>
            {t("committeeTools")}/<span className="bold">{t("submissions")}</span>
          </p>
          {loadingProgress < 100 && loadingProgress > 0 && isLoading && (
            <div className="sync-indicator">
              <SyncIcon className="icon-rotator" />
              <p>
                {t("syncing")} {loadingProgress.toFixed(0)}%
              </p>
            </div>
          )}
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
          {!keystore || keystore.storedKeys.length === 0 ? (
            <>
              <Alert className="mb-4" type="info">
                {t("youNeedToOpenYourPGPTool")}
              </Alert>
              <Button onClick={keystore ? openKeystore : initKeystore}>
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
                  <div className="toolbar">
                    <div className="controls">
                      <div className="controls-row">
                        <div style={{ display: "none" }} className="selection" onClick={handleSelectAll}>
                          {allPageSelected ? (
                            <BoxSelected className="icon" fontSize="inherit" />
                          ) : (
                            <BoxUnselected className="icon" fontSize="inherit" />
                          )}
                          <p>
                            {t("SubmissionsTool.selectAll")} ({quantityInPage})
                          </p>
                        </div>
                        <div className="rescan" onClick={handleRescan}>
                          <RescanIcon /> {t("SubmissionsTool.rescan")}
                        </div>
                        <div className="date-sort" onClick={() => setOpenDateFilter(true)}>
                          <CalendarIcon /> {t("SubmissionsTool.filterByDateShort")} {dateFilter.active && `(${t("active")})`}
                        </div>
                        <div className="severity-filter">
                          <FormSelectInput
                            value={severityFilter ?? ""}
                            label={t("SubmissionsTool.filterBySeverity")}
                            placeholder={t("severity")}
                            colorable
                            options={allSeveritiesOptions}
                            noMargin
                            onChange={(severity) => setSeverityFilter(severity as string)}
                          />
                        </div>
                      </div>
                      <div className="controls-row">
                        <div className="title-filter">
                          <FormInput
                            value={titleFilter ?? ""}
                            label={t("SubmissionsTool.filterByTitle")}
                            placeholder={t("SubmissionsTool.title")}
                            colorable
                            noMargin
                            onChange={(e) => setTitleFilter(e.target.value as string)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pagination">
                      <p>
                        {(page - 1) * ITEMS_PER_PAGE + 1}-{(page - 1) * ITEMS_PER_PAGE + quantityInPage}
                        <strong> of {filteredSubmissions?.length ?? 0}</strong>
                      </p>
                      <div className="selection">
                        <ArrowLeftIcon onClick={handleChangePage(-1)} />
                        <ArrowRightIcon onClick={handleChangePage(1)} />
                      </div>
                    </div>
                  </div>
                  {selectedSubmissions.length > 0 && (
                    <Alert type="info" className="mb-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: t("SubmissionsTool.youHaveSelectedNSubmissions", { num: selectedSubmissions.length }),
                        }}
                      />
                    </Alert>
                  )}
                  <div className="submissions-list">
                    {!filteredSubmissions || filteredSubmissions.length === 0 ? (
                      <>
                        {dateFilter.active ? (
                          <>
                            <Alert className="mb-4" type="warning">
                              {t("SubmissionsTool.noSubmissionsFoundForThisDate")}
                            </Alert>
                            <Button onClick={() => setDateFilter({ to: 0, from: 0, active: false })}>
                              <ClearIcon className="mr-2" />
                              {t("SubmissionsTool.removeDateFilter")}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Alert className="mb-4" type="warning">
                              {t("submissionNotFound")}
                            </Alert>
                            <Button onClick={() => openKeystore()}>
                              <KeyIcon className="mr-2" />
                              {t("openPGPTool")}
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {committeeSubmissionsGroups?.map((submissionsGroup, idx) => (
                          <div className="group" key={submissionsGroup.date}>
                            <p className="group-date">{moment(submissionsGroup.date, "MM/DD/YYYY").format("MMM DD, YYYY")}</p>
                            {submissionsGroup.submissions.map((submission) => {
                              const getOnCheckChange = () => {
                                const usedVault = (committeeSubmissions ?? []).find(
                                  (sub) => sub.subId === selectedSubmissions[0]
                                )?.linkedVault;

                                if (usedVault && usedVault.id.toLowerCase() !== submission.linkedVault?.id.toLowerCase())
                                  return undefined;
                                // If v1, only can select one vault (multi payout not available)
                                if (usedVault?.version === "v1") return undefined;

                                return (sub: ISubmittedSubmission) => {
                                  if (selectedSubmissions.includes(sub.subId)) {
                                    setSelectedSubmissions(selectedSubmissions.filter((subId) => subId !== sub.subId));
                                  } else {
                                    setSelectedSubmissions([...selectedSubmissions, sub.subId]);
                                  }
                                };
                              };

                              return (
                                <SubmissionCard
                                  onCheckChange={getOnCheckChange()}
                                  isChecked={selectedSubmissions.includes(submission.subId)}
                                  key={submission.subId}
                                  submission={submission}
                                />
                              );
                            })}
                          </div>
                        ))}

                        <div className="pages">
                          <ArrowLeftIcon className="icon" onClick={handleChangePage(-1)} />
                          {Array.from(
                            { length: filteredSubmissions ? Math.ceil(filteredSubmissions?.length / ITEMS_PER_PAGE) : 1 },
                            (_, i) => i + 1
                          ).map((pageIdx) => (
                            <p key={pageIdx} onClick={() => setPage(pageIdx)} className={`${page === pageIdx && "current"}`}>
                              {pageIdx}
                            </p>
                          ))}
                          <ArrowRightIcon className="icon" onClick={handleChangePage(1)} />
                        </div>

                        <div className="buttons">
                          <Button onClick={handleDownloadAsCsv}>
                            <DownloadIcon className="mr-2" />
                            {selectedSubmissions.length === 0
                              ? t("downloadAllSubmissionsCsv")
                              : t("downloadSelectedSubmissionsCsv", { num: selectedSubmissions.length })}
                          </Button>
                          {selectedSubmissions.length >= 1 && (
                            <Button onClick={handleCreatePayout}>
                              <PayoutIcon className="mr-2" />
                              {shouldCreateSinglePayout ? t("createSinglePayout") : t("createMultiPayout")}
                            </Button>
                          )}
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

      <Modal
        isShowing={openDateFilter}
        onHide={() => setOpenDateFilter(false)}
        titleIcon={<CalendarIcon className="mr-3" />}
        title={t("SubmissionsTool.filterByDate")}
      >
        <>
          <FormDateInput
            name="from"
            label={t("from")}
            placeholder={t("selectDate")}
            colorable
            value={dateFilter.from}
            onChange={(date) => setDateFilter((prev) => ({ ...prev, from: date }))}
            helper={dateFilter.from ? moment(dateFilter.from * 1000).format("LL") : ""}
          />
          <FormDateInput
            name="to"
            label={t("to")}
            placeholder={t("selectDate")}
            colorable
            value={dateFilter.to}
            onChange={(date) => setDateFilter((prev) => ({ ...prev, to: date }))}
            helper={dateFilter.to ? moment(dateFilter.to * 1000).format("LL") : ""}
          />

          <Button disabled={!dateFilter.from || !dateFilter.to} onClick={handleDateFiltering} expanded className="mt-3">
            <SearchIcon className="mr-3" /> {t("SubmissionsTool.filterSubmissions")}
          </Button>
          {dateFilter.active && (
            <Button styleType="text" className="mt-4" onClick={() => setDateFilter({ active: false, from: 0, to: 0 })} expanded>
              {t("SubmissionsTool.removeDateFilter")}
            </Button>
          )}
        </>
      </Modal>
      {createPayoutFromSubmissions.isLoading && <Loading fixed extraText={`${t("creatingPayout")}...`} />}
      {!vaultsReadyAllChains && <Loading fixed extraText={`${t("loadingVaults")}...`} />}
    </StyledSubmissionsListPage>
  );
};
