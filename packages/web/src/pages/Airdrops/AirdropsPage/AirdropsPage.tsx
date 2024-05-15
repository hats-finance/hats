import AirdropVideo from "assets/videos/airdrop-v2.mp4";
import { Button } from "components";
import { useTranslation } from "react-i18next";
import { AirdropCheckElegibility } from "./components/AirdropCheckElegibility/AirdropCheckElegibility";
import { AirdropFAQ } from "./components/AirdropFAQ/AirdropFAQ";
import { HatsTokenInfo } from "./components/HatsTokenInfo/HatsTokenInfo";
import { StyledAirdropsPage } from "./styles";

export const AirdropsPage = () => {
  const { t } = useTranslation();

  return (
    <StyledAirdropsPage className="content-wrapper">
      <div className="hero">
        <video id="airdrop-video" autoPlay muted playsInline>
          <source src={AirdropVideo} type="video/mp4" />
        </video>
        <div className="buttons">
          <a href="#check-elegibility">
            <Button>{t("Airdrop.checkElegibility")}</Button>
          </a>
        </div>
      </div>

      <HatsTokenInfo />
      <AirdropCheckElegibility />
      {/* <AirdropFAQ /> */}
    </StyledAirdropsPage>
  );
};
