import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createMessage, decrypt, encrypt, readMessage } from "openpgp";
import { readPrivateKeyFromStoredKey } from "components/Keystore/utils";
import { KeystoreContext, SelectKeyModal } from "components/Keystore";
import { HatsFormInput } from "components";
import CopyIcon from "assets/icons/copy.icon.svg";
import "./index.scss";

export default function Decrypt() {
  const keystoreContext = useContext(KeystoreContext);
  const [showSelectKeyModal, setShowSelectKeyModal] = useState(false);
  const [showSelectedKeyDetails, setShowSelectedKeyDetails] = useState(false);
  const [error, setError] = useState<string>();
  const encryptedMessageRef = useRef<HTMLTextAreaElement>(null);
  const decryptedMessageRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  const location = useLocation();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.ipfs) {
      (async () => {
        const response = await fetch(params.ipfs)
        const message = await response.text()
        encryptedMessageRef.current!.value = message
      })();
    }
  }, [location.search]);

  useEffect(() => {
    if (
      keystoreContext.keystore?.storedKeys.length === 0 ||
      !keystoreContext.selectedKey === undefined
    ) {
      setShowSelectKeyModal(true);
    }
  }, [keystoreContext.keystore, keystoreContext.selectedKey]);

  const _decrypt = useCallback(async () => {
    try {
      setError(undefined)
      if (!keystoreContext.selectedKey) {
        setShowSelectKeyModal(true);
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
        decryptionKeys: privateKey
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
        setShowSelectKeyModal(true);
        return;
      }
      const privateKey = await readPrivateKeyFromStoredKey(
        keystoreContext.selectedKey.privateKey,
        keystoreContext.selectedKey.passphrase
      );
      const message = await createMessage({
        text: decryptedMessageRef.current!.value!
      });
      encryptedMessageRef.current!.value = await encrypt({
        message,
        encryptionKeys: privateKey?.toPublic()
      }) as string;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }, [keystoreContext.selectedKey]);

  const SelectedKeypair = () =>
    keystoreContext && (
      <>
        <p className="decrypt-wrapper__selected-key-label">
          {t("CommitteeTools.Decrypt.selected-key-label")}
        </p>
        <div className="decrypt-wrapper__selected-key">
          <div className="box-with-copy">
            <div className="selected-key">
              <div className="selected-key__fish-eye" />
              <span>
                {keystoreContext.selectedKey
                  ? keystoreContext.selectedKey.alias
                  : t("CommitteeTools.Decrypt.no-key-selected")}
              </span>
            </div>
            {keystoreContext.selectedKey && (
              <img
                alt="copy"
                src={CopyIcon}
                onClick={() => {
                  setShowSelectedKeyDetails(true);
                }}
              />
            )}
          </div>
          <button
            className="open-key-list fill"
            onClick={() => {
              setShowSelectKeyModal(true);
            }}
          >
            {t("CommitteeTools.Decrypt.select-keypair")}
          </button>
        </div>
      </>
    );

  return (
    <div className="decrypt-wrapper">
      <h2 className="decrypt-wrapper__title">
        {t("CommitteeTools.Decrypt.decrypt-tool")}
      </h2>
      <p className="decrypt-wrapper__description">
        {t("CommitteeTools.Decrypt.decrypt-description")}
      </p>

      <SelectedKeypair />

      <div className="decrypt-wrapper__textbox-container">
        <p className="decrypt-wrapper__textbox-title">
          {t("CommitteeTools.Decrypt.encrypted-message")}
        </p>
        <HatsFormInput type="textarea" pastable ref={encryptedMessageRef} />
        {error && <div className="error-label">{error}</div>}
        <button onClick={_decrypt} className="fill decrypt-wrapper__button">
          {t("CommitteeTools.Decrypt.decrypt")}
        </button>
      </div>

      <div className="decrypt-wrapper__textbox-container">
        <p className="decrypt-wrapper__textbox-title">
          {t("CommitteeTools.Decrypt.decrypted-message")}
        </p>
        <HatsFormInput type="textarea" copyable ref={decryptedMessageRef} />
        <button onClick={_encrypt} className="fill decrypt-wrapper__button">
          {t("CommitteeTools.Decrypt.encrypt")}
        </button>
      </div>

      {(showSelectKeyModal || showSelectedKeyDetails) && (
        <SelectKeyModal
          showKey={
            showSelectedKeyDetails ? keystoreContext.selectedKey : undefined
          }
          setShowModal={() => {
            if (showSelectedKeyDetails) setShowSelectedKeyDetails(false);
            if (showSelectKeyModal) setShowSelectKeyModal(false);
          }}
        />
      )}
    </div>
  );
}
