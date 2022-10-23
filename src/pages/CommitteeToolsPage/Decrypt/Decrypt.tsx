import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createMessage, decrypt, encrypt, readMessage } from "openpgp";
import { FormInput } from "components";
import { KeyManager, KeystoreContext, SelectKeyModal } from "components/Keystore";
import { readPrivateKeyFromStoredKey } from "components/Keystore/utils";
import useModal from "hooks/useModal";
import { StyledDecrypt } from "./styles";

export default function Decrypt() {
  const keystoreContext = useContext(KeystoreContext);
  const [error, setError] = useState<string>();
  const encryptedMessageRef = useRef<HTMLTextAreaElement>(null);
  const decryptedMessageRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  const { isShowing: isShowingSelectKey, show: showSelectKey, hide: hideSelectKey } = useModal();

  const location = useLocation();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.ipfs) {
      (async () => {
        const response = await fetch(params.ipfs);
        const message = await response.text();
        encryptedMessageRef.current!.value = message;
      })();
    }
  }, [location.search]);

  useEffect(() => {
    if (keystoreContext.keystore?.storedKeys.length === 0 || !keystoreContext.selectedKey === undefined) {
      showSelectKey();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keystoreContext.keystore, keystoreContext.selectedKey]);

  const _decrypt = useCallback(async () => {
    try {
      setError(undefined);
      if (!keystoreContext.selectedKey) {
        showSelectKey();
        return;
      }

      const armoredMessage = encryptedMessageRef.current!.value;

      if (!armoredMessage || armoredMessage === "") {
        throw new Error(t("CommitteeTools.Decrypt.no-message-decrypt"));
      }

      const privateKey = await readPrivateKeyFromStoredKey(
        keystoreContext.selectedKey.privateKey,
        keystoreContext.selectedKey.passphrase
      );
      const message = await readMessage({ armoredMessage });
      const { data: decrypted } = await decrypt({
        message,
        decryptionKeys: privateKey,
      });
      decryptedMessageRef.current!.value = decrypted as string;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keystoreContext.selectedKey]);

  const _encrypt = useCallback(async () => {
    try {
      setError("");
      if (!keystoreContext.selectedKey) {
        showSelectKey();
        return;
      }

      const privateKey = await readPrivateKeyFromStoredKey(
        keystoreContext.selectedKey.privateKey,
        keystoreContext.selectedKey.passphrase
      );
      const message = await createMessage({
        text: decryptedMessageRef.current!.value!,
      });
      encryptedMessageRef.current!.value = (await encrypt({
        message,
        encryptionKeys: privateKey?.toPublic(),
      })) as string;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keystoreContext.selectedKey]);

  return (
    <StyledDecrypt>
      <h2 className="title">{t("CommitteeTools.Decrypt.decrypt-tool")}</h2>
      <p className="description">{t("CommitteeTools.Decrypt.decrypt-description")}</p>

      <KeyManager />
      <SelectKeyModal isShowing={isShowingSelectKey} onHide={hideSelectKey} />

      <div className="textbox-container">
        <p className="textbox-title">{t("CommitteeTools.Decrypt.encrypted-message")}</p>
        <FormInput type="textarea" pastable ref={encryptedMessageRef} />
        {error && <div className="error-label">{error}</div>}
        <button onClick={_decrypt} className="fill button">
          {t("CommitteeTools.Decrypt.decrypt")}
        </button>
      </div>

      <div className="textbox-container">
        <p className="textbox-title">{t("CommitteeTools.Decrypt.decrypted-message")}</p>
        <FormInput type="textarea" copyable ref={decryptedMessageRef} />
        <button onClick={_encrypt} className="fill button">
          {t("CommitteeTools.Decrypt.encrypt")}
        </button>
      </div>
    </StyledDecrypt>
  );
}
