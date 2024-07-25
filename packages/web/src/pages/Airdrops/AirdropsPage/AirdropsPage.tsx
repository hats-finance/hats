import AirdropVideoMobile from "assets/videos/airdrop-v2-mobile.mp4";
import AirdropVideo from "assets/videos/airdrop-v2.mp4";
import { Button } from "components";
import { useTranslation } from "react-i18next";
import { AirdropCheckEligibility } from "./components/AirdropCheckEligibility/AirdropCheckEligibility";
import { AirdropFAQ } from "./components/AirdropFAQ/AirdropFAQ";
import { HatsTokenInfo } from "./components/HatsTokenInfo/HatsTokenInfo";
import { StyledAirdropsPage } from "./styles";

export const AirdropsPage = () => {
  const { t } = useTranslation();

  return (
    <StyledAirdropsPage className="content-wrapper">
      <div className="hero">
        <video id="airdrop-video" autoPlay muted playsInline loop>
          <source src={AirdropVideo} type="video/mp4" />
        </video>
        <video id="airdrop-video-mobile" autoPlay muted playsInline loop>
          <source src={AirdropVideoMobile} type="video/mp4" />
        </video>
        <div className="buttons">
          <a href="#check-eligibility">
            <Button bigHorizontalPadding size="big">
              {t("Airdrop.checkEligibility")}
            </Button>
          </a>
        </div>
      </div>

      <HatsTokenInfo />
      <AirdropCheckEligibility />
      <AirdropFAQ />
    </StyledAirdropsPage>
  );
};
