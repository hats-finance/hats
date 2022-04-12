import { useTranslation } from "react-i18next";
import { IVault, IVaultDescription } from "types/types";
import PreviewVault from "../Vault/Vault";

export default function VaultReview({ vaultDescription }) {
  const { t } = useTranslation();

  function getVault(description: IVaultDescription): IVault {
    return {
      id: "",
      name: "",
      description: description,
      descriptionHash: "",
      bounty: "",
      isGuest: false,
      parentVault: {
        id: "",
        pid: "",
        stakingToken: "",
        stakingTokenDecimals: "18",
        stakingTokenSymbol: "",
        totalStaking: "",
        honeyPotBalance: "",
        totalReward: "0",
        totalRewardPaid: "0",
        committee: [""],
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
          parentVaults: [],
          totalAllocPoints: "",
          createdAt: "",
          rewardsToken: "",
          submittedClaim: []
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
          "8000"
        ],
        totalRewardAmount: "0",
        liquidityPool: false,
        registered: true,
        withdrawRequests: [],
        totalUsersShares: "",
        descriptionHash: "",
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
        guests: [],
        apy: 0,
        tokenPrice: 0
      }
    };
  }

  return (
    <>
      <p className="vault-editor__section-description">
        {t("VaultEditor.review-vault.description-1")}
        <br></br>
        {t("VaultEditor.review-vault.description-2")}
      </p>
      <p className="vault-editor__section-description">
        {t("VaultEditor.review-vault.description-3")}
      </p>
      <label>{t("VaultEditor.preview-vault")}</label>
      <div className="preview-vault honeypots-wrapper">
        <table>
          <tbody>
            <PreviewVault data={getVault(vaultDescription)} preview />
          </tbody>
        </table>
      </div>
    </>
  );
}
