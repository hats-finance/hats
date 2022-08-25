import { formatUnits } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
import { useUserSharesPerVault } from "hooks/contractHooks";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { IVault } from "types/types";
import "./index.scss";

interface IProps {
  vault: IVault;
}

const HUNDRED_PERCENT = 10000;
const TIER_PERCENTAGES = [10, 100, 1500];
const MIN_TO_EMBASSY_PERCENTAGES = [0.101, 1, 15];

export default function EmbassyEligibility({ vault }: IProps) {
  const { t } = useTranslation();
  const { account } = useEthers();
  const availableToWithdraw = useUserSharesPerVault(vault.master.address, vault.pid, account!);
  const totalShares = Number(formatUnits(vault.honeyPotBalance, vault.stakingTokenDecimals));

  if (!availableToWithdraw || totalShares === 0) return null;

  const shares = Number(formatUnits(availableToWithdraw, vault.stakingTokenDecimals));

  let currentTier = 0;
  for (let i = 0; i < TIER_PERCENTAGES.length; i++) {
    if (shares < totalShares * TIER_PERCENTAGES[i] / HUNDRED_PERCENT) {
      break;
    }
    currentTier++;
  }

  const minToNextTier = (totalShares - shares) * MIN_TO_EMBASSY_PERCENTAGES[currentTier];
  //const isEligible = shares >= minToNextTier;
  // if (nftData?.nftTokens?.filter(nft => nft.pid === Number(vault.pid) && nft.isDeposit && nft.isRedeemed).some(nft => nft.tier === Tier.Third)) {
  //   return null;
  // }

  return (
    <div className="embassy-eligibility-wrapper">
      <div className="embassy-eligibility__title">{t("DepositWithdraw.EmbassyEligibility.title")}</div>
      <div className="embassy-eligibility__content">
        {/* <div>Current trust level: {currentTier}</div>
        <div>Min to next trust level: {millify(minToNextTier)}</div> */}
        {currentTier === 0 ? (
          <span className="embassy-eligibility__content__min-to-embassy">
            {`${t("DepositWithdraw.EmbassyEligibility.text-1")}
            ${millify(minToNextTier)}
            ${t("DepositWithdraw.EmbassyEligibility.text-2")}`} <br /><br />
          </span>
        ) : (
          <span className="embassy-eligibility__content__min-to-embassy">
            {`${t("DepositWithdraw.EmbassyEligibility.text-3")}
            ${millify(minToNextTier)}
            ${t("DepositWithdraw.EmbassyEligibility.text-2")}`} <br /><br />
          </span>
        )}
        <span>{t("DepositWithdraw.EmbassyEligibility.text-4")}</span>
      </div>
    </div>
  )
}
