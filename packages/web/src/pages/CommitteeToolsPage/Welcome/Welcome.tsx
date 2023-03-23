import { useTranslation } from "react-i18next";
import { Button } from "components";
import { useKeystore } from "components/Keystore";
import "./index.scss";

const Welcome = () => {
  const { t } = useTranslation();

  const { initKeystore, isKeystoreCreated } = useKeystore();

  return (
    <div className="committee-welcome">
      <h1 className="committee-welcome__title">{t("CommitteeTools.Welcome.title")}</h1>
      <p className="committee-welcome__content-1">{t("CommitteeTools.Welcome.content-1")}</p>
      <p className="committee-welcome__content-2">{t("CommitteeTools.Welcome.content-2")}</p>

      {isKeystoreCreated ? (
        <Button className="mt-5" expanded onClick={initKeystore}>
          {t("PGPTool.unlockKeystore")}
        </Button>
      ) : (
        <>
          <p className="committee-welcome__step-title">{t("CommitteeTools.Welcome.step-1")}</p>
          <p className="committee-welcome__step-content">{t("CommitteeTools.Welcome.step-1-content")}</p>
          <p className="committee-welcome__step-title">{t("CommitteeTools.Welcome.step-2")}</p>
          <p className="committee-welcome__step-content">{t("CommitteeTools.Welcome.step-2-content")}</p>
          <p className="committee-welcome__step-title">{t("CommitteeTools.Welcome.step-3")}</p>
          <p className="committee-welcome__step-content">{t("CommitteeTools.Welcome.step-3-content")}</p>

          <Button className="mt-5" expanded onClick={initKeystore}>
            {t("PGPTool.createKeystore")}
          </Button>
        </>
      )}
    </div>
  );
};

export default Welcome;
