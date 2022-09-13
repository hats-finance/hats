import { formatUnits } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
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
const TIER_PERCENTAGES = [11, 101, 1501];

export default function EmbassyEligibility({ vault }: IProps) {
  const { t } = useTranslation();
  const { account } = useEthers();
  const { nftData } = useVaults();
  const availableToWithdraw = useUserSharesPerVault(vault.master.address, vault.pid, account!);
  const totalShares = Number(formatUnits(vault.honeyPotBalance, vault.stakingTokenDecimals));
  if (!nftData?.nftTokens || !availableToWithdraw || totalShares === 0) return null;

  const redeemedTiers = nftData?.proofTokens?.filter((token) => token.isRedeemed) ?? [];
  const maxRedeemedTier = redeemedTiers.length === 0 ? 0 : Math.max(...redeemedTiers.map((token) => token.tier));
  const shares = Number(formatUnits(availableToWithdraw, vault.stakingTokenDecimals));
  let nextTier = 0;
  for (let i = 0; i < TIER_PERCENTAGES.length; i++) {
    if (shares < Number((totalShares * TIER_PERCENTAGES[i] / HUNDRED_PERCENT).toFixed(1))) {
      break;
    }
    nextTier++;
  }

  if (maxRedeemedTier === 3) return null;
  if (maxRedeemedTier > nextTier) nextTier = maxRedeemedTier + 1;
  const minToNextTier = ((TIER_PERCENTAGES[nextTier] * (totalShares - shares)) / (HUNDRED_PERCENT - TIER_PERCENTAGES[nextTier])) - shares;
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
