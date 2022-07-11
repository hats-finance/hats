import { ScreenSize } from "constants/constants";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import CheckEligibility from "./components/CheckEligibility/CheckEligibility";
import TimelineDot from "./components/TimelineDot/TimelineDot";
import SailBoatImage from "../../assets/images/sail-boat.svg";
import "./index.scss";

export default function AirdropMachine() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);

  return (
    <div className="content airdrop-machine-wrapper">
      <div className="airdrop-machine-content">
        <img src={SailBoatImage} className="airdrop-machine__sail-boat" alt="sail boat" />
        <div className="airdrop-machine__section first-section">
          <div className="airdrop-machine__title-wrapper">
            {screenSize === ScreenSize.Desktop && <TimelineDot />}
            {t("AirdropMachine.section-1.title")}
          </div>
          <div className="airdrop-machine__section-content">
            {t("AirdropMachine.section-1.text")}
          </div>
        </div>
        {screenSize === ScreenSize.Mobile && <TimelineDot />}
        <div className="airdrop-machine__section">
          <div className="airdrop-machine__title-wrapper">
            {screenSize === ScreenSize.Desktop && <TimelineDot />}
            {t("AirdropMachine.section-2.title")}
          </div>
          <div className="airdrop-machine__section-content">
            {t("AirdropMachine.section-2.text-1")}
            {t("AirdropMachine.section-2.text-2")}
            {t("AirdropMachine.section-2.text-3")}
            {t("AirdropMachine.section-2.text-4")}
            {t("AirdropMachine.section-2.text-5")}
          </div>
        </div>
        {screenSize === ScreenSize.Mobile && <TimelineDot />}
        <div className="airdrop-machine__section">
          <div className="airdrop-machine__title-wrapper">
            {screenSize === ScreenSize.Desktop && <TimelineDot />}
            {t("AirdropMachine.section-3.title")}
          </div>
          <div className="airdrop-machine__section-content">
            <CheckEligibility />
          </div>
        </div>
        {screenSize === ScreenSize.Mobile && <TimelineDot />}
        <div className="airdrop-machine__section last-section">
          <div className="airdrop-machine__title-wrapper">
            {screenSize === ScreenSize.Desktop && <TimelineDot />}
            {t("AirdropMachine.section-4.title")}
          </div>
          <div className="airdrop-machine__section-content">
            {t("AirdropMachine.section-4.text")}
          </div>
          <button className="airdrop-machine__join-embassy-btn fill">{t("AirdropMachine.section-4.button-text")}</button>
        </div>
      </div>
    </div>
  )
}
