import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import DOMPurify from "dompurify";
import { Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  DefaultIndexArray,
  IPayoutData,
  IVulnerabilitySeverityV1,
  IVulnerabilitySeverityV2,
  PayoutStatus,
  getVaultInfoFromVault,
} from "@hats-finance/shared";
import moment from "moment";
import { Alert, Button, CopyToClipboard, FormInput, FormSelectInput, Loading, WithTooltip } from "components";
import { queryClient } from "config/reactQuery";
import { getCustomIsDirty, useEnhancedForm } from "hooks/form";
import { useVaults } from "hooks/vaults/useVaults";
import { useOnChange } from "hooks/usePrevious";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { RoutePaths } from "navigation";
import { getPayoutDataYupSchema } from "./formSchema";
import { NftPreview, PayoutAllocation } from "../components";
import { calculateAmountInTokensFromPercentage } from "../utils/calculateAmountInTokensFromPercentage";
import { useLockPayout, usePayout, useSavePayout, useVaultInProgressPayouts } from "../payoutsService.hooks";
import { PayoutsWelcome } from "../PayoutsListPage/PayoutsWelcome";
import { StyledPayoutFormPage, StyledPayoutForm } from "./styles";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowDownIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardOutlined";

export const PayoutFormPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { allVaults, tokenPrices } = useVaults();
  const { tryAuthentication, isAuthenticated } = useSiweAuth();

  const methods = useEnhancedForm<IPayoutData>({
    resolver: yupResolver(getPayoutDataYupSchema(t)),
    mode: "onChange",
  });
  const { reset: handleReset, handleSubmit, register, control, formState, setValue } = methods;

  const { payoutId } = useParams();
  const { data: payout, isLoading: isLoadingPayout } = usePayout(payoutId);
  const { data: vaultActivePayouts } = useVaultInProgressPayouts(payout?.vaultInfo);
  const savePayout = useSavePayout();
  const lockPayout = useLockPayout();

  const vault = useMemo(() => allVaults?.find((vault) => vault.id === payout?.vaultInfo.address), [allVaults, payout]);
  const isAnotherActivePayout = vaultActivePayouts && vaultActivePayouts?.length > 0;
  const isPayoutCreated = payout?.status !== PayoutStatus.Creating;

  const [severitiesOptions, setSeveritiesOptions] = useState<{ label: string; value: string }[] | undefined>();

  const vaultSeverities = vault?.description?.severities ?? [];
  const selectedSeverityName = useWatch({ control, name: "severity", defaultValue: undefined });
  const selectedSeverityIndex = vaultSeverities.findIndex((severity) => severity.name === selectedSeverityName);
  const selectedSeverityData = selectedSeverityIndex !== -1 ? vaultSeverities[selectedSeverityIndex] : undefined;

  const percentageToPay = useWatch({ control, name: "percentageToPay" });
  const amountInTokensToPay = calculateAmountInTokensFromPercentage(percentageToPay, vault, tokenPrices);

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
        label: severity.name,
        value: severity.name,
      }));

      // if the current severity is not in the list of severities, add it
      if (payout.payoutData.severity && !severities.find((severity) => severity.value === payout.payoutData.severity)) {
        severities.push({
          label: payout.payoutData.severity,
          value: payout.payoutData.severity,
        });
      }

      setSeveritiesOptions(severities);
    }
  }, [allVaults, payout, vault]);

  // Edit the payout percentage and NFT info based on the selected severity
  useOnChange(selectedSeverityName, (newSelected, prevSelected) => {
    if (!selectedSeverityData) return;
    if (prevSelected === undefined || newSelected === undefined) return;

    setValue("nftUrl", selectedSeverityData["nft-metadata"].image);
    if (vault?.version === "v2") {
      const maxBounty = vault.maxBounty ? +vault.maxBounty / 100 : 100;
      const percentage = (selectedSeverityData as IVulnerabilitySeverityV2).percentage * (maxBounty / 100);
      setValue("percentageToPay", percentage.toString());
    } else {
      const indexArray = vault?.description?.indexArray ?? DefaultIndexArray;
      setValue("percentageToPay", (+indexArray[(selectedSeverityData as IVulnerabilitySeverityV1).index] / 100).toString());
    }
  });

  const handleSavePayout = async () => {
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

  return (
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
        {t("Payouts.creatingSinglePayout")} {!isPayoutCreated && `[${t("draft")}]`}
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
          <p className="mb-4">{t("Payouts.fillPayoutInfo")}</p>

          <StyledPayoutForm onSubmit={handleSubmit(handleLockPayout)}>
            <div className="form-container">
              <FormInput
                {...register("title")}
                label={t("Payouts.payoutName")}
                placeholder={t("Payouts.payoutNamePlaceholder")}
                disabled={isPayoutCreated}
                colorable
                className="no-expanded-input"
              />

              <FormInput
                {...register("beneficiary")}
                label={t("Payouts.beneficiary")}
                placeholder={t("Payouts.beneficiaryPlaceholder")}
                disabled={isPayoutCreated}
                pastable
                colorable
              />

              <div className="row">
                <Controller
                  control={control}
                  name={`severity`}
                  render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
                    <FormSelectInput
                      disabled={isPayoutCreated}
                      isDirty={getCustomIsDirty<IPayoutData>(field.name, dirtyFields, defaultValues)}
                      error={error}
                      label={t("Payouts.severity")}
                      placeholder={t("Payouts.severityPlaceholder")}
                      colorable
                      options={severitiesOptions ?? []}
                      {...field}
                    />
                  )}
                />
                <FormInput
                  {...register("percentageToPay")}
                  label={t("Payouts.percentageToPay")}
                  placeholder={t("Payouts.percentageToPayPlaceholder")}
                  disabled
                  colorable
                  helper={t("Payouts.percentageOfTheTotalVaultToPay")}
                />
              </div>

              <div className="resultDivider">
                <div />
                <ArrowDownIcon />
                <div />
              </div>

              <div>{t("Payouts.resultDescription")}</div>
              <div className="result mt-4 mb-5">
                <NftPreview
                  vault={vault}
                  severityName={selectedSeverityData?.name}
                  nftData={selectedSeverityData?.["nft-metadata"]}
                />
                <FormInput value={amountInTokensToPay} label={t("Payouts.payoutSum")} disabled />
              </div>

              <PayoutAllocation />
            </div>

            <div className="form-container mt-5">
              <p className="mt-2 subtitle">{t("Payouts.reasoning")}</p>
              <p className="mt-2">{t("Payouts.reasoningDescription")}</p>
              <p className="mt-2 mb-5 reasoningAlert">
                <span>{t("pleaseNote")}:</span> {t("thisInformationWillAppearOnChain")}
              </p>

              <FormInput
                {...register("explanation")}
                label={t("Payouts.explanation")}
                placeholder={t("Payouts.explanationPlaceholder")}
                disabled={isPayoutCreated}
                type="textarea"
                rows={4}
                colorable
              />

              <p className="mt-2 mb-5">{t("Payouts.additionalDetails")}</p>

              <FormInput
                {...register("additionalInfo")}
                label={t("Payouts.additionalInfo")}
                placeholder={t("Payouts.additionalInfoPlaceholder")}
                disabled={isPayoutCreated}
                type="textarea"
                rows={8}
                colorable
              />
            </div>

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
              <Button type="submit" disabled={lockPayout.isLoading || savePayout.isLoading || isAnotherActivePayout}>
                {savePayout.isLoading || lockPayout.isLoading ? `${t("loading")}...` : t("Payouts.createPayout")}{" "}
                <ArrowForwardIcon className="ml-3" />
              </Button>
            </div>
          </StyledPayoutForm>
        </>
      )}

      {lockPayout.isLoading && <Loading fixed extraText={`${t("Payouts.creatingPayout")}...`} />}
    </StyledPayoutFormPage>
  );
};
