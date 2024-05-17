import { BackArrowIcon } from "assets/icons/back-arrow";
import HatsTokenIcon from "assets/icons/hats-logo-circle.svg";
import { Alert, Button, CollapsableTextContent, FormInput } from "components";
import { BigNumber } from "ethers";
import moment from "moment";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { shortenAddress, shortenIfAddress } from "utils/addresses.utils";
import { Amount } from "utils/amounts.utils";
import { useAccount } from "wagmi";
import { AirdropRedeemModalContext } from "../store";

export const AirdropRedeemReview = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const { prevStep, addressToCheck, airdropElegibility, airdropData, isDelegating, handleClaimAirdrop } =
    useContext(AirdropRedeemModalContext);

  if (airdropElegibility === false || !airdropElegibility || !airdropElegibility.eligible) return null;

  const isReceiverConnected = addressToCheck.toLowerCase() === address?.toLowerCase();

  return (
    <div className="content-modal">
      <img className="banner" src={require("assets/images/hats_vault.png")} alt="hats claim" />
      <h2>{t("Airdrop.lastStepClaimYourTokens")}</h2>

      <div className="mt-5">
        <strong>
          {airdropData.isLocked
            ? t("Airdrop.youAreEligibleToAirdropLocked", {
                date: moment(airdropData.lockEndDate).format("MMMM Do YYYY"),
              })
            : t("Airdrop.youAreEligibleToAirdrop")}
        </strong>
        <p className="mt-3">
          {t("Airdrop.totalElegibility")}: {shortenIfAddress(addressToCheck, { startLength: 6 })}
        </p>
        <FormInput
          prefixIcon={<img src={HatsTokenIcon} alt="$HAT token" width={32} height={32} className="mt-1" />}
          className="mt-2"
          readOnly
          value={new Amount(BigNumber.from(airdropElegibility.total), 18, "$HAT").formatted()}
        />

        {airdropData.isLocked && (
          <div className="locked-info">
            <div className="locked-amount">
              <p>{t("Airdrop.linearlyReleased")}:</p>
              <div className="locked-amount-token">
                <img src={HatsTokenIcon} alt="$HAT token" width={32} height={32} className="mt-1" />
                <strong>{new Amount(BigNumber.from(airdropElegibility.total), 18).formatted()}</strong>
                <p>$HAT</p>
              </div>
            </div>
            <p className="explanation">
              {t("Airdrop.linearlyReleasedExplanation", {
                daysLocked: moment(airdropData.lockEndDate).fromNow(true),
              })}
            </p>
          </div>
        )}

        <div className="mt-5">
          <CollapsableTextContent title={t("Airdrop.elegibilityCriteriaBreakdown")} noContentPadding inverseArrow>
            <div className="elegibility-breakdown">
              <div className="breakdown">
                {Object.keys(airdropElegibility)
                  .filter((k) => !["info", "total", "eligible"].includes(k))
                  .map((k) => {
                    const eligible = BigNumber.from(airdropElegibility[k]).gt(0);
                    return (
                      <div className={`breakdown-item ${eligible ? "eligible" : ""}`} key={k}>
                        <div className="left">
                          <span className="check">{eligible ? "✓" : "✗"}</span>
                          <span className="name">{t(`Airdrop.${k}`)}</span>
                        </div>
                        <span className="amount">
                          {new Amount(BigNumber.from(airdropElegibility[k]), 18, "$HAT").formatted()}
                        </span>
                      </div>
                    );
                  })}
              </div>
              <div className="total">
                <span>{t("total")}</span>
                <span>{new Amount(BigNumber.from(airdropElegibility.total), 18, "$HAT").formatted()}</span>
              </div>
            </div>
          </CollapsableTextContent>
        </div>
      </div>

      {!isReceiverConnected && (
        <Alert type="error" className="mt-5">
          {t("Airdrop.wrongAddressConnectedError", { wallet: shortenAddress(addressToCheck, { startLength: 6 }) })}
        </Alert>
      )}
      <div className="buttons">
        <Button styleType="outlined" size="medium" onClick={prevStep} disabled={isDelegating}>
          <BackArrowIcon />
        </Button>
        <Button size="medium" bigHorizontalPadding onClick={handleClaimAirdrop} disabled={isDelegating || !isReceiverConnected}>
          {isDelegating ? `${t("Airdrop.claimingAirdrop")}...` : t("Airdrop.claimAirdrop")}
        </Button>
      </div>
    </div>
  );
};
