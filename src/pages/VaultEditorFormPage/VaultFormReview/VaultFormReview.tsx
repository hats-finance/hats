import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Vault } from "components";
import { IVault, IVaultDescriptionV1, IVaultDescriptionV2, IVaultV1 } from "types/types";
import { IEditedVaultDescription } from "../types";
import { editedFormToDescription } from "../utils";
import { StyledVaultFormReview } from "./styles";

export function VaultFormReview() {
  const { t } = useTranslation();
  const { watch } = useFormContext<IEditedVaultDescription>();
  const editedVaultDescriptionForm = watch();

  function getVault(editedDescription: IEditedVaultDescription): IVault {
    const description = editedFormToDescription(editedDescription);

    const bothVersionsVault = {
      id: "",
      descriptionHash: "",
      pid: "",
      stakingToken: "",
      stakingTokenDecimals: "18",
      stakingTokenSymbol: "",
      totalStaking: "",
      honeyPotBalance: "0",
      totalReward: "0",
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
        totalStaking: "",
        totalReward: "",
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
      totalRewardAmount: "0",
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

    if (editedDescription.version === "v1") {
      return {
        ...bothVersionsVault,
        version: editedDescription.version,
        description: description as IVaultDescriptionV1,
      };
    } else {
      return {
        ...bothVersionsVault,
        version: "v2",
        description: description as IVaultDescriptionV2,
        maxBounty: ""
      }

    }

  }

  return (
    <StyledVaultFormReview>
      <p className="description">
        {t("VaultEditor.review-vault.description-1")} <br /> {t("VaultEditor.review-vault.description-2")}
      </p>
      <p className="description">{t("VaultEditor.review-vault.description-3")}</p>

      <div>
        <label>{t("VaultEditor.preview-vault")}</label>
        <div className="preview-vault">
          <table>
            <tbody>
              <Vault expanded={true} data={getVault(editedVaultDescriptionForm)} preview />
            </tbody>
          </table>
        </div>
      </div>
    </StyledVaultFormReview>
  );
}
