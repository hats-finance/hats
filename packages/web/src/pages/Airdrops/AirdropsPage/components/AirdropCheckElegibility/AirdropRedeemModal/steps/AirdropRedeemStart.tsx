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

      <hr />
      <div className="mt-5">
        <h3>{t("Airdrop.youWillRedeemNAirdrops", { quantity: airdropsData.length })}</h3>
        <ol>
          {airdropsData.map((airdrop, i) => {
            const elegibility = airdropsElegibility[i];
            if (!elegibility) return null;

            const total = new Amount(BigNumber.from(elegibility.total), 18, "$HAT").formatted();
            const daysLocked = moment(airdrop.lockEndDate).format("MMMM Do 24'");

            return (
              <li>
                <strong>{airdrop.descriptionData.name}:</strong> {total}
                {"\n"}
                {airdrop.isLocked ? t("Airdrop.linearlyReleasedUntil", { date: daysLocked }) : t("Airdrop.immediatelyReleased")}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="buttons center">
        <Button onClick={nextStep} bigHorizontalPadding>
          {t("Airdrop.startQuiz")}
        </Button>
      </div>
    </div>
  );
};
