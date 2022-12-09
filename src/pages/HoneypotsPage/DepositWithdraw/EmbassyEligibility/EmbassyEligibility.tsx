import { formatUnits } from "@ethersproject/units";
import { Button, Modal } from "components";
import EmbassyNftTicketPrompt from "components/EmbassyNftTicketPrompt/EmbassyNftTicketPrompt";
import { MAX_NFT_TIER } from "constants/constants";
import { BigNumber } from "ethers";
import { INFTTokenInfoRedeemed } from "hooks/nft/types";
import useModal from "hooks/useModal";
import { useOnChange } from "hooks/usePrevious";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { IVault } from "types";
import "./index.scss";

interface EmbassyEligibilityProps {
  vault: IVault;
  tierFromShares: number;
  userShares: BigNumber;
  totalShares: BigNumber;
  totalBalance: BigNumber;
  depositTokens: INFTTokenInfoRedeemed[];
  handleRedeem: () => Promise<INFTTokenInfoRedeemed[] | undefined>;
}

const HUNDRED_PERCENT = 10000;
const TIER_PERCENTAGES = [10, 100, 1500];

export function EmbassyEligibility({
  vault,
  tierFromShares,
  userShares,
  totalShares,
  totalBalance,
  depositTokens,
  handleRedeem,
}: EmbassyEligibilityProps) {
  const { t } = useTranslation();
  const userSharesNumber = +formatUnits(userShares, vault.stakingTokenDecimals);
  const totalSharesNumber = +formatUnits(totalShares, vault.stakingTokenDecimals);
  const totalBalanceNumber = +formatUnits(totalBalance, vault.stakingTokenDecimals);

  const { isShowing: isShowingEmbassyPrompt, toggle: toggleEmbassyPrompt } = useModal();

  const maxRedeemed = depositTokens
    .filter((token) => token.isRedeemed)
    .map((token) => token.tier)
    .reduce((max, tier) => Math.max(max, tier), 0);

  const sharesPercentageTiers = TIER_PERCENTAGES.map((tp) => tp / HUNDRED_PERCENT).map(
    (tp) => (totalSharesNumber * tp) / (1 - tp)
  );

  const currentTier = Math.max(
    tierFromShares,
    sharesPercentageTiers.findIndex((tier) => userSharesNumber < tier)
  );

  const userHasTokensToRedeem = maxRedeemed < currentTier && depositTokens.length > 0;
  const isAvailableNextTier = currentTier < MAX_NFT_TIER;

  // When the user deposit and gets a new possible tier
  useOnChange(tierFromShares, (newTier, prevTier) => {
    console.log("CHANGE", tierFromShares);
    if (!newTier || !prevTier) return;
    if (newTier > prevTier) {
      console.log("ON CHANGE", tierFromShares, newTier, prevTier);
      toggleEmbassyPrompt();
    }
  });

  const minimumToNextTierParagraph = () => {
    const nextTier = currentTier + 1;

    const minToNextTierInShares = sharesPercentageTiers[currentTier] - userSharesNumber;
    const minToNextTierTokens = (minToNextTierInShares * totalBalanceNumber) / totalSharesNumber;

    const minimumInBalance = millify(minToNextTierTokens, { precision: 4 });
    const tokenSymbol = vault.stakingTokenSymbol;

    if (minToNextTierTokens <= 0) return null;

    const afterDepositText = t("embassyEligibility.afterDeposit");
    if (nextTier === 1) {
      return (
        <>
          <span>{t("embassyEligibility.minToEnter", { minimum: minimumInBalance, token: tokenSymbol })}</span>
          <br />
          <br />
          <span>{afterDepositText}</span>
        </>
      );
    } else if (nextTier <= 3) {
      return (
        <>
          <span>{t(`embassyEligibility.middleTier_${nextTier}`, { minimum: minimumInBalance, token: tokenSymbol })}</span>
          <br />
          <br />
          <span>{afterDepositText}</span>
        </>
      );
    } else {
      return null;
    }
  };

  const eligibleToRedeemNfts = () => (
    <>
      {isAvailableNextTier && (
        <>
          <br /> <br />
        </>
      )}
      {t("embassyEligibility.currentlyEligible", { tier: currentTier })}
      <Button onClick={handleRedeem} styleType="text">
        {t("redeemNFT", { tier: currentTier })}
      </Button>
      {/* <button className="btn-link">Redeem tier 1</button> */}
    </>
  );

  return (
    <>
      <div className="embassy-eligibility-wrapper">
        <div className="embassy-eligibility__title">{t("DepositWithdraw.EmbassyEligibility.title")}</div>
        <div className="embassy-eligibility__content">
          <span className="embassy-eligibility__content__min-to-embassy">
            {isAvailableNextTier && minimumToNextTierParagraph()}
            {userHasTokensToRedeem && eligibleToRedeemNfts()}
          </span>
        </div>
      </div>

      {depositTokens && (
        <Modal isShowing={isShowingEmbassyPrompt} onHide={toggleEmbassyPrompt}>
          <EmbassyNftTicketPrompt depositTokens={depositTokens} handleRedeem={handleRedeem} />
        </Modal>
      )}
    </>
  );
}
