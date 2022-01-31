import { createMessage, decrypt, encrypt, readMessage } from "openpgp";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IStoredKey } from "../../../../types/types";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { VaultContext } from "../../store";
import { decryptKey, readPrivateKey } from "openpgp";
import SelectKeyModal from "../SelectKeyModal/SelectKeyModal";
import { useLocation } from "react-router-dom";
import EditableContent from "../EditableContent/EditableContent";

export async function readPrivateKeyFromStoredKey({ passphrase, privateKey }: IStoredKey) {
  return passphrase ? await decryptKey({
    privateKey: await readPrivateKey({ armoredKey: privateKey }),
    passphrase
  }) : await readPrivateKey({ armoredKey: privateKey })
}


export default function Decrypt() {
  const vaultContext = useContext(VaultContext)
  const [showSelectKeyModal, setShowSelectKeyModal] = useState(false)
  const [error, setError] = useState<string>();
  const encryptedMessageRef = useRef<HTMLDivElement>(null);
  const decryptedMessageRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();


  const location = useLocation()

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.ipfsjson) {
      (async () => {
        const response = await fetch(params.ipfsjson)
        const json = await response.json()
        encryptedMessageRef.current!.textContent = json.message

      })()

    }

  }, [location.search])

  useEffect(() => {
    if (vaultContext.vault?.storedKeys.length === 0 || !vaultContext.selectedKey === undefined) {
      setShowSelectKeyModal(true)
    }
  }, [vaultContext.vault, vaultContext.selectedKey])

  const _decrypt = useCallback(async () => {
    try {
      if (!vaultContext.selectedKey) {
        setShowSelectKeyModal(true)
        return
      }

      const armoredMessage = encryptedMessageRef.current!.textContent

      if (!armoredMessage || armoredMessage === "") {
        throw new Error("No message to decrypt")
      }


      const privateKey = await readPrivateKeyFromStoredKey(vaultContext.selectedKey)
      const message = await readMessage({ armoredMessage })
      const { data: decrypted } = await decrypt({ message, decryptionKeys: privateKey })
      decryptedMessageRef.current!.textContent = decrypted
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        console.log(error)
      }
    }
  }, [vaultContext.selectedKey])

  const _encrypt = useCallback(async () => {
    try {
      setError("")
      if (!vaultContext.selectedKey) {
        setShowSelectKeyModal(true)
        return
      }
      const privateKey = await readPrivateKeyFromStoredKey(vaultContext.selectedKey)
      const message = await createMessage({ text: decryptedMessageRef.current!.textContent! })
      encryptedMessageRef.current!.textContent = await encrypt({ message, encryptionKeys: privateKey?.toPublic() })
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }, [vaultContext.selectedKey])

  return (
    <div>
      <button onClick={() => {
        setShowSelectKeyModal(true)
      }}>{t("CommitteeTools.Decrypt.select-keypair")}</button>
      <p>{t("CommitteeTools.Decrypt.encrypted-message")}</p>
      <EditableContent pastable ref={encryptedMessageRef} />
      {error && <p>{error}</p>}
      <div><button onClick={_decrypt}>Decrypt</button></div>
      <p>{t("CommitteeTools.Decrypt.decrypted-message")}</p>
      <EditableContent copyable ref={decryptedMessageRef} />
      <div><button onClick={_encrypt}>Encrypt</button></div>
      {showSelectKeyModal && <SelectKeyModal
        onSelectKey={() => {
        }}
        setShowModal={setShowSelectKeyModal} />}

    </div>
  )
}

