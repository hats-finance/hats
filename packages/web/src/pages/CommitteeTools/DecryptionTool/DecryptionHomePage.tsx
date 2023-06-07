import { Loading, Seo } from "components";
import { useKeystore } from "components/Keystore";
import { useTranslation } from "react-i18next";
import { DecryptionPage } from "./DecryptionPage/DecryptionPage";
import { DecryptionWelcomePage } from "./DecryptionWelcomePage/DecryptionWelcomePage";

export const DecryptionHomePage = () => {
  const { t } = useTranslation();
  const { keystore, isKeystoreLoaded } = useKeystore();

  if (!isKeystoreLoaded) return <Loading fixed />;

  return (
    <>
      <Seo title={t("seo.decryptionToolTitle")} />
      <div className="content-wrapper">{keystore ? <DecryptionPage /> : <DecryptionWelcomePage />}</div>
    </>
  );
};
