import { useState } from "react";
import { CopyToClipboard } from "components";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import CheckboxIcon from "assets/icons/checkbox.svg";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { IStoredKey } from "../../types";

export function KeyGenerated({ addedKey, onFinish }: { addedKey: IStoredKey; onFinish: () => void }) {
  const { t } = useTranslation();
  const [sentPublicChecked, setSentPublicChecked] = useState<boolean>();
  return (
    <>
      <p className="keymodal-generate__intro">{t("CommitteeTools.keymodal.generated-success")}</p>
      <div className="keymodal-generate__result-copy">
        <span className="keymodal-generate__result-label">{t("CommitteeTools.keymodal.private-key")}</span>
        <CopyToClipboard valueToCopy={addedKey.privateKey} />
      </div>
      {addedKey.passphrase && (
        <div className="keymodal-generate__result-copy">
          <span className="keymodal-generate__result-label">{t("CommitteeTools.keymodal.passphrase")}</span>
          <CopyToClipboard valueToCopy={addedKey.passphrase} />
        </div>
      )}
      <div className="keymodal-generate__result-copy">
        <span className="keymodal-generate__result-label">{t("CommitteeTools.keymodal.public-key")}</span>
        <CopyToClipboard valueToCopy={addedKey.publicKey} />
      </div>
      <p>
        {t("CommitteeTools.keymodal.generated-notice-1")}
        <a {...defaultAnchorProps} className="keymodal-generate__hatsofir" href="https://t.me/Hatsofir">
          {t("CommitteeTools.keymodal.hatsOfir")}
        </a>
        {t("CommitteeTools.keymodal.generated-notice-2")}
      </p>
      <div
        className={classNames("keymodal-generate__confirm", {
          "keymodal-generate__confirm--checked": sentPublicChecked,
        })}
      >
        <label htmlFor="didSharePublic" className="keymodal-generate__confirm-icon">
          <input type="checkbox" id="didSharePublic" onChange={(e) => setSentPublicChecked(e.currentTarget.checked)} />
          <span>
            <img src={CheckboxIcon} alt="" />
          </span>
          <p>
            {t("CommitteeTools.keymodal.generated-notice-6")}{" "}
            <a {...defaultAnchorProps} className="keymodal-generate__hatsofir" href="https://t.me/Hatsofir">
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
