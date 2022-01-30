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
    if (privateKey) {
        return (<div>
            <div>{t("CommitteeTools.KeyDetails.private-key")}<CopyToClipboard value={privateKey!.armor()} /></div>
            {storedKey.passphrase && <div>{t("CommitteeTools.KeyDetails.passphrase")}<CopyToClipboard value={storedKey.passphrase} /></div>}
            <div>{t("CommitteeTools.KeyDetails.public-key")}<CopyToClipboard value={privateKey!.toPublic().armor()} /></div>
            <button onClick={onFinish}>Back</button>
        </div>)
    } else {
        return (<></>)
    }
}


export default KeyDetails