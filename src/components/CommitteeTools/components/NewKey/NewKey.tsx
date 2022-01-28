import { useContext, useRef } from "react";
import { generateKey } from 'openpgp';
import { useTranslation } from "react-i18next";
import "./index.scss";
import { VaultContext } from "../../store";
import { IStoredKey } from "../../../../types/types";

export default function NewKey({ onAdded }: { onAdded: (added: IStoredKey) => void }) {
  const aliasRef = useRef<HTMLInputElement>(null);
  const passphraseRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const vaultContext = useContext(VaultContext)

  async function _handleClick() {

    const alias = aliasRef.current!.value;
    const passphrase = passphraseRef.current?.value;
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
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
    onAdded(toAdd)
  }

  return (
    <div>
      <p>{t("CommitteeTools.NewKey.hello")}</p>
      <p>Please generate private and public PGP keys by creating an alias and a passphrase.</p>
      <p>Alias</p>
      <input ref={aliasRef} type="text" />
      <p>Passphrase</p>
      <p>Please notice,your passphrase isn’t saved to local storage! please save it as you see fit.</p>
      <input ref={passphraseRef} type="text" />


      <p>Name</p>
      <input ref={nameRef} type="text" />
      <p>Email</p>
      <input ref={emailRef} type="text" />

      <p>Min 6 chars</p>
      <button onClick={_handleClick}>Generate key pair </button>

    </div>
  )
}
