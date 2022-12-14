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
  availableNftsByDeposit: INFTTokenInfoRedeemed[];
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
  availableNftsByDeposit,
  handleRedeem,
}: EmbassyEligibilityProps) {
  const { t } = useTranslation();
  const userSharesNumber = +formatUnits(userShares, vault.stakingTokenDecimals);
  const totalSharesNumber = +formatUnits(totalShares, vault.stakingTokenDecimals);
  const totalBalanceNumber = +formatUnits(totalBalance, vault.stakingTokenDecimals);

  const { isShowing: isShowingRedeemEmbassyNfts, toggle: toggleRedeemEmbassyNfts } = useModal();

  const availableNftsToRedeem = availableNftsByDeposit.filter((token) => !token.isRedeemed);
  const nftsRedeemed = availableNftsByDeposit.filter((token) => token.isRedeemed);

  const maxRedeemed = nftsRedeemed.map((token) => token.tier).reduce((max, tier) => Math.max(max, tier), 0);

  const sharesPercentageTiers = TIER_PERCENTAGES.map((tp) => tp / HUNDRED_PERCENT).map(
    (tp) => (totalSharesNumber * tp) / (1 - tp)
  );

  const currentTier = Math.max(
    tierFromShares,
    sharesPercentageTiers.findIndex((tier) => userSharesNumber < tier)
  );

  const userHasTokensToRedeem = maxRedeemed < currentTier && availableNftsByDeposit.length > 0;
  const isAvailableNextTier = currentTier < MAX_NFT_TIER;
  const userHoldAllTiers = maxRedeemed === MAX_NFT_TIER;

  console.log("tierFromShares", tierFromShares);
  // When the user deposit and gets a new possible tier
  useOnChange(tierFromShares, (newTier, prevTier) => {
    console.log("CHANGE", tierFromShares);
    console.log(`newTier: ${newTier}, prevTier: ${prevTier}`);
    if (newTier === undefined || prevTier === undefined) return;
    if (newTier > prevTier && availableNftsToRedeem.length > 0) {
      console.log("ON CHANGE", tierFromShares, newTier, prevTier);
      setTimeout(toggleRedeemEmbassyNfts, 1000);
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
          <span className="blue">{t("embassyEligibility.minToEnter", { minimum: minimumInBalance, token: tokenSymbol })}</span>
          <span>{afterDepositText}</span>
        </>
      );
    } else if (nextTier <= 3) {
      return (
        <>
          <span className="blue">
            {t(`embassyEligibility.middleTier_${nextTier}`, { minimum: minimumInBalance, token: tokenSymbol })}
          </span>
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
      <Button onClick={toggleRedeemEmbassyNfts} styleType="text" lowercase>
        {t("here", { tier: currentTier })}
      </Button>
    </>
  );

  const redeemedAllTiers = () => <>{t("embassyEligibility.youHoldAllTiers")}</>;

  return (
    <>
      <StyledEmbassyEligibility>
        <div className="title">{t("DepositWithdraw.EmbassyEligibility.title")}</div>
        <div className="content">
          {isAvailableNextTier && minimumToNextTierParagraph()}
          {userHasTokensToRedeem && eligibleToRedeemNfts()}
          {userHoldAllTiers && redeemedAllTiers()}
        </div>
      </StyledEmbassyEligibility>

      {availableNftsToRedeem && (
        <Modal isShowing={isShowingRedeemEmbassyNfts} onHide={toggleRedeemEmbassyNfts}>
          <EmbassyNftRedeem availableNftsToRedeem={availableNftsToRedeem} handleRedeem={handleRedeem} />
        </Modal>
      )}
    </>
  );
}
