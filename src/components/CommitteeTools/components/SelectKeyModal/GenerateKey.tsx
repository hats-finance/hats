import { useContext, useEffect, useRef, useState } from "react";
import { generateKey, PrivateKey } from 'openpgp';
import { useTranslation } from "react-i18next";
import { VaultContext } from "../../store";
import { IStoredKey } from "../../../../types/types";
import { readPrivateKeyFromStoredKey } from "../Decrypt/Decrypt";
import CopyToClipboard from "../../../Shared/CopyToClipboard";

export default function GenerateKey({ onAdded }: { onAdded: () => void }) {
  const aliasRef = useRef<HTMLInputElement>(null);
  const passphraseRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const vaultContext = useContext(VaultContext)
  const [error, setError] = useState<string>()
  const [addedKey, setAddedKey] = useState<IStoredKey>()
  const [privateKey, setPrivateKey] = useState<PrivateKey>();
  const [sentPublicChecked, setSentPublicChecked] = useState<boolean>()

  async function _handleClick() {

    try {
      const alias = aliasRef.current!.value;
      const passphrase = passphraseRef.current?.value;
      const name = nameRef.current!.value;
      const email = emailRef.current!.value;
      const { privateKey } = await generateKey({
        type: 'rsa', // Type of the key, defaults to ECC
        rsaBits: 2048,
        //curve: 'curve25519', // ECC curve name, defaults to curve25519
        userIDs: { name, email }, // { name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
        passphrase: passphrase, // protects the private key
        format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
      });
      const toAdd = { alias, privateKey, passphrase }
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

  useEffect(() => {
    (async () => {
      if (addedKey) {
        setPrivateKey(await readPrivateKeyFromStoredKey(addedKey));
      }
    })()

  }, [addedKey])


  if (addedKey && privateKey) {
    return (<div>
      <h1>{t("CommitteeTools.keymodal.generated-success")}</h1>
      <div>{t("CommitteeTools.keymodal.private-key")}<CopyToClipboard value={privateKey.armor()} /></div>
      {addedKey.passphrase && <div>{t("CommitteeTools.keymodal.passphrase")}<CopyToClipboard value={addedKey.passphrase} /></div>}
      <p>{t("CommitteeTools.keymodal.share-public")}</p>
      <div>{t("CommitteeTools.keymodal.public-key")}<CopyToClipboard value={privateKey?.toPublic().armor()} /></div>
      <div>
        <input type="checkbox" name="didSharePublic" onChange={e => setSentPublicChecked(e.currentTarget.checked)} />
        <label htmlFor="didSharePublic">I have sent <a href="https://t.me/Hatsofir">@hatsofir</a> the public key.</label>
      </div>
      <button disabled={!sentPublicChecked} onClick={onAdded}>Done</button>
    </div>)
  } else return (
    <div>
      <h2>{t("CommitteeTools.keymodal.hello")}</h2>
      <p>{t("CommitteeTools.keymodal.generate-message")}</p>
      <p>{t("CommitteeTools.keymodal.alias")}</p>
      <input ref={aliasRef} type="text" />
      <p>{t("CommitteeTools.keymodal.passphrase")}</p>
      <input ref={passphraseRef} type="text" />


      <p>{t("CommitteeTools.keymodal.name")}</p>
      <input ref={nameRef} type="text" />
      <p>{t("CommitteeTools.keymodal.email")}</p>
      <input ref={emailRef} type="text" />

      <button onClick={_handleClick}>{t("CommitteeTools.keymodal.generate-button")}</button>
      {error && <p>{error}</p>}

    </div>
  )
}
