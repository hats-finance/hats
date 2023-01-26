import { useTranslation } from "react-i18next";
import { useWatch } from "react-hook-form";
import { Vault } from "components";
import { IVault, IVaultDescriptionV1, IVaultDescriptionV2 } from "types";
import { IEditedVaultDescription } from "../../types";
import { editedFormToDescription } from "../../utils";
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
      stakingToken: "",
      stakingTokenDecimals: "18",
      stakingTokenSymbol: "",
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
      hackerVestedRewardSplit: "6000",
      hackerRewardSplit: "2000",
      committeeRewardSplit: "500",
      swapAndBurnSplit: "0",
      governanceHatRewardSplit: "1000",
      hackerHatRewardSplit: "500",
      vestingDuration: "3600",
      vestingPeriods: "3600",
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
