import { formatUnits } from "@ethersproject/units";
import { MAX_NFT_TIER } from "constants/constants";
import { BigNumber } from "ethers";
import { useTotalSharesPerVault, useUserSharesPerVault } from "hooks/contractHooksCalls";
import { useVaults } from "hooks/vaults/useVaults";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { IVault } from "types/types";
import "./index.scss";

interface IProps {
  vault: IVault;
}

const HUNDRED_PERCENT = 10000;
const TIER_PERCENTAGES = [10, 100, 1500];

export function EmbassyEligibility({ vault }: IProps) {
  const { t } = useTranslation();
  const { nftData } = useVaults();
  const userShares = useUserSharesPerVault(vault);
  const userSharesNumber = +formatUnits(userShares, vault.stakingTokenDecimals);
  const totalShares = useTotalSharesPerVault(vault);
  const totalSharesNumber = +formatUnits(totalShares, vault.stakingTokenDecimals);

  if (!nftData?.nftTokens || totalShares.eq(0)) return null;

  const eligibleOrRedeemed = nftData?.nftTokens?.filter((token) => +token.pid === +vault.pid) ?? [];
  const maxRedeemedTier = eligibleOrRedeemed.length === 0 ? 0 : Math.max(...eligibleOrRedeemed.map((token) => token.tier));

  if (maxRedeemedTier === MAX_NFT_TIER) return null;

  const sharesPercentageTiers = TIER_PERCENTAGES.map((tp) => tp / HUNDRED_PERCENT).map(
    (tp) => (totalSharesNumber * tp) / (1 - tp)
  );
  const nextTier = Math.max(maxRedeemedTier + 1, sharesPercentageTiers.findIndex((tier) => userSharesNumber < tier) + 1);
  const minToNextTier = sharesPercentageTiers[nextTier - 1] - userSharesNumber;
  const minimum = millify(minToNextTier, { precision: 4 });
  const tokenSymbol = vault.stakingTokenSymbol;

  // console.log("----------");
  // console.log("totalSharesNumber", totalSharesNumber);
  // console.log("sharesPercentageTiers", sharesPercentageTiers);
  // console.log("nextTier", nextTier);
  // console.log("minToNextTier", minToNextTier);

  return (
    <div className="embassy-eligibility-wrapper">
      <div className="embassy-eligibility__title">{t("DepositWithdraw.EmbassyEligibility.title")}</div>
      <div className="embassy-eligibility__content">
        <span className="embassy-eligibility__content__min-to-embassy">
          {minToNextTier > 0 && (
            <>
              {nextTier === 1 && (
                <>
                  {t("DepositWithdraw.EmbassyEligibility.tier-minimum", { minimum, token: tokenSymbol })}
                  <br />
                  <br />
                </>
              )}
              {(nextTier === 2 || nextTier === 3) && (
                <>
                  {t("DepositWithdraw.EmbassyEligibility.tier-middle", {
                    secondOrThird: nextTier === 2 ? "second" : "third",
                    minimum,
                    token: tokenSymbol,
                  })}
                  <br />
                  <br />
                </>
              )}
            </>
          )}
        </span>
        {nextTier > 0 && nextTier < 4 && <span>{t("DepositWithdraw.EmbassyEligibility.after-deposit")}</span>}
      </div>
    </div>
  );
}
