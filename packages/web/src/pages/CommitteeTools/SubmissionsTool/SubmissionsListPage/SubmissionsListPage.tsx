import {
  GithubIssue,
  GithubPR,
  IPayoutData,
  ISinglePayoutData,
  ISplitPayoutData,
  ISubmittedSubmission,
  IVault,
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
import KeyIcon from "@mui/icons-material/KeyOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import RescanIcon from "@mui/icons-material/ReplayOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import SyncIcon from "@mui/icons-material/SyncOutlined";
import PayoutIcon from "@mui/icons-material/TollOutlined";
import { AxiosError } from "axios";
import {
  Alert,
  Button,
  FormDateInput,
  FormInput,
  FormSelectInput,
  FormSelectInputOption,
  HatSpinner,
  Loading,
  Modal,
  WalletButton,
} from "components";
import { useKeystore } from "components/Keystore";
import { IndexedDBs } from "config/DBConfig";
import { LocalStorage } from "constants/constants";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useConfirm from "hooks/useConfirm";
import moment from "moment";
import { RoutePaths } from "navigation";
import { useVaultRepoName } from "pages/Honeypots/VaultDetailsPage/hooks";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useIndexedDB } from "react-indexed-db-hook";
import { useLocation, useNavigate } from "react-router-dom";
import { appChains } from "settings";
import { shortenIfAddress } from "utils/addresses.utils";
import { getVaultCurator } from "utils/curator.utils";
import { useAccount } from "wagmi";
import {
  getGhIssueFromSubmission,
  getGhPRFromSubmission,
  getGithubIssuesFromVault,
  getGithubPRsFromVault,
} from "../submissionsService.api";
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
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [vaultFilter, setVaultFilter] = useState<string>(localStorage.getItem(LocalStorage.SelectedVaultInSubmissions) ?? "");
  const [onlyShowLabeled, setOnlyShowLabeled] = useState<boolean>(false);

  const filteredVault = allVaults?.find((vault) => vault.id.toLowerCase() === vaultFilter.toLowerCase());
  const { data: filteredVaultRepoName } = useVaultRepoName(filteredVault);

  const goToFilteredVaultGithubIssues = async () => {
    if (!filteredVaultRepoName) return;

    const githubLink = `https://github.com/hats-finance/${filteredVaultRepoName}/issues`;

    const wantToGo = await confirm({
      title: t("openGithub"),
      titleIcon: <OpenIcon className="mr-2" fontSize="large" />,
      description: t("doYouWantToSeeSubmissionsOnGithub"),
      cancelText: t("no"),
      confirmText: t("yesGo"),
    });

    if (!wantToGo) return;
    window.open(githubLink, "_blank");
  };

  const [vaultGithubIssues, setVaultGithubIssues] = useState<GithubIssue[] | undefined>(undefined);
  const [vaultGithubPRs, setVaultGithubPRs] = useState<GithubPR[] | undefined>(undefined);
  const [isLoadingGH, setIsLoadingGH] = useState<boolean>(false);

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
        return submission.submissionDataStructure.title.toLowerCase().includes(titleFilter.toLowerCase());
      });
    }
    if (vaultFilter && vaultFilter !== "all") {
      filteredSubmissions = filteredSubmissions.filter((submission) => {
        if (!submission.linkedVault?.id) return false;
        return submission.linkedVault?.id.toLowerCase() === vaultFilter.toLowerCase();
      });
    }
    if (vaultFilter && vaultFilter !== "all" && onlyShowLabeled && vaultGithubIssues && vaultGithubIssues.length > 0) {
      filteredSubmissions = filteredSubmissions.filter((submission) => {
        const ghIssue = getGhIssueFromSubmission(submission, vaultGithubIssues);
        const ghPR = getGhPRFromSubmission(submission, vaultGithubPRs);
        return (ghIssue && ghIssue.validLabels.length > 0) || (ghPR && ghPR.bonusSubmissionStatus === "COMPLETE");
      });
    }
    return filteredSubmissions;
  }, [
    committeeSubmissions,
    dateFilter,
    severityFilter,
    titleFilter,
    vaultFilter,
    onlyShowLabeled,
    vaultGithubIssues,
    vaultGithubPRs,
  ]);

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

  const allVaultsOptions = useMemo(() => {
    if (!committeeSubmissions || committeeSubmissions.length === 0) return undefined;
    const vaults = committeeSubmissions.reduce<IVault[]>((prev, submission) => {
      if (!submission.linkedVault) return prev;
      const vault = submission.linkedVault;
      if (vault && !prev.some((v) => v.id === vault.id)) prev.push(vault);
      return prev;
    }, []);

    vaults.sort(
      (a, b) => (b.description?.["project-metadata"].starttime ?? 0) - (a.description?.["project-metadata"].starttime ?? 0)
    );

    const options: FormSelectInputOption[] =
      vaults?.map((vault) => ({
        value: vault.id,
        label: vault.description?.["project-metadata"].name ?? vault.name,
        icon: vault.description?.["project-metadata"].icon,
        onHoverText: `${vault.version} - ${appChains[vault.chainId as number].chain.name}`,
        helper: (
          <div className="vault-address">
            {vault.version === "v1"
              ? `${shortenIfAddress(vault.master.address, { startLength: 6, endLength: 6 })} (PID: ${vault.pid})`
              : shortenIfAddress(vault.id, { startLength: 6, endLength: 6 })}
            <OpenIcon fontSize="small" />
          </div>
        ),
        onHelperClick: () =>
          window.open(
            appChains[vault.chainId as number].chain.blockExplorers?.default.url + "/address/" + vault.id ?? vault.master.address,
            "_blank"
          ),
      })) ?? [];
    options.push({ label: t("all"), value: "all" });

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

  // Set by default first vault as vaultFilter
  useEffect(() => {
    if (!allVaultsOptions) return;
    if (vaultFilter) return;

    if (allVaultsOptions.length === 0) return setVaultFilter("all");
    setVaultFilter(allVaultsOptions[0].value);
  }, [allVaultsOptions, vaultFilter]);

  // Get selected submissions from navigation state
  useEffect(() => {
    const navigationState = location.state as { selectedSubmissions?: string[] };
    if (!navigationState || !navigationState.selectedSubmissions) return;

    setSelectedSubmissions(navigationState.selectedSubmissions as string[]);
    navigate(location.pathname, { replace: true });
  }, [location, navigate]);

  // Get information from github
  useEffect(() => {
    if (!vaultFilter || vaultFilter === "all") return;

    const vault = allVaults?.find((vault) => vault.id.toLowerCase() === vaultFilter.toLowerCase());
    if (!vault) return;
    if (vaultGithubIssues !== undefined || isLoadingGH) return;

    const loadGhIssues = async () => {
      setIsLoadingGH(true);
      const ghIssues = await getGithubIssuesFromVault(vault);
      setVaultGithubIssues(ghIssues);
      setIsLoadingGH(false);
    };
    loadGhIssues();

    const loadGhPRs = async () => {
      const ghPRs = await getGithubPRsFromVault(vault);
      setVaultGithubPRs(ghPRs);
    };
    loadGhPRs();
  }, [vaultFilter, filteredSubmissions, allVaults, vaultGithubIssues, isLoadingGH]);

  // const handleDownloadAsCsv = () => {
  //   if (!filteredSubmissions) return;
  //   if (filteredSubmissions.length === 0) return;

  //   const submissionsToDownload =
  //     selectedSubmissions.length === 0
  //       ? filteredSubmissions
  //       : filteredSubmissions.filter((submission) => selectedSubmissions.includes(submission.subId));

  //   const csvString = [
  //     ["beneficiary", "severity", "title"],
  //     ...submissionsToDownload.map((submission, idx) => [
  //       submission.submissionDataStructure?.beneficiary,
  //       submission.submissionDataStructure?.severity?.toLowerCase(),
  //       submission.submissionDataStructure?.title.replaceAll(",", "."),
  //     ]),
  //   ]
  //     .map((e) => e.join(","))
  //     .join("\n");

  //   const blob = new Blob([csvString], { type: "text/csv" });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.setAttribute("href", url);
  //   a.setAttribute("download", `hats-submissions-${new Date().getTime()}.csv`);
  //   a.click();
  // };

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

    if (vault.destroyed) {
      await confirm({
        title: t("alert"),
        description: t("vaultDestroyedCantCreatePayout"),
        confirmText: t("ok"),
      });
      return;
    }

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

      const ghIssue = getGhIssueFromSubmission(submission, vaultGithubIssues);
      const ghPR = getGhPRFromSubmission(submission, vaultGithubPRs, vaultGithubIssues);

      payoutData = {
        ...(createNewPayoutData("single") as ISinglePayoutData),
        beneficiary: submission?.submissionDataStructure?.beneficiary,
        severity: ghIssue ? ghIssue?.validLabels[0] ?? "" : severity ?? "",
        submissionData: { id: submission?.id, subId: submission?.subId, idx: submission?.submissionIdx },
        depositors: getVaultDepositors(vault),
        curator: await getVaultCurator(vault),
        ghIssue: ghIssue || ghPR,
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

          const ghIssue = getGhIssueFromSubmission(submission, vaultGithubIssues);
          const ghPR = getGhPRFromSubmission(submission, vaultGithubPRs, vaultGithubIssues);

          return {
            ...createNewSplitPayoutBeneficiary(),
            beneficiary: submission?.submissionDataStructure?.beneficiary,
            severity: ghIssue ? ghIssue?.validLabels[0] ?? "" : severity ?? "",
            submissionData: { id: submission?.id, subId: submission?.subId, idx: submission?.submissionIdx },
            ghIssue: ghIssue || ghPR,
          };
        }),
        usingPointingSystem: (vault.description as IVaultDescriptionV2).usingPointingSystem,
        depositors: getVaultDepositors(vault),
        curator: await getVaultCurator(vault),
      } as ISplitPayoutData;
    }

    console.log(payoutData);

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
                        <div className="selection" onClick={handleSelectAll}>
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
                            onChange={(severity) => {
                              setSeverityFilter(severity as string);
                              setPage(1);
                            }}
                          />
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
                      <div className="controls-row">
                        <div className="vaults-filter">
                          <FormSelectInput
                            value={vaultFilter ?? ""}
                            label={t("SubmissionsTool.filterByVault")}
                            placeholder={t("vault")}
                            colorable
                            options={allVaultsOptions ?? []}
                            noMargin
                            onChange={(vaultId) => {
                              setVaultFilter(vaultId as string);
                              localStorage.setItem(LocalStorage.SelectedVaultInSubmissions, vaultId as string);
                              setVaultGithubIssues(undefined);
                              setVaultGithubPRs(undefined);
                              setSelectedSubmissions([]);
                              setPage(1);
                            }}
                          />
                        </div>
                        <div className="title-filter">
                          <FormInput
                            value={titleFilter ?? ""}
                            label={t("SubmissionsTool.filterByTitle")}
                            placeholder={t("SubmissionsTool.title")}
                            colorable
                            noMargin
                            onChange={(e) => {
                              setTitleFilter(e.target.value as string);
                              setPage(1);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex">
                        <Button styleType="text" textColor="secondary" onClick={() => setVaultFilter("all")}>
                          {t("SubmissionsTool.showAllVaults")}
                        </Button>

                        <div className="flex-end">
                          {vaultFilter !== "all" && vaultGithubIssues && vaultGithubIssues.length > 0 && (
                            <FormInput
                              name="onlyShowLabeled"
                              checked={onlyShowLabeled}
                              onChange={(e) => setOnlyShowLabeled(e.target.checked)}
                              type="toggle"
                              label={t("onlyShowLabeledIssues")}
                              noMargin
                            />
                          )}
                          {filteredVault && (
                            <Button styleType="text" textColor="secondary" onClick={goToFilteredVaultGithubIssues}>
                              {t("SubmissionsTool.goToVaultGithubIssues")}
                            </Button>
                          )}
                        </div>
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
                                const alreadyChecked = selectedSubmissions.includes(submission.subId);
                                const usedVault = (committeeSubmissions ?? []).find(
                                  (sub) => sub.subId === selectedSubmissions[0]
                                )?.linkedVault;
                                const isAuditComp = usedVault?.description?.["project-metadata"].type === "audit";

                                // If not the same vault, can't select
                                if (usedVault && usedVault.id.toLowerCase() !== submission.linkedVault?.id.toLowerCase())
                                  return undefined;

                                // If v1 or bug-bounty, only can select one vault (multi payout not available)
                                if (usedVault && !alreadyChecked && (!isAuditComp || usedVault.version === "v1"))
                                  return undefined;

                                // If v1 or bug-bounty, only can select one vault (multi payout not available)
                                // if (alreadyChecked && (usedVault?.version === "v1" || !isAuditComp)) return undefined;

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
                                  ghIssue={
                                    getGhIssueFromSubmission(submission, vaultGithubIssues) ||
                                    getGhPRFromSubmission(submission, vaultGithubPRs, vaultGithubIssues)
                                  }
                                />
                              );
                            })}
                          </div>
                        ))}

                        <div className="pages">
                          <ArrowLeftIcon className="icon" onClick={handleChangePage(-1)} />

                          {(() => {
                            const totalPages = filteredSubmissions ? Math.ceil(filteredSubmissions?.length / ITEMS_PER_PAGE) : 1;

                            if (totalPages <= 20) {
                              return Array.from(Array(totalPages).keys()).map((pageIdx) => (
                                <p
                                  key={pageIdx + 1}
                                  onClick={() => setPage(pageIdx + 1)}
                                  className={`number ${page === pageIdx + 1 && "current"}`}
                                >
                                  {pageIdx + 1}
                                </p>
                              ));
                            } else {
                              return (
                                <>
                                  {page > 1 && (
                                    <>
                                      <p onClick={() => setPage(1)} className={`number ${page === 1 && "current"}`}>
                                        1
                                      </p>
                                      <p>...</p>
                                    </>
                                  )}

                                  {Array.from(
                                    { length: 20 },
                                    (_, i) => i + (totalPages - page > 20 ? page : totalPages - 20)
                                  ).map((pageIdx) => (
                                    <p
                                      key={pageIdx}
                                      onClick={() => setPage(pageIdx)}
                                      className={`number ${page === pageIdx && "current"}`}
                                    >
                                      {pageIdx}
                                    </p>
                                  ))}

                                  {totalPages - page > 20 && <p>...</p>}
                                  <p onClick={() => setPage(totalPages)} className={`number ${page === totalPages && "current"}`}>
                                    {totalPages}
                                  </p>
                                </>
                              );
                            }
                          })()}

                          {/* {Array.from(
                            { length: filteredSubmissions ? Math.ceil(filteredSubmissions?.length / ITEMS_PER_PAGE) : 1 },
                            (_, i) => i + 1
                          ).map((pageIdx) => (
                            <p key={pageIdx} onClick={() => setPage(pageIdx)} className={`${page === pageIdx && "current"}`}>
                              {pageIdx}
                            </p>
                          ))} */}
                          <ArrowRightIcon className="icon" onClick={handleChangePage(1)} />
                        </div>

                        <div className="buttons">
                          {/* <Button onClick={handleDownloadAsCsv}>
                            <DownloadIcon className="mr-2" />
                            {selectedSubmissions.length === 0
                              ? t("downloadAllSubmissionsCsv")
                              : t("downloadSelectedSubmissionsCsv", { num: selectedSubmissions.length })}
                          </Button> */}
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
      {isLoadingGH && <Loading fixed extraText={`${t("loadingGithubIssues")}...`} />}
    </StyledSubmissionsListPage>
  );
};
