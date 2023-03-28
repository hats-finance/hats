import { Loading } from "components";
import { useKeystore } from "components/Keystore";
import { MessageDecryptionPage } from "./MessageDecryptionPage/MessageDecryptionPage";
import { MessageDecryptionWelcome } from "./MessageDecryptionWelcome/MessageDecryptionWelcome";

export const MessageDecryptionHome = () => {
  const { keystore, isKeystoreLoaded } = useKeystore();

  if (!isKeystoreLoaded) return <Loading fixed />;

  return <div className="content-wrapper">{keystore ? <MessageDecryptionPage /> : <MessageDecryptionWelcome />}</div>;
};
