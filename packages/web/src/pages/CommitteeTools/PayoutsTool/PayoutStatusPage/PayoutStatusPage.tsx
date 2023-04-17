import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useSignMessage, useWaitForTransaction } from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IVulnerabilitySeverityV1, IVulnerabilitySeverityV2, PayoutStatus } from "@hats-finance/shared";
import DOMPurify from "dompurify";
import { CopyToClipboard, Button, Loading, FormInput, FormSelectInput, Alert, SafePeriodBar } from "components";
import { ExecutePayoutContract } from "contracts";
import useConfirm from "hooks/useConfirm";
import { useVaultSafeInfo } from "hooks/vaults/useVaultSafeInfo";
import { useVaults } from "hooks/vaults/useVaults";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { RoutePaths } from "navigation";
import { calculateAmountInTokensFromPercentage } from "../utils/calculateAmountInTokensFromPercentage";
import { useAddSignature, useDeletePayout, useMarkPayoutAsExecuted, usePayout } from "../payoutsService.hooks";
import { PayoutCard, NftPreview, SignerCard } from "../components";
import { PayoutsWelcome } from "../PayoutsListPage/PayoutsWelcome";
import { StyledPayoutStatusPage } from "./styles";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import RemoveIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardOutlined";

export const PayoutStatusPage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { tryAuthentication, isAuthenticated } = useSiweAuth();

  const { allVaults, tokenPrices, withdrawSafetyPeriod } = useVaults();

  const { payoutId } = useParams();
  const {
    data: payout,
    isLoading: isLoadingPayout,
    isRefetching: isRefetchingPayout,
    refetch: refetchPayout,
  } = usePayout(payoutId);
  const vault = useMemo(() => allVaults?.find((vault) => vault.id === payout?.vaultInfo.address), [allVaults, payout]);
  const deletePayout = useDeletePayout();
  const addSignature = useAddSignature();
  const markPayoutAsExecuted = useMarkPayoutAsExecuted();
  const signTransaction = useSignMessage();
  const executePayout = ExecutePayoutContract.hook(vault, payout);
  const waitingPayoutExecution = useWaitForTransaction({
    hash: executePayout.data?.hash as `0x${string}`,
    onSuccess: async (data) => {
      if (!payoutId) return;

      await markPayoutAsExecuted.mutateAsync({ payoutId, txHash: data.transactionHash });
      refetchPayout();
    },
  });

  // console.log(`executePayout -> `, executePayout);
  // console.log(`Payout -> `, payout);

  console.log(executePayout);

  const { data: safeInfo, isLoading: isLoadingSafeInfo } = useVaultSafeInfo(vault);
  const userHasAlreadySigned = payout?.signatures.some((sig) => sig.signerAddress === address);
  const isReadyToExecute = payout?.status === PayoutStatus.ReadyToExecute;
  const isCollectingSignatures = payout?.status === PayoutStatus.Pending;
  const canBeDeleted = payout && [PayoutStatus.Creating, PayoutStatus.Pending].includes(payout.status);

  const amountInTokensToPay = calculateAmountInTokensFromPercentage(payout?.payoutData.percentageToPay, vault, tokenPrices);

  const [severitiesOptions, setSeveritiesOptions] = useState<{ label: string; value: string }[] | undefined>();
  const vaultSeverities = vault?.description?.severities ?? [];
  const selectedSeverityName = payout?.payoutData.severity;
  const selectedSeverityIndex = vaultSeverities.findIndex((severity) => severity.name === selectedSeverityName);
  const selectedSeverityData = selectedSeverityIndex !== -1 ? vaultSeverities[selectedSeverityIndex] : undefined;

  useEffect(() => {
    tryAuthentication();
  }, [tryAuthentication]);

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

  const handleDeletePayout = async () => {
    if (!payoutId || !payout) return;

    const wantsToDelete = await confirm({
      title: t("Payouts.deletePayout"),
      titleIcon: <RemoveIcon className="mr-2" fontSize="large" />,
      description: t("Payouts.deletePayoutDescription"),
      cancelText: t("no"),
      confirmText: t("delete"),
      confirmTextInput: {
        label: t("Payouts.payoutName"),
        placeholder: t("Payouts.payoutNamePlaceholder"),
        textToConfirm: payout.payoutData.title,
      },
    });

    if (!wantsToDelete) return;

    const wasDeleted = await deletePayout.mutateAsync({ payoutId });
    if (wasDeleted) navigate(`${RoutePaths.payouts}`);
  };

  const handleSignPayout = async () => {
    if (userHasAlreadySigned || !payoutId || !payout) return;

    const signature = await signTransaction.signMessageAsync({ message: ethers.utils.arrayify(payout.txToSign) });
    if (!signature) return;

    await addSignature.mutateAsync({ payoutId, signature });
    refetchPayout();
  };

  const handleExecutePayout = async () => {
    if (!withdrawSafetyPeriod?.isSafetyPeriod || !isReadyToExecute || !payout) return;

    await executePayout.send(payout.payoutData.beneficiary, payout.payoutData.percentageToPay, payout.payoutDescriptionHash);
  };

  if (!address) return <PayoutsWelcome />;
  if (isLoadingPayout || isLoadingSafeInfo) return <Loading extraText={`${t("Payouts.loadingPayoutData")}...`} />;

  return (
    <StyledPayoutStatusPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title" onClick={() => navigate(`${RoutePaths.payouts}`)}>
          <BackIcon />
          <p>{t("payouts")}</p>
        </div>

        <CopyToClipboard valueToCopy={DOMPurify.sanitize(document.location.href)} overlayText={t("Payouts.copyPayoutLink")} />
      </div>

      <div className="section-title">{t("Payouts.payoutStatus")}</div>

      {!isAuthenticated && (
        <>
          <Alert type="warning">{t("Payouts.signInToSeePayouts")}</Alert>
          <Button onClick={tryAuthentication} className="mt-4">
            {t("signInWithEthereum")}
          </Button>
        </>
      )}

      {payout?.status === PayoutStatus.Creating && (
        <>
          <Alert type="warning">{t("Payouts.yourPayoutIsNotYetCreated")}</Alert>
          <Button onClick={() => navigate(`${RoutePaths.payouts}`)} className="mt-4">
            {t("Payouts.goToPayoutCreator")}
          </Button>
        </>
      )}

      {isAuthenticated && payout?.status !== PayoutStatus.Creating && (
        <div className="status-content">
          <p className="status-description">{t(`Payouts.payoutStatusDescriptions.${payout?.status}`)}</p>

          {userHasAlreadySigned && isCollectingSignatures && (
            <Alert type="info" className="mb-5" content={t("Payouts.youHaveAlredySignedWaitingForOthers")} />
          )}

          {!userHasAlreadySigned && isCollectingSignatures && (
            <Alert type="warning" className="mb-5" content={t("Payouts.pleaseSignTheTransaction")} />
          )}

          {payout && (
            <div className="pt-4">
              <PayoutCard viewOnly showVaultAddress payout={payout} />
            </div>
          )}

          <div className="payout-status">
            <div className="form">
              <FormInput
                label={t("Payouts.beneficiary")}
                placeholder={t("Payouts.beneficiaryPlaceholder")}
                value={payout?.payoutData.beneficiary}
                readOnly
              />

              <div className="row">
                {payout?.payoutData.severity && (
                  <FormSelectInput
                    value={payout.payoutData.severity}
                    label={t("Payouts.severity")}
                    placeholder={t("Payouts.severityPlaceholder")}
                    options={severitiesOptions ?? []}
                    readOnly
                  />
                )}

                <FormInput
                  value={payout?.payoutData.percentageToPay}
                  label={t("Payouts.percentageToPay")}
                  placeholder={t("Payouts.percentageToPayPlaceholder")}
                  readOnly
                />

                <ArrowForwardIcon className="mt-4" />

                <FormInput value={amountInTokensToPay} label={t("Payouts.payoutSum")} readOnly />
              </div>

              <FormInput
                value={payout?.payoutData.explanation + "\n\n\n" + payout?.payoutData.additionalInfo}
                label={t("Payouts.explanation")}
                placeholder={t("Payouts.explanationPlaceholder")}
                type="textarea"
                rows={10}
                readOnly
              />

              <NftPreview
                size="small"
                vault={vault}
                severityName={selectedSeverityData?.name}
                nftData={selectedSeverityData?.["nft-metadata"]}
              />
            </div>

            <div className="signers">
              <p className="section-title">{t("Payouts.signers")}</p>

              <div className="signers-list">
                {vault &&
                  safeInfo?.owners.map((signerAddress) => (
                    <SignerCard
                      key={signerAddress}
                      signerAddress={signerAddress}
                      chainId={vault.chainId as number}
                      signed={payout?.signatures.some((sig) => sig.signerAddress === signerAddress) ?? false}
                    />
                  ))}
              </div>
            </div>

            {isReadyToExecute && !withdrawSafetyPeriod?.isSafetyPeriod && (
              <Alert type="warning" content={t("Payouts.payoutReadyToExecuteButWaitingForSafetyPeriod")} />
            )}

            {isReadyToExecute && withdrawSafetyPeriod?.isSafetyPeriod && (
              <Alert type="success" content={t("Payouts.safetyPeriodOnYouCanExecutePayout")} />
            )}

            {isReadyToExecute && (
              <div className="mt-3">
                <SafePeriodBar />
              </div>
            )}

            {executePayout.error && <Alert className="mt-5" type="error" content={executePayout.error} />}

            <div className="buttons">
              {canBeDeleted && (
                <Button styleType="outlined" onClick={handleDeletePayout}>
                  <RemoveIcon />
                </Button>
              )}

              {!userHasAlreadySigned && <Button onClick={handleSignPayout}>{t("Payouts.signPayout")}</Button>}
              {isReadyToExecute && (
                <Button disabled={!withdrawSafetyPeriod?.isSafetyPeriod} onClick={handleExecutePayout}>
                  {t("Payouts.executePayout")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {deletePayout.isLoading && <Loading fixed extraText={`${t("Payouts.deletingPayout")}...`} />}
      {isRefetchingPayout && <Loading fixed extraText={`${t("Payouts.loadingPayoutData")}...`} />}
      {(addSignature.isLoading || signTransaction.isLoading) && (
        <Loading fixed extraText={`${t("Payouts.signingPayoutTransaction")}...`} />
      )}
      {(executePayout.isLoading || waitingPayoutExecution.isLoading || markPayoutAsExecuted.isLoading) && (
        <Loading fixed extraText={`${t("Payouts.executingPayout")}`} />
      )}
    </StyledPayoutStatusPage>
  );
};
