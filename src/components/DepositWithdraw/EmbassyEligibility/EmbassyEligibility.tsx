import { formatUnits } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
import { MAX_NFT_TIER } from "constants/constants";
import { useUserSharesPerVault } from "hooks/contractHooks";
import { useVaults } from "hooks/useVaults";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { IVault } from "types/types";
import "./index.scss";

interface IProps {
  vault: IVault;
}

const HUNDRED_PERCENT = 10000;
const TIER_PERCENTAGES = [10, 100, 1500];

export default function EmbassyEligibility({ vault }: IProps) {
  const { t } = useTranslation();
  const { account } = useEthers();
  const { nftData } = useVaults();
  const availableToWithdraw = useUserSharesPerVault(vault.master.address, vault.pid, account!);
  const totalShares = Number(formatUnits(vault.honeyPotBalance, vault.stakingTokenDecimals));
  if (!nftData?.nftTokens || !availableToWithdraw || totalShares === 0) return null;

  const eligibleOrRedeemed = nftData?.proofTokens?.filter((token) => Number(token.pid) === Number(vault.pid)) ?? [];
  const maxRedeemedTier = eligibleOrRedeemed.length === 0 ? 0 : Math.max(...eligibleOrRedeemed.map((token) => token.tier));
  if (maxRedeemedTier === MAX_NFT_TIER) return null;
  const shares = Number(formatUnits(availableToWithdraw, vault.stakingTokenDecimals));
  const currentTiers = TIER_PERCENTAGES.map(tier_percentage => tier_percentage / HUNDRED_PERCENT)
    .map(tierPercentage => (totalShares * tierPercentage) / (1 - tierPercentage));
  console.log("currentTiers", currentTiers);

  const nextTier = Math.max(maxRedeemedTier + 1, currentTiers.findIndex(tier => tier > shares) + 1);
  console.log("nextTier", nextTier);

  const minToNextTier = currentTiers[nextTier - 1] - shares;
  console.log("minToNextTier", minToNextTier);
  let text = "";

  const minimum = typeof minToNextTier === "number" ? millify(minToNextTier, { precision: 2 }) : "-";
  if (nextTier === 1) {
    text += t("DepositWithdraw.EmbassyEligibility.tier-minimum", { minimum });
  } else if (nextTier === 2 || nextTier === 3) {
    text += t("DepositWithdraw.EmbassyEligibility.tier-middle", { secondOrThird: nextTier === 2 ? "second" : "third", minimum });
  }

  return (
    <div className="embassy-eligibility-wrapper">
      <div className="embassy-eligibility__title">{t("DepositWithdraw.EmbassyEligibility.title")}</div>
      <div className="embassy-eligibility__content">
        <span className="embassy-eligibility__content__min-to-embassy">
          {text}
        </span>
        {nextTier > 0 && nextTier < 4 && <span><br /><br />{t("DepositWithdraw.EmbassyEligibility.after-deposit")}</span>}
      </div>
    </div>
  )
}
