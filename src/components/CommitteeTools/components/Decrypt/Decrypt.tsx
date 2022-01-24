import { createMessage, decrypt, encrypt, PrivateKey, readMessage } from "openpgp";
import { useCallback, useRef, useState } from "react";
import { IStoredKey } from "../../../../types/types";
import CopyToClipboard from "../../../Shared/CopyToClipboard";
import Modal from "../../../Shared/Modal";
import { usePrivateKey } from "../../util";
import { useTranslation } from "react-i18next";
import "./index.scss";

export default function Decrypt({ storedKey }: { storedKey: IStoredKey }) {
  const privateKey = usePrivateKey(storedKey);
  const [error, setError] = useState<string>();
  const [showKeyDetails, setShowKeyDetails] = useState(false);
  const encryptedMessageRef = useRef<HTMLTextAreaElement>(null);
  const decryptedMessageRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  const _decrypt = useCallback(async () => {
    try {
      const armoredMessage = encryptedMessageRef.current!.value
      console.log({ armoredMessage, privateKey: privateKey?.armor() })
      const message = await readMessage({ armoredMessage })
      const { data: decrypted } = await decrypt({ message, decryptionKeys: privateKey })
      decryptedMessageRef.current!.value = decrypted
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }, [privateKey])

  const _encrypt = useCallback(async () => {
    try {
      const message = await createMessage({ text: decryptedMessageRef.current!.value })
      encryptedMessageRef.current!.value = await encrypt({ message, encryptionKeys: privateKey?.toPublic() })
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }, [privateKey])

  if (!privateKey) return <></>

  return (
    <div>
      <button onClick={() => setShowKeyDetails(true)}>show key details</button>
      {error && <p>{error}</p>}
      {showKeyDetails && <Modal
        title="Key Details"
        setShowModal={setShowKeyDetails}
      >
        <KeyDetails storedKey={storedKey} privateKey={privateKey} />
      </Modal>}
      <p>{t("CommitteeTools.Decrypt.encrypted-message")}</p>
      <textarea ref={encryptedMessageRef} cols={80} rows={15} />

      <div><button onClick={_decrypt}>Decrypt</button></div>
      <p>Decrypted message</p>
      <textarea ref={decryptedMessageRef} cols={80} rows={15} />
      <div><button onClick={_encrypt}>Encrypt</button></div>
    </div>
  )
}

function KeyDetails({ storedKey, privateKey }: {
  storedKey: IStoredKey
  privateKey: PrivateKey
}) {
  return (
    <div>
      <p>Private Key<CopyToClipboard value={privateKey.armor()} /></p>
      <p>Public Key<CopyToClipboard value={privateKey.toPublic().armor()} /></p>
      {storedKey.passphrase && <p>Passphrase<CopyToClipboard value={storedKey.passphrase} /></p>}
    </div>
  );
}
