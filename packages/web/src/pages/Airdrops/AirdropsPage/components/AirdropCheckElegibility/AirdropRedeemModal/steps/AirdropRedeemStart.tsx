import { Button } from "components";
import { BigNumber } from "ethers";
import moment from "moment";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Amount } from "utils/amounts.utils";
import { AirdropRedeemModalContext } from "../store";

export const AirdropRedeemStart = () => {
  const { t } = useTranslation();
  const { nextStep, onlyTokenLocks, airdropsData, airdropsElegibility } = useContext(AirdropRedeemModalContext);

  return (
    <div className="content-modal">
      <img className="banner" src={require("assets/images/hats_vault.png")} alt="hats claim" />
      <div
        className="mb-5"
        dangerouslySetInnerHTML={{ __html: t(onlyTokenLocks ? "Airdrop.startTextContentTokenLock" : "Airdrop.startTextContent") }}
      />

      <div>
        <p>
          <strong>{t("Airdrop.readyToUnlockYourRewards")}</strong>
        </p>
        <p className="mt-2">{t("Airdrop.youWillRedeemNAirdrops", { quantity: airdropsData.length })}:</p>
        <ul>
          {airdropsData.map((airdrop, i) => {
            const elegibility = airdropsElegibility[i];
            if (!elegibility) return null;

            const total = new Amount(BigNumber.from(elegibility.total), 18, "$HAT").formatted();
            const daysLocked = moment(airdrop.lockEndDate).format("MMMM Do 24'");

            return (
              <li>
                <strong className="italic">{airdrop.descriptionData.name}:</strong>
                <br />
                {`${total}, `}
                {airdrop.isLocked ? t("Airdrop.linearlyReleasedUntil", { date: daysLocked }) : t("Airdrop.immediatelyReleased")}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="buttons center">
        <Button onClick={nextStep} bigHorizontalPadding>
          {t("Airdrop.startQuiz")}
        </Button>
      </div>
    </div>
  );
};
