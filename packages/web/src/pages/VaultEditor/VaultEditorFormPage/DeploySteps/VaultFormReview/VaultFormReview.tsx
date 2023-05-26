import { editedFormToDescription } from "@hats-finance/shared";
import { Vault } from "components";
import { useEnhancedFormContext } from "hooks/form/useEnhancedFormContext";
import { useCallback } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IVault, IVaultDescriptionV1, IVaultDescriptionV2 } from "types";
import { IEditedVaultDescription } from "types";
import { VaultEmailsForm } from "../../SetupSteps/shared/VaultEmailsList/VaultEmailsList";
import { StyledVaultFormReview } from "./styles";

export function VaultFormReview() {
  const { t } = useTranslation();
  const { control } = useEnhancedFormContext<IEditedVaultDescription>();

  const editedVaultDescriptionForm = useWatch({ control }) as IEditedVaultDescription;
  const emails = useWatch({ control, name: "project-metadata.emails" });
  const missingVerificationEmails = emails?.filter((email) => email.status !== "verified");

  const getVault = useCallback((): IVault => {
    const description = editedFormToDescription(editedVaultDescriptionForm);

    const bothVersionsVault = {
      id: "",
      name: "",
      descriptionHash: "",
      pid: "",
      stakingToken: `${editedVaultDescriptionForm.assets[0]?.address ?? ""}`,
      stakingTokenDecimals: "18",
      stakingTokenSymbol: `${editedVaultDescriptionForm.assets[0]?.symbol ?? ""}`,
      honeyPotBalance: "0",
      totalRewardPaid: "0",
      committee: "",
      allocPoints: ["0"],
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
      hackerVestedRewardSplit: `${editedVaultDescriptionForm.parameters.vestedPercentage * 100}`,
      hackerRewardSplit: `${editedVaultDescriptionForm.parameters.immediatePercentage * 100}`,
      committeeRewardSplit: `${editedVaultDescriptionForm.parameters.committeePercentage * 100}`,
      swapAndBurnSplit: "0",
      governanceHatRewardSplit: `${editedVaultDescriptionForm.parameters.fixedHatsGovPercetange * 100}`,
      hackerHatRewardSplit: `${editedVaultDescriptionForm.parameters.fixedHatsRewardPercetange * 100}`,
      vestingDuration: "2592000",
      vestingPeriods: "30",
      depositPause: false,
      committeeCheckedIn: true,
      approvedClaims: [],
      stakers: [],
      onTime: true,
      chainId: editedVaultDescriptionForm.committee.chainId ? +editedVaultDescriptionForm.committee.chainId : 1,
    };

    if (editedVaultDescriptionForm.version === "v1") {
      return {
        ...bothVersionsVault,
        version: editedVaultDescriptionForm.version,
        description: description as IVaultDescriptionV1,
        maxBounty: null,
      };
    } else {
      return {
        ...bothVersionsVault,
        version: "v2",
        description: description as IVaultDescriptionV2,
        maxBounty: `${editedVaultDescriptionForm.parameters.maxBountyPercentage * 100}`,
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
