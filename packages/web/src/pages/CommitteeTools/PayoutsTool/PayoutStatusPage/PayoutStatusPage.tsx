import {
  HATSVaultV2_abi,
  PayoutStatus,
  getSafeHomeLink,
  getVaultInfoWithCommittee,
  isAddressAMultisigMember,
} from "@hats-finance/shared";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import RemoveIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Alert, Button, CopyToClipboard, FormInput, FormSelectInput, Loading, SafePeriodBar, VaultInfoCard } from "components";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { ExecutePayoutContract } from "contracts";
import DOMPurify from "dompurify";
import { ethers } from "ethers";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import useConfirm from "hooks/useConfirm";
import { useVaultSafeInfo } from "hooks/vaults/useVaultSafeInfo";
import { useVaults } from "hooks/vaults/useVaults";
import { RoutePaths } from "navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import { PayoutsWelcome } from "../PayoutsListPage/PayoutsWelcome";
import { PayoutCard, SignerCard, SinglePayoutAllocation, SplitPayoutAllocation } from "../components";
import { useAddSignature, useDeletePayout, useMarkPayoutAsExecuted, usePayout } from "../payoutsService.hooks";
import { usePayoutStatus } from "../utils/usePayoutStatus";
import { StyledPayoutStatusPage } from "./styles";
import { useSignPayout } from "./useSignPayout";

const DELETABLE_STATUS = [PayoutStatus.Creating, PayoutStatus.Pending, PayoutStatus.ReadyToExecute];
const SIGNABLE_STATUS = [PayoutStatus.Creating, PayoutStatus.Pending, PayoutStatus.ReadyToExecute];

export const PayoutStatusPage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { tryAuthentication, isAuthenticated } = useSiweAuth();

  const { allVaults, payouts, withdrawSafetyPeriod } = useVaults();

  const { payoutId } = useParams();
  const {
    data: payout,
    isLoading: isLoadingPayout,
    isRefetching: isRefetchingPayout,
    refetch: refetchPayout,
    error: payoutError,
  } = usePayout(payoutId);
  const payoutStatus = usePayoutStatus(payout);
  const vault = useMemo(() => allVaults?.find((vault) => vault.id === payout?.vaultInfo.address), [allVaults, payout]);
  const deletePayout = useDeletePayout();
  const addSignature = useAddSignature();
  const markPayoutAsExecuted = useMarkPayoutAsExecuted();
  const signPayout = useSignPayout(vault, payout);
  const executePayout = ExecutePayoutContract.hook(vault, payout);
  const waitingPayoutExecution = useWaitForTransaction({
    hash: executePayout.data?.hash as `0x${string}`,
    onSuccess: async (data) => {
      if (!payoutId) return;

      let payoutClaimId = "";

      if (vault?.version === "v2") {
        const vaultIface = new ethers.utils.Interface(HATSVaultV2_abi);
        data.logs.forEach((log) => {
          try {
            const parsedLog = vaultIface.parseLog(log);
            if (parsedLog.name === "SubmitClaim") payoutClaimId = parsedLog.args._claimId;
          } catch (error) {}
        });
      }

      await markPayoutAsExecuted.mutateAsync({ payoutId, txHash: data.transactionHash, claimId: payoutClaimId });
      refetchPayout();
    },
  });

  const { data: safeInfo, isLoading: isLoadingSafeInfo } = useVaultSafeInfo(vault);
  const userHasAlreadySigned = payout?.signatures.some((sig) => sig.signerAddress === address);
  const isReadyToExecute = payoutStatus === PayoutStatus.ReadyToExecute;
  const isCollectingSignatures = payoutStatus === PayoutStatus.Pending;
  const canBeDeleted = payoutStatus && DELETABLE_STATUS.includes(payoutStatus);
  const canBesigned = payoutStatus && SIGNABLE_STATUS.includes(payoutStatus);
  const isAnyActivePayout = payouts?.some((payout) => payout.vault.id === vault?.id && payout.isActive);
  const [isUserCommitteeMember, setIsUserCommitteeMember] = useState(false);

  const vaultSeverities = vault?.description?.severities ?? [];
  const selectedSeverityName = payout?.payoutData.type === "single" ? payout?.payoutData.severity : undefined;
  const selectedSeverityIndex = vaultSeverities.findIndex(
    (severity) => severity.name.toLowerCase() === selectedSeverityName?.toLowerCase()
  );
  const selectedSeverityData = selectedSeverityIndex !== -1 ? vaultSeverities[selectedSeverityIndex] : undefined;

  useEffect(() => {
    tryAuthentication();
  }, [tryAuthentication]);

  useEffect(() => {
    refetchPayout();
  }, [address, refetchPayout]);

  useEffect(() => {
    if (!chain || !vault) return;
    switchNetworkAndValidate(chain.id, vault.chainId as number);
  }, [chain, vault]);

  useEffect(() => {
    if (!vault) return;

    const checkCommitteeMember = async () => {
      if (address && chain && chain.id) {
        const vaultInfo = await getVaultInfoWithCommittee(vault.id, vault.chainId as number);
        if (!vaultInfo) return;

        const isCommitteeMember = await isAddressAMultisigMember(vaultInfo.committee, address, vaultInfo.chainId);
        setIsUserCommitteeMember(isCommitteeMember);
      }
    };
    checkCommitteeMember();
  }, [address, chain, vault]);

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
    if (!isUserCommitteeMember) return;
    if (userHasAlreadySigned || !payoutId || !payout || !vault) return;

    const signature = await signPayout.signTypedData();
    if (!signature) return;

    await addSignature.mutateAsync({ payoutId, signature });
    refetchPayout();
  };

  const handleExecutePayout = async () => {
    if (!withdrawSafetyPeriod?.isSafetyPeriod || !isReadyToExecute || !payout || isAnyActivePayout) return;
    await executePayout.send();
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
  if (isLoadingPayout || isLoadingSafeInfo) return <Loading extraText={`${t("Payouts.loadingPayoutData")}...`} />;

  return (
    <StyledPayoutStatusPage className="content-wrapper-md">
      <div className="mb-5">{vault && <VaultInfoCard vault={vault} />}</div>

      <div className="title-container">
        <div className="title" onClick={() => navigate(`${RoutePaths.payouts}`)}>
          <BackIcon />
          <p>{t("payouts")}</p>
        </div>
      </div>

      <div className="section-title">
        {t("Payouts.payoutStatus")}
        <CopyToClipboard valueToCopy={DOMPurify.sanitize(document.location.href)} overlayText={t("Payouts.copyPayoutLink")} />
      </div>

      {!isAuthenticated && (
        <>
          <Alert type="warning">{t("Payouts.signInToSeePayouts")}</Alert>
          <Button onClick={tryAuthentication} className="mt-4">
            {t("signInWithEthereum")}
          </Button>
        </>
      )}

      {payoutStatus === PayoutStatus.Creating && (
        <>
          <Alert type="warning">{t("Payouts.yourPayoutIsNotYetCreated")}</Alert>
          <Button onClick={() => navigate(`${RoutePaths.payouts}`)} className="mt-4">
            {t("Payouts.goToPayoutCreator")}
          </Button>
        </>
      )}

      {isAuthenticated && payoutStatus !== PayoutStatus.Creating && (
        <div className="status-content">
          <p className="status-description">{t(`Payouts.payoutStatusDescriptions.${payoutStatus}`)}</p>

          {userHasAlreadySigned && isCollectingSignatures && (
            <Alert type="info" className="mb-5" content={t("Payouts.youHaveAlredySignedWaitingForOthers")} />
          )}

          {payout && (
            <div className="pt-4">
              <PayoutCard viewOnly noVaultInfo payout={payout} />
            </div>
          )}

          <div className="payout-status-container">
            {payout?.payoutData.type === "single" && (
              <FormInput
                label={t("Payouts.beneficiary")}
                placeholder={t("Payouts.beneficiaryPlaceholder")}
                value={payout?.payoutData.beneficiary}
                readOnly
              />
            )}

            <div className="row">
              {payout?.payoutData.type === "single" && payout?.payoutData.severity && (
                <FormSelectInput
                  value={payout.payoutData.severity}
                  label={t("severity")}
                  placeholder={t("severityPlaceholder")}
                  options={[
                    {
                      label: payout.payoutData.severity,
                      value: payout.payoutData.severity,
                    },
                  ]}
                  readOnly
                />
              )}

              <FormInput
                value={`${payout?.payoutData.percentageToPay}%`}
                label={t("Payouts.percentageToPay")}
                placeholder={t("Payouts.percentageToPayPlaceholder")}
                helper={t("Payouts.percentageOfTheTotalVaultToPay")}
                readOnly
              />
            </div>

            <div className="my-5">
              {payout && payout.payoutData.type === "single" ? (
                <SinglePayoutAllocation
                  vault={vault}
                  payout={payout}
                  percentageToPay={payout?.payoutData.percentageToPay}
                  selectedSeverity={selectedSeverityData}
                />
              ) : (
                <SplitPayoutAllocation vault={vault} payout={payout} />
              )}
            </div>
          </div>

          <div className="payout-status-container">
            <p className="section-title mt-2">{t("Payouts.payoutReasoning")}</p>

            <FormInput
              value={
                payout?.payoutData.explanation +
                `${payout?.payoutData.additionalInfo ? `\n\n\n${payout?.payoutData.additionalInfo}` : ""}`
              }
              label={t("Payouts.explanation")}
              placeholder={t("Payouts.explanationPlaceholder")}
              type="textarea"
              rows={payout?.payoutData.type === "single" ? 10 : (payout?.payoutData.beneficiaries?.length ?? 1) * 4.5}
              readOnly
            />
          </div>

          <div className="payout-status-container top-separation">
            {vault && (
              <a
                className="mulsitig-address"
                href={getSafeHomeLink(vault.committee, vault.chainId as number)}
                {...defaultAnchorProps}
              >
                <strong>{t("multisigAddress")}</strong>: {vault?.committee}
              </a>
            )}
            <p className="section-title">{t("Payouts.signAndExecute")}</p>

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

            {isReadyToExecute && isAnyActivePayout ? (
              <Alert type="warning" content={t("Payouts.thisVaultHasAnActivePayout")} />
            ) : (
              <>
                {isReadyToExecute && !withdrawSafetyPeriod?.isSafetyPeriod && (
                  <Alert type="warning" content={t("Payouts.payoutReadyToExecuteButWaitingForSafetyPeriod")} />
                )}

                {isReadyToExecute && withdrawSafetyPeriod?.isSafetyPeriod && (
                  <Alert type="success" content={t("Payouts.safetyPeriodOnYouCanExecutePayout")} />
                )}
              </>
            )}

            {isReadyToExecute && (
              <div className="mt-3">
                <SafePeriodBar />
              </div>
            )}

            {executePayout.error && <Alert className="mt-5" type="error" content={executePayout.error} />}
            {!isUserCommitteeMember && (
              <Alert className="mt-5" type="warning" content={t("Payouts.youAreNotACommitteeMemberCantSign")} />
            )}

            <div className="buttons">
              {canBeDeleted && (
                <Button styleType="outlined" filledColor="secondary" onClick={handleDeletePayout}>
                  <RemoveIcon />
                </Button>
              )}

              {canBesigned && !userHasAlreadySigned && (
                <Button disabled={!isUserCommitteeMember} onClick={handleSignPayout}>
                  {t("Payouts.signPayout")}
                </Button>
              )}
              {isReadyToExecute && (
                <Button disabled={!withdrawSafetyPeriod?.isSafetyPeriod || isAnyActivePayout} onClick={handleExecutePayout}>
                  {t("Payouts.executePayout")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {deletePayout.isLoading && <Loading fixed extraText={`${t("Payouts.deletingPayout")}...`} />}
      {isRefetchingPayout && <Loading fixed extraText={`${t("Payouts.loadingPayoutData")}...`} />}
      {(addSignature.isLoading || signPayout.isLoading) && (
        <Loading fixed extraText={`${t("Payouts.signingPayoutTransaction")}...`} />
      )}
      {(executePayout.isLoading || waitingPayoutExecution.isLoading || markPayoutAsExecuted.isLoading) && (
        <Loading fixed extraText={`${t("Payouts.executingPayout")}`} />
      )}
    </StyledPayoutStatusPage>
  );
};
