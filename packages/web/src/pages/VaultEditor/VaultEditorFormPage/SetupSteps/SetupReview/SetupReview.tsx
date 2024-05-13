import {
  IEditedVaultDescription,
  IVault,
  IVaultDescriptionV1,
  IVaultDescriptionV2,
  IVaultDescriptionV3,
  editedFormToDescription,
} from "@hats.finance/shared";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenIcon from "@mui/icons-material/ViewComfyOutlined";
import { Button, Modal } from "components";
import { useEnhancedFormContext } from "hooks/form";
import useModal from "hooks/useModal";
import { VaultDetailsPage } from "pages/Honeypots/VaultDetailsPage/VaultDetailsPage";
import { useCallback, useContext } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VaultEditorFormContext } from "../../store";
import { StyledPreviewModal, StyledSetupReview } from "./styles";

export function SetupReview() {
  const { t } = useTranslation();
  const { control } = useEnhancedFormContext<IEditedVaultDescription>();

  const { isShowing: isShowingPreview, show: showPreview, hide: hidePreview } = useModal();

  const editedVaultDescriptionForm = useWatch({ control }) as IEditedVaultDescription;
  const { isEditingExistingVault, existingVault } = useContext(VaultEditorFormContext);

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
        existingVault?.governanceHatRewardSplit ?? `${editedVaultDescriptionForm.parameters.fixedHatsGovPercetange ?? 0 * 100}`,
      hackerHatRewardSplit:
        existingVault?.hackerHatRewardSplit ?? `${editedVaultDescriptionForm.parameters.fixedHatsRewardPercetange ?? 0 * 100}`,
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
        claimsManager: null,
      };
    } else if (editedVaultDescriptionForm.version === "v2") {
      return {
        ...bothVersionsVault,
        version: "v2",
        description: description as IVaultDescriptionV2,
        maxBounty: existingVault?.maxBounty ?? `${editedVaultDescriptionForm.parameters.maxBountyPercentage * 100}`,
        rewardControllers: [],
        amountsInfo: existingVault?.amountsInfo,
        claimsManager: null,
      };
    } else {
      return {
        ...bothVersionsVault,
        version: "v3",
        description: description as IVaultDescriptionV3,
        maxBounty: existingVault?.maxBounty ?? `${editedVaultDescriptionForm.parameters.maxBountyPercentage * 100}`,
        rewardControllers: [],
        amountsInfo: existingVault?.amountsInfo,
        claimsManager: existingVault?.claimsManager ?? "",
      };
    }
  }, [editedVaultDescriptionForm, existingVault]);

  return (
    <StyledSetupReview>
      <div className="helper-text">
        {isEditingExistingVault ? t("vaultEditorFinishedEditionExplanation") : t("vaultEditorFinishedSetupExplanation")}
      </div>

      <p className="section-title">{t("nextSteps")}</p>
      {isEditingExistingVault ? (
        <>
          <div className="next-step">
            <div className="title">
              <ArrowForwardIcon className="mr-2" /> {t("sendToGovernanceApproval")}
            </div>
          </div>
          <div className="next-step">
            <div className="title">
              <ArrowForwardIcon className="mr-2" /> {t("waitForApproval")}
            </div>
          </div>
          <div className="next-step">
            <div className="title">
              <ArrowForwardIcon className="mr-2" /> {t("weWillNotifyYouWhenEditionIsApproved")}
            </div>
          </div>
        </>
      ) : (
        <div className="next-step">
          <div className="title">
            <ArrowForwardIcon className="mr-2" /> {t("deployVault")}
          </div>
          <div className="helper-text">{t("deployVaultHelper")}</div>
        </div>
      )}

      {isEditingExistingVault && (
        <>
          <Button styleType="outlined" className="mt-5" onClick={showPreview}>
            {t("showVaultPreview")} <OpenIcon className="ml-3" />
          </Button>
          <Modal isShowing={isShowingPreview} onHide={hidePreview}>
            <StyledPreviewModal>
              <VaultDetailsPage vaultToUse={getVault()} noActions />
            </StyledPreviewModal>
          </Modal>
        </>
      )}
      {/* 
      {isEditingExistingVault && (
        <div className="preview-vault">
          <table>
            <tbody>
              <Vault expanded={true} vault={getVault()} preview noActions />
            </tbody>
          </table>
        </div>
      )} */}
    </StyledSetupReview>
  );
}
