import { useTranslation } from "react-i18next";
import { IStoredKey } from "../../../../types/types";
import CopyToClipboard from "../../../Shared/CopyToClipboard";

function KeyDetails({ storedKey, onFinish }: {
    storedKey: IStoredKey
    onFinish: () => any
}) {
    const { t } = useTranslation();

    return (<div className="key-details-container">
        <div className="key-element">
            {t("CommitteeTools.KeyDetails.private-key")}<CopyToClipboard value={storedKey.privateKey} />
            {storedKey.passphrase && <div className="key-element">{t("CommitteeTools.KeyDetails.passphrase")}
                <CopyToClipboard value={storedKey.passphrase} /></div>}
            <div className="key-element">{t("CommitteeTools.KeyDetails.public-key")}<CopyToClipboard value={storedKey.publicKey} /></div>
        </div>
        <button onClick={onFinish}>Back</button>
    </div>)
}

export default KeyDetails