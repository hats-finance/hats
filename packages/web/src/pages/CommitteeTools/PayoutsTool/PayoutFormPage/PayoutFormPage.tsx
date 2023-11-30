import {
  IPayoutData,
  IVulnerabilitySeverityV1,
  IVulnerabilitySeverityV2,
  PayoutStatus,
  getVaultInfoFromVault,
} from "@hats-finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardOutlined";
import RemoveIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Alert, Button, CopyToClipboard, FormSelectInputOption, Loading, Seo, VaultInfoCard, WithTooltip } from "components";
import { useKeystore } from "components/Keystore";
import { queryClient } from "config/reactQuery";
import DOMPurify from "dompurify";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useConfirm from "hooks/useConfirm";
import moment from "moment";
import { RoutePaths } from "navigation";
import { useVaultSubmissionsByKeystore } from "pages/CommitteeTools/SubmissionsTool/submissionsService.hooks";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { PayoutsWelcome } from "../PayoutsListPage/PayoutsWelcome";
import { useDeletePayout, useLockPayout, usePayout, useSavePayout, useVaultInProgressPayouts } from "../payoutsService.hooks";
import { hasSubmissionData } from "../utils/hasSubmissionData";
import { getSinglePayoutDataYupSchema, getSplitPayoutDataYupSchema } from "./formSchema";
import { SinglePayoutForm, SplitPayoutForm } from "./forms";
import { IPayoutFormContext, PayoutFormContext } from "./store";
import { StyledPayoutForm, StyledPayoutFormPage } from "./styles";

export const PayoutFormPage = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { allVaults } = useVaults();
  const { tryAuthentication, isAuthenticated } = useSiweAuth();
  const { keystore, initKeystore } = useKeystore();

  const { payoutId } = useParams();
  const { data: payout, isFetching: isLoadingPayout, error: payoutError, refetch: refetchPayout } = usePayout(payoutId);
  const { data: vaultActivePayouts } = useVaultInProgressPayouts(payout?.vaultInfo);
  const deletePayout = useDeletePayout();
  const savePayout = useSavePayout();
  const lockPayout = useLockPayout();

  const vault = useMemo(() => allVaults?.find((vault) => vault.id === payout?.vaultInfo.address), [allVaults, payout]);
  const isAnotherActivePayout = vaultActivePayouts && vaultActivePayouts?.length > 0;
  const isPayoutCreated = payout?.status !== PayoutStatus.Creating;

  const isFromSubmissions = hasSubmissionData(payout);
  const { data: committeeSubmissions, isLoading: loadingSubmissions } = useVaultSubmissionsByKeystore(
    !isFromSubmissions && !isPayoutCreated
  );

  const methods = useForm<IPayoutData>({
    resolver: payout
      ? payout.payoutData.type === "single"
        ? yupResolver(getSinglePayoutDataYupSchema(t, vault))
        : yupResolver(getSplitPayoutDataYupSchema(t, vault))
      : undefined,
    mode: "onChange",
  });
  const { reset: handleReset, handleSubmit, formState, getValues, setValue } = methods;

  const [severitiesOptions, setSeveritiesOptions] = useState<FormSelectInputOption[] | undefined>();

  useEffect(() => {
    if (!payout || isPayoutCreated) return;

    // Only ask to unlock keystore if the payout has submission data
    const hasSubmission = hasSubmissionData(payout);
    if (!hasSubmission) return;

    if (!keystore) setTimeout(() => initKeystore(), 600);
  }, [keystore, initKeystore, payout, isPayoutCreated]);

  useEffect(() => {
    tryAuthentication();
  }, [tryAuthentication]);

  useEffect(() => {
    refetchPayout();
  }, [address, refetchPayout]);

  // Handle reset form when payout changes
  useEffect(() => {
    if (!payout) return;
    handleReset(payout.payoutData, { keepErrors: true });
  }, [payout, handleReset]);

  // Get payout severities information from allVaults
  useEffect(() => {
    if (!payout || !vault || !vault.description || !allVaults) return;

    if (vault.description) {
      const severities = vault.description.severities.map((severity: IVulnerabilitySeverityV1 | IVulnerabilitySeverityV2) => ({
        label: severity.name.toLowerCase().replace("severity", "").trim(),
        value: severity.name.toLowerCase(),
      }));

      // if the current severity is not in the list of severities, add it
      if (payout.payoutData.type === "single") {
        const payoutData = payout.payoutData;
        if (payoutData.severity && !severities.find((severity) => severity.value === payoutData.severity)) {
          severities.push({
            label: `${payoutData.severity.toLowerCase().replace("severity", "").trim()} (select other)`,
            value: payoutData.severity.toLowerCase(),
          });
        }
      } else {
        for (const splitPayoutBeneficiary of payout.payoutData.beneficiaries) {
          if (
            splitPayoutBeneficiary.severity &&
            !severities.find((severity) => severity.value === splitPayoutBeneficiary.severity)
          ) {
            severities.push({
              label: `${splitPayoutBeneficiary.severity.toLowerCase().replace("severity", "").trim()} (select other)`,
              value: splitPayoutBeneficiary.severity.toLowerCase(),
            });
          }
        }
      }

      setSeveritiesOptions(severities);
    }
  }, [allVaults, payout, vault, t]);

  const handleDeletePayout = async () => {
    if (isPayoutCreated) return;
    if (!payoutId || !payout) return;

    const wantsToDelete = await confirm({
      title: t("Payouts.deletePayout"),
      titleIcon: <RemoveIcon className="mr-2" fontSize="large" />,
      description: t("Payouts.deletePayoutDescription"),
      cancelText: t("no"),
      confirmText: t("delete"),
    });

    if (!wantsToDelete) return;

    const wasDeleted = await deletePayout.mutateAsync({ payoutId });
    if (wasDeleted) navigate(`${RoutePaths.payouts}`);
  };

  const handleSavePayout = async () => {
    if (isPayoutCreated) return;
    if (!payoutId || !payout || !isAuthenticated || !formState.isDirty || !vault) return;

    try {
      const payoutData = methods.getValues();

      const payoutResponse = await savePayout.mutateAsync({
        payoutId,
        vaultInfo: getVaultInfoFromVault(vault),
        payoutData: {
          ...payoutData,
          vault,
        },
      });

      // Reset after 3 seconds for the user to see the success message
      setTimeout(() => savePayout.reset(), 3000);
      queryClient.setQueryData(["payout", payoutId], payoutResponse);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLockPayout = async () => {
    // Put decrypted submission data in the payoutData
    if (isFromSubmissions && !keystore) return await initKeystore();

    if (isPayoutCreated || !address || !isAuthenticated || !payoutId || isAnotherActivePayout) return;

    // If the payout is from submissions, we need to save the decrypted submission data in the payoutData
    if (isFromSubmissions) {
      const form = getValues();

      if (form.type === "single") {
        const submission = committeeSubmissions?.find((sub) => sub.subId === form.submissionData?.subId);
        if (submission) {
          setValue("decryptedSubmission", {
            ...submission,
            submissionDataStructure: { ...submission.submissionDataStructure, communicationChannel: undefined },
          } as any);
        }
      } else {
        for (const [idx, ben] of form.beneficiaries.entries()) {
          const submission = committeeSubmissions?.find((sub) => sub.subId === ben.submissionData?.subId);
          if (submission) {
            setValue(`beneficiaries.${idx}.decryptedSubmission`, {
              ...submission,
              submissionDataStructure: { ...submission.submissionDataStructure, communicationChannel: undefined },
            } as any);
          }
        }
      }
    }

    try {
      await handleSavePayout();
      const wasLocked = await lockPayout.mutateAsync({ payoutId });
      if (wasLocked) navigate(`${RoutePaths.payouts}/status/${payoutId}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (payoutError?.response?.status === 403)
    return (
      <>
        <Alert type="error">{t("Payouts.connectedAccountNoPermissionsOnThisPayout")}</Alert>
        {!isAuthenticated && (
          <Button onClick={tryAuthentication} className="mt-4">
            {t("signInWithEthereum")}
          </Button>
        )}
      </>
    );
  if (!address) return <PayoutsWelcome />;
  if (isLoadingPayout || allVaults?.length === 0) return <Loading extraText={`${t("Payouts.loadingPayoutData")}...`} />;

  const payoutFormContext: IPayoutFormContext = {
    payout,
    vault,
    isPayoutCreated,
    severitiesOptions,
  };

  return (
    <>
      <Seo title={t("seo.createPayoutTitle")} />
      <PayoutFormContext.Provider value={payoutFormContext}>
        <StyledPayoutFormPage className="content-wrapper-md">
          <div className="mb-5">{vault && <VaultInfoCard vault={vault} />}</div>

          <div className="title-container">
            {payout?.updatedAt && (
              <p className="lastModifiedOn">
                <strong>{t("saved")}</strong> {moment(payout.updatedAt).fromNow()}
              </p>
            )}

            <div className="title" onClick={() => navigate(`${RoutePaths.payouts}`)}>
              <BackIcon />
              <p>{t("payouts")}</p>
            </div>
          </div>

          <div className="section-title">
            <p>
              {t(payout?.payoutData.type === "single" ? "Payouts.creatingSinglePayout" : "Payouts.creatingSplitPayout")}{" "}
              {!isPayoutCreated && `[${t("draft")}]`}
            </p>
            <CopyToClipboard valueToCopy={DOMPurify.sanitize(document.location.href)} overlayText={t("Payouts.copyPayoutLink")} />
          </div>
          {!isAuthenticated && (
            <>
              <Alert type="warning">{t("Payouts.signInToSeePayout")}</Alert>
              <Button onClick={tryAuthentication} className="mt-4">
                {t("signInWithEthereum")}
              </Button>
            </>
          )}
          {isAuthenticated && (
            <>
              <p className="mb-4">
                {t(payout?.payoutData.type === "single" ? "Payouts.fillPayoutInfo" : "Payouts.fillSplitPayoutInfo")}
              </p>

              <FormProvider {...methods}>
                <StyledPayoutForm>
                  {payout?.payoutData.type === "split" ? <SplitPayoutForm /> : <SinglePayoutForm />}

                  {isAnotherActivePayout && !isPayoutCreated && (
                    <Alert type="warning" className="mt-5">
                      {t("Payouts.anotherActivePayout")}
                    </Alert>
                  )}

                  {!isPayoutCreated && (
                    <div className="buttons">
                      <Button className="mr-5" styleType="outlined" filledColor="secondary" onClick={handleDeletePayout}>
                        <RemoveIcon className="mr-3" />
                        {t("Payouts.deletePayout")}
                      </Button>
                      <div className="sub-container">
                        <WithTooltip visible={savePayout.isSuccess} text={t("progressSaved")} placement="left">
                          <Button
                            disabled={!formState.isDirty || savePayout.isLoading}
                            styleType="outlined"
                            onClick={handleSavePayout}
                          >
                            {savePayout.isLoading ? `${t("loading")}...` : t("Payouts.savePayout")}
                          </Button>
                        </WithTooltip>
                        <Button
                          onClick={handleSubmit(handleLockPayout)}
                          disabled={lockPayout.isLoading || savePayout.isLoading || isAnotherActivePayout || loadingSubmissions}
                        >
                          {savePayout.isLoading || lockPayout.isLoading || loadingSubmissions
                            ? `${t("loading")}...`
                            : t("Payouts.createPayout")}
                          <ArrowForwardIcon className="ml-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </StyledPayoutForm>
              </FormProvider>
            </>
          )}
          {lockPayout.isLoading && <Loading fixed extraText={`${t("Payouts.creatingPayout")}...`} />}
        </StyledPayoutFormPage>
      </PayoutFormContext.Provider>
    </>
  );
};
