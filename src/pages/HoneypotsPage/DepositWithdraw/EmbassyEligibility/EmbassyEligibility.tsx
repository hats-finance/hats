import { formatUnits } from "@ethersproject/units";
import { Button, Modal } from "components";
import EmbassyNftRedeem from "components/EmbassyNftRedeem/EmbassyNftRedeem";
import { MAX_NFT_TIER } from "constants/constants";
import { BigNumber } from "ethers";
import { INFTTokenInfoRedeemed } from "hooks/nft/types";
import useModal from "hooks/useModal";
import { useOnChange } from "hooks/usePrevious";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { IVault } from "types";
import { StyledEmbassyEligibility } from "./styles";

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

  const { isShowing: isShowingRedeemEmbassyNfts, toggle: toggleRedeemEmbassyNfts } = useModal();

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

  console.log("tierFromShares", tierFromShares);
  // When the user deposit and gets a new possible tier
  useOnChange(tierFromShares, (newTier, prevTier) => {
    console.log("CHANGE", tierFromShares);
    console.log(`newTier: ${newTier}, prevTier: ${prevTier}`);
    if (!newTier || !prevTier) return;
    if (newTier > prevTier) {
      console.log("ON CHANGE", tierFromShares, newTier, prevTier);
      setTimeout(() => toggleRedeemEmbassyNfts(), 3000);
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
          <span>{afterDepositText}</span>
        </>
      );
    } else if (nextTier <= 3) {
      return (
        <>
          <span>{t(`embassyEligibility.middleTier_${nextTier}`, { minimum: minimumInBalance, token: tokenSymbol })}</span>
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
      <Button onClick={toggleRedeemEmbassyNfts} styleType="text">
        {t("redeemNFT", { tier: currentTier })}
      </Button>
    </>
  );

  return (
    <>
      <StyledEmbassyEligibility>
        <div className="title">{t("DepositWithdraw.EmbassyEligibility.title")}</div>
        <div className="content">
          {isAvailableNextTier && minimumToNextTierParagraph()}
          {userHasTokensToRedeem && eligibleToRedeemNfts()}
        </div>
      </StyledEmbassyEligibility>

      {depositTokens && (
        <Modal isShowing={isShowingRedeemEmbassyNfts} onHide={toggleRedeemEmbassyNfts}>
          <EmbassyNftRedeem depositTokens={depositTokens} handleRedeem={handleRedeem} />
        </Modal>
      )}
    </>
  );
}
