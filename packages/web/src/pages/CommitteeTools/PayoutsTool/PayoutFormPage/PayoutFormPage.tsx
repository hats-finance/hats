import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { BigNumber } from "ethers";
import millify from "millify";
import { useAccount } from "wagmi";
import { Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  DefaultIndexArray,
  IPayoutData,
  IPayoutResponse,
  IVault,
  IVulnerabilitySeverityV1,
  IVulnerabilitySeverityV2,
  PayoutStatus,
} from "@hats-finance/shared";
import moment from "moment";
import { Alert, Button, CopyToClipboard, FormInput, FormSelectInput, Loading, WithTooltip } from "components";
import { getCustomIsDirty, useEnhancedForm } from "hooks/form";
import { useVaults } from "hooks/vaults/useVaults";
import { useOnChange } from "hooks/usePrevious";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { Amount } from "utils/amounts.utils";
import { RoutePaths } from "navigation";
import * as PayoutsService from "../payoutsService";
import { getPayoutDataYupSchema } from "./formSchema";
import { StyledPayoutFormPage, StyledPayoutForm } from "./styles";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowDownIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardOutlined";
import { PayoutsWelcome } from "../PayoutsListPage/PayoutsWelcome";
import { NftPreview } from "../components/NftPreview/NftPreview";

export const PayoutFormPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { allVaults, tokenPrices } = useVaults();

  const { address } = useAccount();
  const { tryAuthentication, isAuthenticated } = useSiweAuth();

  const { payoutId } = useParams();
  const [payout, setPayout] = useState<IPayoutResponse | undefined>();
  const vault = allVaults?.find((vault) => vault.id === payout?.vaultAddress);

  const methods = useEnhancedForm<IPayoutData>({
    resolver: yupResolver(getPayoutDataYupSchema(t)),
    mode: "onChange",
  });
  const { reset: handleReset, handleSubmit, register, control, formState, setValue } = methods;

  const isPayoutCreated = payout?.status !== PayoutStatus.Creating;
  const [lastModifedOn, setLastModifedOn] = useState<Date | undefined>();
  const [savingData, setSavingData] = useState(false);
  const [lockingPayout, setLockingPayout] = useState(false);
  const [loadingPayoutData, setLoadingPayoutData] = useState(false);
  const [showProgressSavedFlag, setShowProgressSavedFlag] = useState(false);
  const [isAnotherActivePayout, setIsAnotherActivePayout] = useState(false);
  const [severitiesOptions, setSeveritiesOptions] = useState<{ label: string; value: string }[] | undefined>();

  const vaultSeverities = vault?.description?.severities ?? [];
  const selectedSeverityName = useWatch({ control, name: "severity", defaultValue: undefined });
  const selectedSeverityIndex = vaultSeverities.findIndex((severity) => severity.name === selectedSeverityName);
  const selectedSeverityData = selectedSeverityIndex !== -1 ? vaultSeverities[selectedSeverityIndex] : undefined;

  const calculateAmountInTokensToPay = (percentageToPay: string, vault: IVault | undefined): string => {
    if (!vault || isNaN(+percentageToPay)) return "-";

    const tokenAddress = vault.stakingToken;
    const tokenSymbol = vault.stakingTokenSymbol;
    const tokenDecimals = vault.stakingTokenDecimals;
    const vaultBalance = new Amount(BigNumber.from(vault.honeyPotBalance), tokenDecimals, tokenSymbol).number;
    const amountInTokens = vaultBalance * (+percentageToPay / 100);

    const tokenPrice = tokenPrices?.[tokenAddress] ?? 0;

    return `≈ ${millify(amountInTokens)} ${tokenSymbol} ~ ${millify(amountInTokens * tokenPrice)}$`;
  };

  const percentageToPay = useWatch({ control, name: "percentageToPay" });
  const amountInTokensToPay = calculateAmountInTokensToPay(percentageToPay, vault);

  // Handler for getting payout data
  useEffect(() => {
    if (payoutId) {
      loadPayoutData();
    } else {
      navigate(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payoutId, navigate]);

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

  // Edit the payout percentage based on the selected severity
  useOnChange(selectedSeverityName, (newData, prevData) => {
    if (!selectedSeverityData) return;
    if (prevData === undefined || newData === undefined) return;

    if (vault?.version === "v2") {
      const maxBounty = vault.maxBounty ? +vault.maxBounty / 100 : 100;
      const percentage = (selectedSeverityData as IVulnerabilitySeverityV2).percentage * (maxBounty / 100);
      setValue("percentageToPay", percentage.toString());
    } else {
      const indexArray = vault?.description?.indexArray ?? DefaultIndexArray;
      setValue("percentageToPay", (+indexArray[(selectedSeverityData as IVulnerabilitySeverityV1).index] / 100).toString());
    }

    setValue("nftUrl", selectedSeverityData["nft-metadata"].image);
  });

  const loadPayoutData = async () => {
    if (!payoutId) return;

    try {
      setLoadingPayoutData(true);

      const signedIn = await tryAuthentication();
      if (!signedIn) return;

      const payoutResponse = await PayoutsService.getPayoutData(payoutId);

      if (!payoutResponse) {
        navigate(-1);
        return;
      }

      getActivePayoutsInfo(payoutResponse);
      setPayout(payoutResponse);
      setLastModifedOn(payoutResponse.updatedAt);
      handleReset(payoutResponse.payoutData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPayoutData(false);
    }
  };

  const getActivePayoutsInfo = async (payoutResponse: IPayoutResponse) => {
    const activePayoutsByVault = await PayoutsService.getActivePayoutsByVault(
      payoutResponse.chainId,
      payoutResponse.vaultAddress
    );

    if (activePayoutsByVault.length > 0) {
      setIsAnotherActivePayout(true);
    } else {
      setIsAnotherActivePayout(false);
    }
  };

  const handleSavePayout = async () => {
    if (!payoutId || !payout || !formState.isDirty) return;

    try {
      setSavingData(true);
      const payoutData = methods.getValues();

      const payoutResponse = await PayoutsService.savePayoutData(payoutId, payout.chainId, payout.vaultAddress, payoutData);
      if (!payoutResponse) return;

      setPayout(payoutResponse);
      setLastModifedOn(payoutResponse.updatedAt);
      handleReset(payoutResponse.payoutData, { keepErrors: true });

      setShowProgressSavedFlag(true);
      setTimeout(() => setShowProgressSavedFlag(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingData(false);
    }
  };

  const handleCreatePayout = async (payoutData: IPayoutData) => {
    if (isPayoutCreated || !address || !isAuthenticated || !payoutId || isAnotherActivePayout) return;

    setLockingPayout(true);
    const wasLocked = await PayoutsService.lockPayout(payoutId);
    setLockingPayout(false);

    if (wasLocked) navigate(`${RoutePaths.payouts}/status/${payoutId}`);
  };

  if (!address) return <PayoutsWelcome />;
  if (loadingPayoutData || allVaults?.length === 0) return <Loading extraText={`${t("Payouts.loadingPayoutData")}...`} />;

  return (
    <StyledPayoutFormPage className="content-wrapper-md">
      <div className="title-container">
        {lastModifedOn && (
          <p className="lastModifiedOn">
            <strong>{t("saved")}</strong> {moment(lastModifedOn).fromNow()}
          </p>
        )}

        <div className="title" onClick={() => navigate(`${RoutePaths.payouts}`)}>
          <BackIcon />
          <p>{t("payouts")}</p>
        </div>

        <CopyToClipboard valueToCopy={document.location.href} overlayText={t("Payouts.copyPayoutLink")} />
      </div>

      <div className="section-title">
        {t("Payouts.creatingSinglePayout")} {!isPayoutCreated && `[${t("draft")}]`}
      </div>

      {!isAuthenticated && (
        <>
          <Alert type="warning">{t("Payouts.signInToSeePayout")}</Alert>
          <Button onClick={loadPayoutData} className="mt-4">
            {t("signInWithEthereum")}
          </Button>
        </>
      )}

      {isAuthenticated && (
        <>
          <p className="mb-4">{t("Payouts.fillPayoutInfo")}</p>

          <StyledPayoutForm onSubmit={handleSubmit(handleCreatePayout)}>
            <div className="form-container">
              <FormInput
                {...register("beneficiary")}
                label={t("Payouts.beneficiary")}
                placeholder={t("Payouts.beneficiaryPlaceholder")}
                disabled={isPayoutCreated}
                pastable
                colorable
              />

              <div className="row">
                <FormInput
                  {...register("title")}
                  label={t("Payouts.payoutName")}
                  placeholder={t("Payouts.payoutNamePlaceholder")}
                  disabled={isPayoutCreated}
                  colorable
                />
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

              <div className="resultDivider">
                <div />
                <ArrowDownIcon />
                <div />
              </div>

              <div>{t("Payouts.resultDescription")}</div>
              <div className="result mt-4">
                <NftPreview
                  vault={vault}
                  severityName={selectedSeverityData?.name}
                  nftData={selectedSeverityData?.["nft-metadata"]}
                />
                <FormInput value={amountInTokensToPay} label={t("Payouts.payoutSum")} disabled />
              </div>
            </div>

            {isAnotherActivePayout && (
              <Alert type="warning" className="mt-5">
                {t("Payouts.anotherActivePayout")}
              </Alert>
            )}

            <div className="buttons">
              <WithTooltip visible={showProgressSavedFlag} text={t("progressSaved")} placement="left">
                <Button disabled={!formState.isDirty || savingData} styleType="outlined" onClick={handleSavePayout}>
                  {savingData ? `${t("loading")}...` : t("Payouts.savePayout")}
                </Button>
              </WithTooltip>
              <Button type="submit" disabled={lockingPayout || isAnotherActivePayout}>
                {lockingPayout ? `${t("loading")}...` : t("Payouts.createPayout")} <ArrowForwardIcon className="ml-3" />
              </Button>
            </div>
          </StyledPayoutForm>
        </>
      )}

      {lockingPayout && <Loading fixed extraText={`${t("Payouts.creatingPayout")}...`} />}
    </StyledPayoutFormPage>
  );
};
