import { formatUnits } from "@ethersproject/units";
import { Modal } from "components";
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

interface IProps {
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
}: IProps) {
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

  // when user gets to next tier
  useOnChange(tierFromShares, (newTier, prevTier) => {
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

    const minimum = millify(minToNextTierTokens, { precision: 4 });
    const tokenSymbol = vault.stakingTokenSymbol;
    return (
      minToNextTierTokens > 0 && (
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
          {nextTier > 0 && nextTier < 4 && <span>{t("DepositWithdraw.EmbassyEligibility.after-deposit")}</span>}
        </>
      )
    );
  };

  const eligibleToRedeemNfts = () => {
    if (maxRedeemed < currentTier && depositTokens.length > 0)
      return (
        <span>
          You are currently eligible for tier {currentTier}, please <button onClick={handleRedeem}>redeem</button>
        </span>
      );
  };

  return (
    <>
      <div className="embassy-eligibility-wrapper">
        <div className="embassy-eligibility__title">{t("DepositWithdraw.EmbassyEligibility.title")}</div>
        <div className="embassy-eligibility__content">
          <span className="embassy-eligibility__content__min-to-embassy">
            {currentTier < MAX_NFT_TIER && minimumToNextTierParagraph()}
            {eligibleToRedeemNfts()}
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
