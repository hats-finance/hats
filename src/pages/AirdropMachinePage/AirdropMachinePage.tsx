import { Colors, EMBASSY_LEARN_MORE, RC_TOOLTIP_OVERLAY_INNER_STYLE, ScreenSize } from "constants/constants";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import CheckEligibility from "./components/CheckEligibility/CheckEligibility";
import TimelineDot from "./components/TimelineDot/TimelineDot";
import AirdropAnimation from "assets/videos/airdrop-machine-welcome.mp4";
import AirdropAnimationPoster from "assets/images/airdrop-machine-welcome-poster.png";
import AirdropStartButton from "assets/images/airdrop-machine-start.gif";
import RadioButtonChecked from "assets/icons/radio-button-checked.svg";
import OpenInNewTabIcon from "assets/icons/open-in-new-tab.svg";
import FAQ from "./components/FAQ/FAQ";
import "./index.scss";
import Tooltip from "rc-tooltip";
import InfoIcon from "assets/icons/info.icon";
import { useEffect, useState } from "react";

const AirdropMachinePage = () => {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const videoElement = document.getElementById("airdropMachineVideo");
    videoElement?.addEventListener("ended", () => setVideoEnded(true));

    return () => videoElement?.removeEventListener("ended", () => setVideoEnded(true));
  }, [setVideoEnded])

  const scrollToStart = () => {
    document.getElementById("airdropStart")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <div className="content-wrapper airdrop-machine-wrapper">
      <div className="airdrop-machine-content">
        <div className="airdrop-machine__video-container">
          <video id="airdropMachineVideo" autoPlay muted playsInline className="airdrop-machine__video" poster={AirdropAnimationPoster}>
            <source src={AirdropAnimation} type="video/mp4" />
          </video>
          {screenSize === ScreenSize.Desktop && videoEnded && <img onClick={scrollToStart} className="airdrop-machine__start-btn" src={AirdropStartButton} alt="start" />}
        </div>
        <div id="airdropStart" className="airdrop-machine__container-with-timeline">
          <div className="airdrop-machine__section first-section">
            <div className="airdrop-machine__title-wrapper">
              {screenSize === ScreenSize.Desktop && <TimelineDot color="#3756C0" />}
              {t("AirdropMachine.section-1.title")}
            </div>
            <div className="airdrop-machine__section-content">
              {t("AirdropMachine.section-1.text")}
              <Tooltip
                placement="top"
                overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
                overlay={t("AirdropMachine.section-1.tooltip")}>
                <div className="airdrop-machine__tooltip-container">
                  <InfoIcon width="15px" fill={Colors.white} />
                </div>
              </Tooltip>
            </div>
          </div>
          {screenSize === ScreenSize.Mobile && <TimelineDot />}
          <div className="airdrop-machine__section">
            <div className="airdrop-machine__title-wrapper">
              {screenSize === ScreenSize.Desktop && <TimelineDot color="#4C80D0" />}
              {t("AirdropMachine.section-2.title")}
            </div>
            <div className="airdrop-machine__section-content">
              <span onClick={() => window.open(EMBASSY_LEARN_MORE)} className="airdrop-machine__learn-more">{t("AirdropMachine.section-2.learn-more")} <img src={OpenInNewTabIcon} alt="" /></span>
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
            {screenSize === ScreenSize.Desktop && <TimelineDot color="#88F7FC" left="-20px" />}
            {t("AirdropMachine.section-3.title")}
          </div>
          <div className="airdrop-machine__section-content">
            <CheckEligibility />
          </div>
        </div>
        {screenSize === ScreenSize.Mobile && <TimelineDot />}
        <div className="airdrop-machine__section faq-section">
          <div className="airdrop-machine__section-content">
            <FAQ />
          </div>
        </div>
      </div>
    </div>
  )
}

export { AirdropMachinePage };