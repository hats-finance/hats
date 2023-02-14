import { useTranslation } from "react-i18next";
import { useWatch } from "react-hook-form";
import { Vault } from "components";
import { IVault, IVaultDescriptionV1, IVaultDescriptionV2 } from "types";
import { IEditedVaultDescription } from "types";
import { editedFormToDescription } from "@hats-finance/shared";
import { StyledVaultFormReview } from "./styles";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { useCallback } from "react";

export function VaultFormReview() {
  const { t } = useTranslation();
  const { control } = useEnhancedFormContext<IEditedVaultDescription>();

  const editedVaultDescriptionForm = useWatch({ control }) as IEditedVaultDescription;

  const getVault = useCallback((): IVault => {
    const description = editedFormToDescription(editedVaultDescriptionForm);

    const bothVersionsVault = {
      id: "",
      descriptionHash: "",
      pid: "",
      stakingToken: `${editedVaultDescriptionForm.assets[0]?.address ?? ""}`,
      stakingTokenDecimals: "18",
      stakingTokenSymbol: `${editedVaultDescriptionForm.assets[0]?.symbol ?? ""}`,
      honeyPotBalance: "0",
      totalRewardPaid: "0",
      committee: "",
      allocPoint: "0",
      master: {
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
        totalRewardPaid: "",
        rewardPerBlock: "",
        startBlock: "",
        vaults: [],
        totalAllocPoints: "",
        createdAt: "",
        rewardsToken: "",
        submittedClaim: [],
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
      hackerVestedRewardSplit: `${editedVaultDescriptionForm.parameters.vestedPercentage}00`,
      hackerRewardSplit: `${editedVaultDescriptionForm.parameters.immediatePercentage}00`,
      committeeRewardSplit: `${editedVaultDescriptionForm.parameters.committeePercentage}00`,
      swapAndBurnSplit: "0",
      governanceHatRewardSplit: `${editedVaultDescriptionForm.parameters.fixedHatsGovPercetange}00`,
      hackerHatRewardSplit: `${editedVaultDescriptionForm.parameters.fixedHatsRewardPercetange}00`,
      vestingDuration: "2592000",
      vestingPeriods: "30",
      depositPause: false,
      committeeCheckedIn: true,
      approvedClaims: [],
      stakers: [],
    };

    if (editedVaultDescriptionForm.version === "v1") {
      return {
        ...bothVersionsVault,
        version: editedVaultDescriptionForm.version,
        description: description as IVaultDescriptionV1,
      };
    } else {
      return {
        ...bothVersionsVault,
        version: "v2",
        description: description as IVaultDescriptionV2,
        maxBounty: "",
        rewardControllers: [],
      };
    }
  }, [editedVaultDescriptionForm]);

  if (editedVaultDescriptionForm.assets.length === 0) return null;

  return (
    <StyledVaultFormReview>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorVaultPreviewExplanation") }} />

      <div className="preview-vault">
        <table>
          <tbody>
            <Vault expanded={true} vault={getVault()} preview />
          </tbody>
        </table>
      </div>

      <p className="section-title mt-5">{t("pleaseNote")}</p>

      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorFinalStepExplanation") }} />
    </StyledVaultFormReview>
  );
}
