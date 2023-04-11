import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IVulnerabilitySeverityV1, IVulnerabilitySeverityV2 } from "@hats-finance/shared";
import DOMPurify from "dompurify";
import { CopyToClipboard, Button, Loading, FormInput, FormSelectInput } from "components";
import useConfirm from "hooks/useConfirm";
import { useVaults } from "hooks/vaults/useVaults";
import { RoutePaths } from "navigation";
import { calculateAmountInTokensFromPercentage } from "../utils/calculateAmountInTokensFromPercentage";
import { useDeletePayout, usePayout } from "../payoutsService.hooks";
import { PayoutCard } from "../components";
import { StyledPayoutStatusPage } from "./styles";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import RemoveIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardOutlined";
import { NftPreview } from "../components/NftPreview/NftPreview";

export const PayoutStatusPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { allVaults, tokenPrices } = useVaults();

  const { payoutId } = useParams();
  const { data: payout, isLoading: isLoadingPayout } = usePayout(payoutId);

  const vault = allVaults?.find((vault) => vault.id === payout?.vaultAddress);
  const amountInTokensToPay = calculateAmountInTokensFromPercentage(payout?.payoutData.percentageToPay, vault, tokenPrices);

  const [severitiesOptions, setSeveritiesOptions] = useState<{ label: string; value: string }[] | undefined>();
  const vaultSeverities = vault?.description?.severities ?? [];
  const selectedSeverityName = payout?.payoutData.severity;
  const selectedSeverityIndex = vaultSeverities.findIndex((severity) => severity.name === selectedSeverityName);
  const selectedSeverityData = selectedSeverityIndex !== -1 ? vaultSeverities[selectedSeverityIndex] : undefined;

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

  const deletePayout = useDeletePayout();

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

  if (isLoadingPayout) return <Loading extraText={`${t("Payouts.loadingPayoutData")}...`} />;

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

      <p className="status-description">{t(`Payouts.payoutStatusDescriptions.${payout?.status}`)}</p>

      {payout && <PayoutCard viewOnly payout={payout} />}
      <div className="payout-details">
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

        <div className="buttons">
          <Button styleType="outlined" onClick={handleDeletePayout}>
            <RemoveIcon className="mr-2" />
            {t("Payouts.deletePayout")}
          </Button>

          <Button>{t("Payouts.signPayout")}</Button>
        </div>
      </div>

      {deletePayout.isLoading && <Loading fixed extraText={`${t("Payouts.deletingPayout")}...`} />}
    </StyledPayoutStatusPage>
  );
};
