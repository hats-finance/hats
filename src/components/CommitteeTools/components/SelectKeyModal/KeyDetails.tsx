import { PrivateKey } from "openpgp";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IStoredKey } from "../../../../types/types";
import CopyToClipboard from "../../../Shared/CopyToClipboard";
import { readPrivateKeyFromStoredKey } from "../Decrypt/Decrypt";

function KeyDetails({ storedKey, onFinish }: {
    storedKey: IStoredKey
    onFinish: () => any
}) {
    const { t } = useTranslation();
    const [privateKey, setPrivateKey] = useState<PrivateKey>();

    useEffect(() => {
        (async () => {
            setPrivateKey(await readPrivateKeyFromStoredKey(storedKey));
        })()
    })
    if (!privateKey) return null;
    return (<div className="key-details-container">
        <div className="key-element">
            {t("CommitteeTools.KeyDetails.private-key")}<CopyToClipboard value={privateKey!.armor()} />
            {storedKey.passphrase && <div className="key-element">{t("CommitteeTools.KeyDetails.passphrase")}
                <CopyToClipboard value={storedKey.passphrase} /></div>}
            <div className="key-element">{t("CommitteeTools.KeyDetails.public-key")}<CopyToClipboard value={privateKey!.toPublic().armor()} /></div>
        </div>
        <button onClick={onFinish}>Back</button>
    </div>)
}

export default KeyDetails