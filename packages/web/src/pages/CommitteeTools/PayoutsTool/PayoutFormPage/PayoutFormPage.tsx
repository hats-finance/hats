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
import { Alert, Button, CopyToClipboard, Loading, WithTooltip } from "components";
import { queryClient } from "config/reactQuery";
import DOMPurify from "dompurify";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/vaults/useVaults";
import moment from "moment";
import { RoutePaths } from "navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { PayoutsWelcome } from "../PayoutsListPage/PayoutsWelcome";
import { useLockPayout, usePayout, useSavePayout, useVaultInProgressPayouts } from "../payoutsService.hooks";
import { getPayoutDataYupSchema } from "./formSchema";
import { SinglePayoutForm } from "./forms/SinglePayoutForm";
import { SplitPayoutForm } from "./forms/SplitPayoutForm";
import { IPayoutFormContext, PayoutFormContext } from "./store";
import { StyledPayoutForm, StyledPayoutFormPage } from "./styles";

export const PayoutFormPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { allVaults } = useVaults();
  const { tryAuthentication, isAuthenticated } = useSiweAuth();

  const { payoutId } = useParams();
  const { data: payout, isLoading: isLoadingPayout } = usePayout(payoutId);
  const { data: vaultActivePayouts } = useVaultInProgressPayouts(payout?.vaultInfo);
  const savePayout = useSavePayout();
  const lockPayout = useLockPayout();

  const vault = useMemo(() => allVaults?.find((vault) => vault.id === payout?.vaultInfo.address), [allVaults, payout]);
  const isAnotherActivePayout = vaultActivePayouts && vaultActivePayouts?.length > 0;
  const isPayoutCreated = payout?.status !== PayoutStatus.Creating;

  const methods = useForm<IPayoutData>({
    resolver: yupResolver(getPayoutDataYupSchema(t)),
    mode: "onChange",
  });
  const { reset: handleReset, handleSubmit, formState } = methods;

  const [severitiesOptions, setSeveritiesOptions] = useState<{ label: string; value: string }[] | undefined>();

  useEffect(() => {
    tryAuthentication();
  }, [tryAuthentication]);

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
        label: `${severity.name} ${vault.version === "v1" ? t("severity") : ""}`,
        value: severity.name,
      }));

      // if the current severity is not in the list of severities, add it
      if (payout.payoutData.type === "single") {
        const payoutData = payout.payoutData;
        if (payoutData.severity && !severities.find((severity) => severity.value === payoutData.severity)) {
          severities.push({
            label: `${payoutData.severity} ${vault.version === "v1" ? t("severity") : ""}`,
            value: payoutData.severity,
          });
        }
      } else {
        for (const splitPayoutBeneficiary of payout.payoutData.beneficiaries) {
          if (
            splitPayoutBeneficiary.severity &&
            !severities.find((severity) => severity.value === splitPayoutBeneficiary.severity)
          ) {
            severities.push({
              label: `${splitPayoutBeneficiary.severity} ${vault.version === "v1" ? t("severity") : ""}`,
              value: splitPayoutBeneficiary.severity,
            });
          }
        }
      }

      setSeveritiesOptions(severities);
    }
  }, [allVaults, payout, vault, t]);

  const handleSavePayout = async () => {
    if (isPayoutCreated) return;
    if (!payoutId || !payout || !isAuthenticated || !formState.isDirty || !vault) return;

    try {
      const payoutData = methods.getValues();

      const payoutResponse = await savePayout.mutateAsync({
        payoutId,
        vaultInfo: getVaultInfoFromVault(vault),
        payoutData,
      });

      // Reset after 3 seconds for the user to see the success message
      setTimeout(() => savePayout.reset(), 3000);
      queryClient.setQueryData(["payout", payoutId], payoutResponse);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLockPayout = async () => {
    if (isPayoutCreated || !address || !isAuthenticated || !payoutId || isAnotherActivePayout) return;

    try {
      await handleSavePayout();
      const wasLocked = await lockPayout.mutateAsync({ payoutId });
      if (wasLocked) navigate(`${RoutePaths.payouts}/status/${payoutId}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (!address) return <PayoutsWelcome />;
  if (isLoadingPayout || allVaults?.length === 0) return <Loading extraText={`${t("Payouts.loadingPayoutData")}...`} />;

  const payoutFormContext: IPayoutFormContext = {
    payout,
    vault,
    isPayoutCreated,
    severitiesOptions,
  };

  return (
    <PayoutFormContext.Provider value={payoutFormContext}>
      <StyledPayoutFormPage className="content-wrapper-md">
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

          <CopyToClipboard valueToCopy={DOMPurify.sanitize(document.location.href)} overlayText={t("Payouts.copyPayoutLink")} />
        </div>

        <div className="section-title">
          {t(payout?.payoutData.type === "single" ? "Payouts.creatingSinglePayout" : "Payouts.creatingSplitPayout")}{" "}
          {!isPayoutCreated && `[${t("draft")}]`}
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

                {isAnotherActivePayout && (
                  <Alert type="warning" className="mt-5">
                    {t("Payouts.anotherActivePayout")}
                  </Alert>
                )}

                <div className="buttons">
                  <WithTooltip visible={savePayout.isSuccess} text={t("progressSaved")} placement="left">
                    <Button disabled={!formState.isDirty || savePayout.isLoading} styleType="outlined" onClick={handleSavePayout}>
                      {savePayout.isLoading ? `${t("loading")}...` : t("Payouts.savePayout")}
                    </Button>
                  </WithTooltip>
                  <Button
                    onClick={handleSubmit(handleLockPayout)}
                    disabled={lockPayout.isLoading || savePayout.isLoading || isAnotherActivePayout}
                  >
                    {savePayout.isLoading || lockPayout.isLoading ? `${t("loading")}...` : t("Payouts.createPayout")}{" "}
                    <ArrowForwardIcon className="ml-3" />
                  </Button>
                </div>
              </StyledPayoutForm>
            </FormProvider>
          </>
        )}

        {lockPayout.isLoading && <Loading fixed extraText={`${t("Payouts.creatingPayout")}...`} />}
      </StyledPayoutFormPage>
    </PayoutFormContext.Provider>
  );
};
