import { useContext, useRef, useState } from "react";
import { generateKey } from "openpgp";
import { useTranslation } from "react-i18next";
import { VaultContext } from "../../store";
import { IStoredKey } from "types/types";
import CopyToClipboard from "components/Shared/CopyToClipboard";
import CheckboxIcon from "assets/icons/checkbox.svg";
import classNames from "classnames";

export default function GenerateKey({ onFinish }: { onFinish: () => void }) {
  const aliasRef = useRef<HTMLInputElement>(null);
  const passphraseRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const vaultContext = useContext(VaultContext);
  const [error, setError] = useState<string>();
  const [addedKey, setAddedKey] = useState<IStoredKey>();
  const [sentPublicChecked, setSentPublicChecked] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  async function _handleClick() {
    try {
      setLoading(true);
      const alias = aliasRef.current!.value;
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
      console.log({ toAdd });
      vaultContext.addKey!(toAdd);
      if (vaultContext.selectedKey === undefined)
        vaultContext.setSelectedAlias!(alias);
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
    return (
      <>
        <p className="keymodal-generate__intro">
          {t("CommitteeTools.keymodal.generated-success")}
        </p>
        <div className="keymodal-generate__result-copy">
          <span className="keymodal-generate__result-label">
            {t("CommitteeTools.keymodal.private-key")}
          </span>
          <CopyToClipboard value={addedKey.privateKey} />
        </div>
        {addedKey.passphrase && (
          <div className="keymodal-generate__result-copy">
            <span className="keymodal-generate__result-label">
              {t("CommitteeTools.keymodal.passphrase")}
            </span>
            <CopyToClipboard value={addedKey.passphrase} />
          </div>
        )}
        <div className="keymodal-generate__result-copy">
          <span className="keymodal-generate__result-label">
            {t("CommitteeTools.keymodal.public-key")}
          </span>
          <CopyToClipboard value={addedKey.publicKey} />
        </div>
        <p>{t("CommitteeTools.keymodal.generated-notice-1")}</p>
        <p>{t("CommitteeTools.keymodal.generated-notice-2")}</p>
        <p>{t("CommitteeTools.keymodal.generated-notice-3")}</p>
        <p>
          {t("CommitteeTools.keymodal.generated-notice-4")}{" "}
          <a
            className="keymodal-generate__hatsofir"
            target="_blank"
            rel="noreferrer"
            href="https://t.me/Hatsofir"
          >
            {t("CommitteeTools.keymodal.hatsOfir")}
          </a>
          {t("CommitteeTools.keymodal.generated-notice-5")}
        </p>
        <div
          className={classNames("keymodal-generate__confirm", {
            "keymodal-generate__confirm--checked": sentPublicChecked
          })}
        >
          <label
            htmlFor="didSharePublic"
            className="keymodal-generate__confirm-icon"
          >
            <input
              type="checkbox"
              id="didSharePublic"
              onChange={(e) => setSentPublicChecked(e.currentTarget.checked)}
            />
            <span>
              <img src={CheckboxIcon} alt="" />
            </span>
            <p>
              {t("CommitteeTools.keymodal.generated-notice-6")}{" "}
              <a
                className="keymodal-generate__hatsofir"
                target="_blank"
                rel="noreferrer"
                href="https://t.me/Hatsofir"
              >
                {t("CommitteeTools.keymodal.hatsOfir")}
              </a>
              {t("CommitteeTools.keymodal.generated-notice-7")}
            </p>
          </label>
        </div>
        <div className="keymodal-generate__button-done">
          <button disabled={!sentPublicChecked} onClick={onFinish}>
            {t("CommitteeTools.keymodal.done")}
          </button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <p className="keymodal-generate__intro">
          {t("CommitteeTools.keymodal.generate-message")}
        </p>
        <label>{t("CommitteeTools.keymodal.alias")}</label>
        <input
          className="keymodal-generate__input"
          ref={aliasRef}
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
        <div className="keymodal-generate__button-container">
          <button
            onClick={_handleClick}
            disabled={loading}
            className={classNames({ loading: loading })}
          >
            {t("CommitteeTools.keymodal.generate-button")}
          </button>
        </div>
        {error && <p>{error}</p>}
      </>
    );
  }
}
