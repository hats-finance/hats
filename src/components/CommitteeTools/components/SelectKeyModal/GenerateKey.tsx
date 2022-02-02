import { useContext, useRef, useState } from "react";
import { generateKey } from 'openpgp';
import { useTranslation } from "react-i18next";
import { VaultContext } from "../../store";
import { IStoredKey } from "../../../../types/types";
import CopyToClipboard from "../../../Shared/CopyToClipboard";

export default function GenerateKey({ onFinish }: { onFinish: () => void }) {
  const aliasRef = useRef<HTMLInputElement>(null);
  const passphraseRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const vaultContext = useContext(VaultContext)
  const [error, setError] = useState<string>()
  const [addedKey, setAddedKey] = useState<IStoredKey>()
  const [sentPublicChecked, setSentPublicChecked] = useState<boolean>()

  async function _handleClick() {

    try {
      const alias = aliasRef.current!.value;
      const passphrase = passphraseRef.current?.value;
      const name = nameRef.current!.value;
      const email = emailRef.current!.value;
      const { privateKey, publicKey } = await generateKey({
        type: 'rsa', // Type of the key, defaults to ECC
        rsaBits: 2048,
        //curve: 'curve25519', // ECC curve name, defaults to curve25519
        userIDs: { name, email }, // { name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
        passphrase: passphrase, // protects the private key
        format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
      });
      const toAdd = { alias, privateKey, passphrase, publicKey }
      console.log({ toAdd })
      vaultContext.addKey!(toAdd);
      if (vaultContext.selectedKey === undefined)
        vaultContext.setSelectedAlias!(alias);
      setAddedKey(toAdd)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }


  if (addedKey) {
    return (<div>
      <h1>{t("CommitteeTools.keymodal.generated-success")}</h1>
      <div>{t("CommitteeTools.keymodal.private-key")}<CopyToClipboard value={addedKey.privateKey} /></div>
      {addedKey.passphrase && <div>{t("CommitteeTools.keymodal.passphrase")}<CopyToClipboard value={addedKey.passphrase} /></div>}
      <p>{t("CommitteeTools.keymodal.share-public")}</p>
      <div>{t("CommitteeTools.keymodal.public-key")}<CopyToClipboard value={addedKey.publicKey} /></div>
      <div>
        <input type="checkbox" name="didSharePublic" onChange={e => setSentPublicChecked(e.currentTarget.checked)} />
        <label htmlFor="didSharePublic">I have sent <a href="https://t.me/Hatsofir">@hatsofir</a>the public key.</label>
      </div>
      <button disabled={!sentPublicChecked} onClick={onFinish}>{t("CommitteeTools.keymodal.done")}</button>
    </div>)
  } else return (
    <div>
      <p>{t("CommitteeTools.keymodal.generate-message")}</p>
      <label>{t("CommitteeTools.keymodal.alias")}</label>
      <input ref={aliasRef} type="text" />
      <label>{t("CommitteeTools.keymodal.passphrase")}</label>
      <input ref={passphraseRef} type="text" />
      <label>{t("CommitteeTools.keymodal.name")}</label>
      <input ref={nameRef} type="text" />
      <label>{t("CommitteeTools.keymodal.email")}</label>
      <input ref={emailRef} type="text" />
      <div className="buttons-with-cancel">
        <button onClick={_handleClick}>
          {t("CommitteeTools.keymodal.generate-button")}</button>
      </div>
      {error && <p>{error}</p>}

    </div>
  )
}
