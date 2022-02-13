import { useContext, useRef, useState } from "react";
import { generateKey } from "openpgp";
import { VaultContext } from "../../store";
import { IStoredKey } from "types/types";
import Loading from 'assets/icons/loading.svg';
import classNames from "classnames";
import { t } from "i18next";
import { KeyGenerated } from "./KeyGenerated";

export default function GenerateKey({ onFinish }: { onFinish: () => void }) {
  const [alias, setAlias] = useState("");
  const passphraseRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const vaultContext = useContext(VaultContext);
  const [error, setError] = useState<string>();
  const [addedKey, setAddedKey] = useState<IStoredKey>();
  const [loading, setLoading] = useState<boolean>(false);

  async function _handleClick() {
    try {
      setLoading(true);
      const passphrase = passphraseRef.current?.value;
      const name = nameRef.current!.value;
      const email = emailRef.current!.value;
      const { privateKey, publicKey } = await generateKey({
        type: "rsa", // Type of the key, defaults to ECC
        rsaBits: 2048,
        //curve: 'curve25519', // ECC curve name, defaults to curve25519
        userIDs: { name, email }, // { name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
        passphrase: passphrase, // protects the private key
        format: "armored" // output key format, defaults to 'armored' (other options: 'binary' or 'object')
      });
      const toAdd = { alias, privateKey, passphrase, publicKey };
      vaultContext.addKey(toAdd);
      if (vaultContext.selectedKey === undefined)
        vaultContext.setSelectedAlias(alias);
      setAddedKey(toAdd);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setLoading(false);
    }
  }

  if (addedKey) {
    return <KeyGenerated addedKey={addedKey} onFinish={onFinish} />
  } else {
    return (
      <>
        <p className="keymodal-generate__intro">
          {t("CommitteeTools.keymodal.generate-message")}
        </p>
        <label>{t("CommitteeTools.keymodal.alias")}</label>
        <input
          className="keymodal-generate__input"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          type="text"
          placeholder={t("CommitteeTools.keymodal.enter-alias-placeholder")}
        />
        <label>{t("CommitteeTools.keymodal.passphrase")}</label>
        <input
          className="keymodal-generate__input"
          ref={passphraseRef}
          type="text"
          placeholder={t(
            "CommitteeTools.keymodal.enter-passphrase-placeholder"
          )}
        />
        <label>{t("CommitteeTools.keymodal.name")}</label>
        <input
          className="keymodal-generate__input"
          ref={nameRef}
          type="text"
          placeholder={t("CommitteeTools.keymodal.enter-name-placeholder")}
        />
        <label>{t("CommitteeTools.keymodal.email")}</label>
        <input
          className="keymodal-generate__input"
          ref={emailRef}
          type="text"
          placeholder={t("CommitteeTools.keymodal.enter-email-placeholder")}
        />
        <button
          onClick={_handleClick}
          disabled={loading || !alias}
          className={classNames({ loading: loading })}>
          {t("CommitteeTools.keymodal.generate-button")}
        </button>
        {loading && <div className="loading-icon"><img src={Loading} alt="loading" /></div>}
        {error && <div className="error-label">{error}</div>}
      </>
    );
  }
}
