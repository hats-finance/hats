import { BackArrowIcon } from "assets/icons/back-arrow";
import HatsTokenIcon from "assets/icons/hats-logo-circle.svg";
import { Alert, Button, FormInput } from "components";
import { BigNumber } from "ethers";
import moment from "moment";
import { AirdropEligibility } from "pages/Airdrops/utils/getAirdropEligibility";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { HATS_STAKING_VAULT } from "settings";
import { shortenAddress, shortenIfAddress } from "utils/addresses.utils";
import { Amount } from "utils/amounts.utils";
import { useAccount } from "wagmi";
import { AirdropRedeemModalContext } from "../store";

export const AirdropRedeemReview = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const { prevStep, nextStep, addressToCheck, airdropsEligibility, airdropsData, handleClaimAirdrops, onlyTokenLocks } =
    useContext(AirdropRedeemModalContext);

  if (airdropsEligibility.some((airdrop) => !airdrop || !airdrop.eligible)) return null;

  const airdropsChainId = airdropsData[0].chainId;
  const isReceiverConnected = addressToCheck.toLowerCase() === address?.toLowerCase();
  const totalEligibility = airdropsEligibility.reduce(
    (prev, airdrop) => prev.add(BigNumber.from((airdrop as AirdropEligibility).total)),
    BigNumber.from(0)
  );

  return (
    <div className="content-modal">
      <img className="banner" src={require("assets/images/hats_vault.png")} alt="hats claim" />
      <h2>
        {onlyTokenLocks && (
          <>
            {onlyTokenLocks && t("Airdrop.lastStep")}
            <br />
          </>
        )}
        {onlyTokenLocks ? t("Airdrop.lastStepDescTokenLocks") : t("Airdrop.yourTokenEligibility")}
      </h2>

      <div>
        <p className="mt-3">
          {t("Airdrop.totalEligibility")}: {shortenIfAddress(addressToCheck, { startLength: 6 })}
        </p>
        <FormInput
          prefixIcon={<img src={HatsTokenIcon} alt="$HAT token" width={32} height={32} className="mt-1" />}
          className="mt-2"
          readOnly
          value={new Amount(totalEligibility, 18, "$HAT").formatted()}
        />

        <ul className="mb-5">
          {airdropsData.map((airdrop, i) => {
            const eligibility = airdropsEligibility[i];
            if (!eligibility) return null;

            const total = new Amount(BigNumber.from(eligibility.total), 18, "$HAT").formatted();
            const daysLocked = moment(airdrop.lockEndDate).format("MMMM Do 24'");

            return (
              <li key={i}>
                <strong>{airdrop.descriptionData.name}:</strong> {total}
                {", "}
                {airdrop.isLocked ? t("Airdrop.linearlyReleasedUntil", { date: daysLocked }) : t("Airdrop.immediatelyReleased")}
              </li>
            );
          })}
        </ul>
      </div>

      {!isReceiverConnected && (
        <Alert type="error" className="mt-5">
          {t("Airdrop.wrongAddressConnectedError", { wallet: shortenAddress(addressToCheck, { startLength: 6 }) })}
        </Alert>
      )}
      <div className="buttons">
        <Button styleType="outlined" size="medium" onClick={prevStep}>
          <BackArrowIcon />
        </Button>
        <Button
          size="medium"
          bigHorizontalPadding
          onClick={
            onlyTokenLocks || airdropsChainId !== HATS_STAKING_VAULT.chain.id
              ? () => handleClaimAirdrops(undefined, undefined)
              : nextStep
          }
          disabled={!isReceiverConnected}
        >
          {onlyTokenLocks ? t("Airdrop.claim") : t("Airdrop.continueToClaim")}
        </Button>
      </div>
    </div>
  );
};
