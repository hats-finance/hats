import CopyToClipboard from "components/Shared/CopyToClipboard";
import CheckboxIcon from "assets/icons/checkbox.svg";
import { useState } from "react";
import classNames from "classnames";
import { IStoredKey } from "types/types";
import { useTranslation } from "react-i18next";

export function KeyGenerated({ addedKey, onFinish }: { addedKey: IStoredKey, onFinish: () => void }) {
    const { t } = useTranslation();
    const [sentPublicChecked, setSentPublicChecked] = useState<boolean>();
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
            <p>
                {t("CommitteeTools.keymodal.generated-notice-1")}
                <a
                    className="keymodal-generate__hatsofir"
                    target="_blank"
                    rel="noreferrer"
                    href="https://t.me/Hatsofir"
                >
                    {t("CommitteeTools.keymodal.hatsOfir")}
                </a>
                {t("CommitteeTools.keymodal.generated-notice-2")}
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
            <button disabled={!sentPublicChecked} onClick={onFinish}>
                {t("CommitteeTools.keymodal.done")}
            </button>
        </>
    );
}