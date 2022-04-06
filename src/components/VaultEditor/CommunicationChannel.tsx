import { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Tooltip from "rc-tooltip";
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import InfoIcon from "assets/icons/info.icon";
import DownArrowIcon from "assets/icons/down-arrow.icon.svg";
import UpArrowIcon from "assets/icons/up-arrow.icon.svg";
import {
    Colors,
    RC_TOOLTIP_OVERLAY_INNER_STYLE
} from "../../constants/constants";
import PgpKey from "./PgpKey";
import { readKey } from "openpgp";

export default function CommunicationChannel({ communicationChannel, onChange, addPgpKey, removePgpKey }) {
    const { t } = useTranslation();
    const [showMobileHint, setShowMobileHint] = useState<boolean>(false);
    const [publicPgpKey, setPublicPgpKey] = useState<string>()
    const [pgpError, setPgpError] = useState<string>()
    const keys = communicationChannel["pgp-pk"]
    const publicKeys = typeof keys === "string" ? keys === "" ? [] : [keys] : communicationChannel["pgp-pk"];

    const addPublicKey = async (publicPgpKey) => {
        setPgpError(undefined)
        if (publicPgpKey) {
            try {
                await readKey({ armoredKey: publicPgpKey })
                if (publicKeys.includes(publicPgpKey)) {
                    throw new Error("Key already added")
                }
                addPgpKey(publicPgpKey)
            } catch (error: any) {
                setPgpError(error.message)
            }
        }
    }

    return (
        <div className="pgp-key">
            <div className="pgp-key__hint">
                {t("VaultEditor.pgp-key-hint-1")}
                <Tooltip
                    placement="top"
                    overlayClassName="tooltip"
                    overlayInnerStyle={{
                        ...RC_TOOLTIP_OVERLAY_INNER_STYLE,
                        maxWidth: 500
                    }}
                    overlay={t("VaultEditor.pgp-key-hint-tooltip")}
                >
                    <span className="pgp-key__hint-desk-tooltip">
                        <InfoIcon width="15" height="15" fill={Colors.white} />
                    </span>
                </Tooltip>
                {t("VaultEditor.pgp-key-hint-2")}

                <div className="mobile-only">
                    <div
                        className="pgp-key__hint-question"
                        onClick={() => setShowMobileHint((old) => !old)}
                    >
                        {t("VaultEditor.pgp-key-hint-question")}
                        {showMobileHint && (
                            <img
                                src={DownArrowIcon}
                                alt="down arrow"
                                width={12}
                                height={12}
                            />
                        )}
                        {!showMobileHint && (
                            <img src={UpArrowIcon} alt="up arrow" width={12} height={12} />
                        )}
                    </div>

                    <div
                        className={classNames("pgp-key__hint-tooltip", {
                            "pgp-key__hint-tooltip--show": showMobileHint
                        })}
                    >
                        {t("VaultEditor.pgp-key-hint-tooltip")}
                    </div>
                </div>
            </div>
            <p className="vault-editor__section-description">
                {t("VaultEditor.pgp-key-description")}
                <br></br>

                <br></br>
            </p>
            <PgpKey onSelected={selectedKey => {
                if (selectedKey) setPublicPgpKey(selectedKey.publicKey)
            }} />
            <div>
                <label>{t("VaultEditor.pgp-key")}</label>
                <EditableContent
                    name="communication-channel.pgp-pk"
                    pastable
                    colorable
                    value={publicPgpKey}
                    onChange={(e) => setPublicPgpKey(e.target.value)}
                    placeholder={t("VaultEditor.pgp-key-placeholder")}
                />
            </div>

            <div>
                <button onClick={() => addPublicKey(publicPgpKey)}>{t("VaultEditor.add-pgp")}</button>
                {pgpError && <div>{pgpError}</div>}
                {publicKeys.length > 0 && (
                    <div className="pgp-key__list">
                        {publicKeys.map((key, index) => (
                            <div key={index} className="pgp-key__list-key">
                                <div className="pgp-key__list-key-number">{index + 1}</div>
                                <div className="pgp-key__list-key-content">
                                    <span>{key.split("\n")[2].substring(0, 30) + "..."}</span>
                                    <button onClick={() => removePgpKey(index)}>{t("VaultEditor.remove-pgp")}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <label>{t("VaultEditor.committee-bot")}</label>
                <EditableContent
                    textInput
                    colorable
                    name="communication-channel.committee-bot"
                    value={communicationChannel["committee-bot"]}
                    onChange={onChange}
                />
            </div>

        </div >
    );
}