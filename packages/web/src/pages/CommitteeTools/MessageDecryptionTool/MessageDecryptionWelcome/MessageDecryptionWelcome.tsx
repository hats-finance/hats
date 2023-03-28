import { useTranslation } from "react-i18next";
import { Button } from "components";
import { useKeystore } from "components/Keystore";
import { StyledMessageDecryptionWelcome } from "./styles";

export const MessageDecryptionWelcome = () => {
  const { t } = useTranslation();

  const { initKeystore, isKeystoreCreated } = useKeystore();

  return (
    <StyledMessageDecryptionWelcome className="content-wrapper-sm">
      <p className="title">{t("CommitteeTools.welcomeTitle")}</p>
      <p className="mt-4">{t("CommitteeTools.welcomeDescription")}</p>

      {isKeystoreCreated ? (
        <Button className="mt-5" expanded onClick={initKeystore}>
          {t("PGPTool.unlockKeystore")}
        </Button>
      ) : (
        <div className="mt-5">
          <p>{t("CommitteeTools.step1Title")}</p>
          <p className="step-info">{t("CommitteeTools.step1Content")}</p>
          <p>{t("CommitteeTools.step2Title")}</p>
          <p className="step-info">{t("CommitteeTools.step2Content")}</p>
          <p>{t("CommitteeTools.step3Title")}</p>
          <p className="step-info">{t("CommitteeTools.step3Content")}</p>

          <Button className="mt-5" expanded onClick={initKeystore}>
            {t("PGPTool.createKeystore")}
          </Button>
        </div>
      )}
    </StyledMessageDecryptionWelcome>
  );
};
