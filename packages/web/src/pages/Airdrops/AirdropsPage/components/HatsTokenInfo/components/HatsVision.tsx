import { useTranslation } from "react-i18next";
import HatsVisionImage from "../assets/hats_vision.png";

export const HatsVision = () => {
  const { t } = useTranslation();

  return (
    <div className="hats-vision">
      <div className="info">
        <h3>{t("Airdrop.hatsVision")}</h3>
        <p>{t("Airdrop.hatsVisionContent")}</p>
      </div>
      <img src={HatsVisionImage} alt="hats vision" />
    </div>
  );
};
