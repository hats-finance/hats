import { useTranslation } from "react-i18next";

export const HatsVision = () => {
  const { t } = useTranslation();

  return (
    <div className="hats-vision">
      <div className="info">
        <h1>{t("Airdrop.hatsVision")}</h1>
        <p>{t("Airdrop.hatsVisionContent")}</p>
      </div>
    </div>
  );
};
