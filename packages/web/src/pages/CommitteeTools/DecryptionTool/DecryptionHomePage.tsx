import { Loading } from "components";
import { useKeystore } from "components/Keystore";
import { DecryptionPage } from "./DecryptionPage/DecryptionPage";
import { DecryptionWelcomePage } from "./DecryptionWelcomePage/DecryptionWelcomePage";

export const DecryptionHomePage = () => {
  const { keystore, isKeystoreLoaded } = useKeystore();

  if (!isKeystoreLoaded) return <Loading fixed />;

  return <div className="content-wrapper">{keystore ? <DecryptionPage /> : <DecryptionWelcomePage />}</div>;
};
