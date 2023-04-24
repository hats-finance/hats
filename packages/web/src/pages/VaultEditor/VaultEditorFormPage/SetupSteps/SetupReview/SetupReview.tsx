import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useWatch } from "react-hook-form";
import {
  IEditedVaultDescription,
  IVault,
  IVaultDescriptionV1,
  IVaultDescriptionV2,
  editedFormToDescription,
} from "@hats-finance/shared";
import { Vault } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { VaultEditorFormContext } from "../../store";
import { StyledSetupReview } from "./styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export function SetupReview() {
  const { t } = useTranslation();
  const { control } = useEnhancedFormContext<IEditedVaultDescription>();

  const editedVaultDescriptionForm = useWatch({ control }) as IEditedVaultDescription;
  const { isEditingExitingVault } = useContext(VaultEditorFormContext);

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

  return (
    <StyledSetupReview>
      <div className="helper-text">
        {isEditingExitingVault ? t("vaultEditorFinishedEditionExplanation") : t("vaultEditorFinishedSetupExplanation")}
      </div>

      <p className="section-title">{t("nextSteps")}</p>
      {isEditingExitingVault ? (
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

      {isEditingExitingVault && (
        <div className="preview-vault">
          <table>
            <tbody>
              <Vault expanded={true} vault={getVault()} preview noActions />
            </tbody>
          </table>
        </div>
      )}
    </StyledSetupReview>
  );
}
