import { useTranslation } from "react-i18next";
import { Button } from "components";
import { useKeystore } from "components/Keystore";
import { StyledDecryptionWelcomePage } from "./styles";

export const DecryptionWelcomePage = () => {
  const { t } = useTranslation();

  const { initKeystore, isKeystoreCreated } = useKeystore();

  return (
    <StyledDecryptionWelcomePage className="content-wrapper-sm">
      <p className="title">{t("DecryptionTool.welcomeTitle")}</p>
      <p className="mt-4">{t("DecryptionTool.welcomeDescription")}</p>

      {isKeystoreCreated ? (
        <Button className="mt-5" expanded onClick={initKeystore}>
          {t("PGPTool.unlockKeystore")}
        </Button>
      ) : (
        <div className="mt-5">
          <p>{t("DecryptionTool.step1Title")}</p>
          <p className="step-info">{t("DecryptionTool.step1Content")}</p>
          <p>{t("DecryptionTool.step2Title")}</p>
          <p className="step-info">{t("DecryptionTool.step2Content")}</p>
          <p>{t("DecryptionTool.step3Title")}</p>
          <p className="step-info">{t("DecryptionTool.step3Content")}</p>

          <Button className="mt-5" expanded onClick={initKeystore}>
            {t("PGPTool.createKeystore")}
          </Button>
        </div>
      )}
    </StyledDecryptionWelcomePage>
  );
};
