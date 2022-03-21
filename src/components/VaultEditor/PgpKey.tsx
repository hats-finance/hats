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

export default function PgpKey({ communicationChannel, onChange }) {
  const { t } = useTranslation();
  const [showMobileHint, setShowMobileHint] = useState<boolean>(false);

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
      <button className="fill">{t("VaultEditor.go-to-tool")}</button>
      <div>
        <label>{t("VaultEditor.pgp-key")}</label>
        <EditableContent
          name="communication-channel.pgp-pk"
          pastable
          value={communicationChannel["pgp-pk"]}
          onChange={onChange}
          placeholder={t("VaultEditor.pgp-key-placeholder")}
        />
      </div>
      <div>
        <label>{t("VaultEditor.committee-bot")}</label>
        <EditableContent
          textInput
          name="communication-channel.committee-bot"
          value={communicationChannel["committee-bot"]}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
