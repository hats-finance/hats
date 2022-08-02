import { ScreenSize } from "constants/constants";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import CheckEligibility from "./components/CheckEligibility/CheckEligibility";
import TimelineDot from "./components/TimelineDot/TimelineDot";
import SailBoatImage from "assets/images/sail-boat.png";
import RadioButtonChecked from "assets/icons/radio-button-checked.svg";
import FAQ from "./components/FAQ/FAQ";
import "./index.scss";

export default function AirdropMachine() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);

  return (
    <div className="content airdrop-machine-wrapper">
      <div className="airdrop-machine-content">
        <div className="airdrop-machine__image-container">
          <img src={SailBoatImage} className="airdrop-machine__image" alt="sail boat" />
        </div>
        <div className="airdrop-machine__container-with-timeline">
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
              <div className="airdrop-machine__eligibility-types">
                <div className="airdrop-machine__eligibility-type">
                  <img src={RadioButtonChecked} alt="radio button" />
                  <div className="airdrop-machine__eligibility-type-text">
                    <div><b>{t("AirdropMachine.section-2.sub-title-1")}</b></div>
                    {t("AirdropMachine.section-2.text-1")}
                  </div>
                </div>
                <div className="airdrop-machine__eligibility-type">
                  <img src={RadioButtonChecked} alt="radio button" />
                  <div className="airdrop-machine__eligibility-type-text">
                    <div><b>{t("AirdropMachine.section-2.sub-title-2")}</b></div>
                    {t("AirdropMachine.section-2.text-2")}
                  </div>
                </div>
                <div className="airdrop-machine__eligibility-type">
                  <img src={RadioButtonChecked} alt="radio button" />
                  <div className="airdrop-machine__eligibility-type-text">
                    <div><b>{t("AirdropMachine.section-2.sub-title-3")}</b></div>
                    {t("AirdropMachine.section-2.text-3")}
                  </div>
                </div>
                <div className="airdrop-machine__eligibility-type">
                  <img src={RadioButtonChecked} alt="radio button" />
                  <div className="airdrop-machine__eligibility-type-text">
                    <div><b>{t("AirdropMachine.section-2.sub-title-4")}</b></div>
                    {t("AirdropMachine.section-2.text-4")}
                  </div>
                </div>
                <div className="airdrop-machine__eligibility-type">
                  <img src={RadioButtonChecked} alt="radio button" />
                  <div className="airdrop-machine__eligibility-type-text">
                    <div><b>{t("AirdropMachine.section-2.sub-title-5")}</b></div>
                    {t("AirdropMachine.section-2.text-5")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {screenSize === ScreenSize.Mobile && <TimelineDot />}
        </div>
        <div className="airdrop-machine__section last-section">
          <div className="airdrop-machine__title-wrapper">
            {screenSize === ScreenSize.Desktop && <TimelineDot />}
            {t("AirdropMachine.section-3.title")}
          </div>
          <div className="airdrop-machine__section-content">
            <CheckEligibility />
          </div>
        </div>
        {screenSize === ScreenSize.Mobile && <TimelineDot />}
        <div className="airdrop-machine__section">
          <div className="airdrop-machine__section-content">
            <FAQ />
          </div>
        </div>
      </div>
    </div>
  )
}
