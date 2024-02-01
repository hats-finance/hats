import { editedFormToDescription } from "@hats.finance/shared";
import OpenIcon from "@mui/icons-material/ViewComfyOutlined";
import { Button, Modal } from "components";
import { useEnhancedFormContext } from "hooks/form/useEnhancedFormContext";
import useModal from "hooks/useModal";
import { VaultDetailsPage } from "pages/Honeypots/VaultDetailsPage/VaultDetailsPage";
import { useCallback, useContext } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IVault, IVaultDescriptionV1, IVaultDescriptionV2 } from "types";
import { IEditedVaultDescription } from "types";
import { VaultEmailsForm } from "../../SetupSteps/shared/VaultEmailsList/VaultEmailsList";
import { VaultEditorFormContext } from "../../store";
import { StyledPreviewModal, StyledVaultFormReview } from "./styles";

export function VaultFormReview() {
  const { t } = useTranslation();
  const { control } = useEnhancedFormContext<IEditedVaultDescription>();

  const { isShowing: isShowingPreview, show: showPreview, hide: hidePreview } = useModal();

  const editedVaultDescriptionForm = useWatch({ control }) as IEditedVaultDescription;
  const emails = useWatch({ control, name: "project-metadata.emails" });
  const missingVerificationEmails = emails?.filter((email) => email.status !== "verified");

  const { existingVault } = useContext(VaultEditorFormContext);

  const getVault = useCallback((): IVault => {
    const description = editedFormToDescription(editedVaultDescriptionForm);

    const bothVersionsVault = {
      id: existingVault?.id ?? "",
      name: existingVault?.name ?? "",
      descriptionHash: existingVault?.descriptionHash ?? "",
      pid: existingVault?.pid ?? "",
      stakingToken: existingVault?.stakingToken ?? `${editedVaultDescriptionForm.assets[0]?.address ?? ""}`,
      stakingTokenDecimals: "18",
      stakingTokenSymbol: existingVault?.stakingTokenSymbol ?? `${editedVaultDescriptionForm.assets[0]?.symbol ?? ""}`,
      honeyPotBalance: existingVault?.honeyPotBalance ?? "0",
      totalRewardPaid: existingVault?.totalRewardPaid ?? "0",
      committee: "",
      allocPoints: ["0"],
      master: existingVault?.master ?? {
        address: "",
        numberOfSubmittedClaims: "",
        withdrawPeriod: "",
        safetyPeriod: "",
        withdrawRequestEnablePeriod: "",
        withdrawRequestPendingPeriod: "",
        vestingHatDuration: "",
        vestingHatPeriods: "",
        id: "",
        governance: "",
        timelock: "",
        totalRewardPaid: "",
        rewardPerBlock: "",
        startBlock: "",
        vaults: [],
        totalAllocPoints: "",
        createdAt: "",
        // rewardsToken: "",
        submittedClaim: [],
        defaultHackerHatRewardSplit: "",
        defaultGovernanceHatRewardSplit: "",
      },
      numberOfApprovedClaims: "0",
      rewardsLevels: [
        "100",
        "125",
        "156",
        "195",
        "243",
        "303",
        "378",
        "500",
        "590",
        "737",
        "921",
        "1151",
        "1438",
        "1797",
        "2000",
        "2500",
        "3125",
        "4000",
        "5000",
        "6000",
        "8000",
      ],
      liquidityPool: false,
      registered: true,
      withdrawRequests: [],
      totalUsersShares: "",
      hackerVestedRewardSplit:
        existingVault?.hackerVestedRewardSplit ?? `${editedVaultDescriptionForm.parameters.vestedPercentage * 100}`,
      hackerRewardSplit: existingVault?.hackerRewardSplit ?? `${editedVaultDescriptionForm.parameters.immediatePercentage * 100}`,
      committeeRewardSplit:
        existingVault?.committeeRewardSplit ?? `${editedVaultDescriptionForm.parameters.committeePercentage * 100}`,
      swapAndBurnSplit: "0",
      governanceHatRewardSplit:
        existingVault?.governanceHatRewardSplit ?? `${editedVaultDescriptionForm.parameters.fixedHatsGovPercetange * 100}`,
      hackerHatRewardSplit:
        existingVault?.hackerHatRewardSplit ?? `${editedVaultDescriptionForm.parameters.fixedHatsRewardPercetange * 100}`,
      vestingDuration: "2592000",
      vestingPeriods: "30",
      depositPause: false,
      committeeCheckedIn: true,
      approvedClaims: [],
      stakers: [],
      dateStatus: "on_time" as const,
      chainId: editedVaultDescriptionForm.committee.chainId ? +editedVaultDescriptionForm.committee.chainId : 1,
    };

    if (editedVaultDescriptionForm.version === "v1") {
      return {
        ...bothVersionsVault,
        version: editedVaultDescriptionForm.version,
        description: description as IVaultDescriptionV1,
        maxBounty: null,
        amountsInfo: existingVault?.amountsInfo,
      };
    } else {
      return {
        ...bothVersionsVault,
        version: "v2",
        description: description as IVaultDescriptionV2,
        maxBounty: existingVault?.maxBounty ?? `${editedVaultDescriptionForm.parameters.maxBountyPercentage * 100}`,
        rewardControllers: [],
        amountsInfo: existingVault?.amountsInfo,
      };
    }
  }, [editedVaultDescriptionForm, existingVault]);

  if (editedVaultDescriptionForm.assets.length === 0) return null;

  return (
    <StyledVaultFormReview>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorVaultPreviewExplanation") }} />

      <>
        <Button styleType="outlined" className="mt-5" onClick={showPreview}>
          {t("showVaultPreview")} <OpenIcon className="ml-3" />
        </Button>
        <Modal isShowing={isShowingPreview} onHide={hidePreview}>
          <StyledPreviewModal>
            <VaultDetailsPage vaultToUse={getVault()} noActions noDeployed />
          </StyledPreviewModal>
        </Modal>
      </>

      <p className="section-title mt-5">{t("pleaseNote")}</p>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorFinalStepExplanation") }} />

      {missingVerificationEmails?.length > 0 && (
        <>
          <p className="section-title mt-5">{t("communication")}</p>
          <div className="helper-text">{t("emailsNotVerifiedExplanation")}</div>
          <VaultEmailsForm onlyNotVerifiedEmails />
        </>
      )}
    </StyledVaultFormReview>
  );
}
