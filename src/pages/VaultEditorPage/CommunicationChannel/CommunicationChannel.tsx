import { useState } from "react";
import { readKey } from "openpgp";
import { useTranslation } from "react-i18next";
import Tooltip from "rc-tooltip";
import { KeyManager } from "components/Keystore";
import { EditableContent } from "components";
import InfoIcon from "assets/icons/info.icon";
import DownArrowIcon from "assets/icons/down-arrow.icon.svg";
import UpArrowIcon from "assets/icons/up-arrow.icon.svg";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../../../constants/constants";
import { IVaultDescription } from "types/types";
import { StyledCommunicationChannel, StyledHelper } from "./styles";
import { useFieldArray, useFormContext } from "react-hook-form";

const tooltipStyle = {
  ...RC_TOOLTIP_OVERLAY_INNER_STYLE,
  maxWidth: 500,
};


export function CommunicationChannel() {
  const { t } = useTranslation();
  const [showMobileHint, setShowMobileHint] = useState<boolean>(false);
  const [publicPgpKey, setPublicPgpKey] = useState<string>();
  const [pgpError, setPgpError] = useState<string>();
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "project-metadata.communication-channel.pgp-pk"
  })
  const keys = fields.map((field, index) => 
  });
const publicKeys: string[] = typeof keys === "string" ? (keys === "" ? [] : [keys]) : keys;

const addPublicKey = async (publicPgpKey) => {
  setPgpError(undefined);
  if (publicPgpKey) {
    try {
      await readKey({ armoredKey: publicPgpKey });
      if (publicKeys.includes(publicPgpKey)) {
        throw new Error("Key already added");
      }
      append(publicPgpKey);
    } catch (error: any) {
      setPgpError(error.message);
    }
  }
};

const getHelperComponent = () => {
  const TooltipComponent = () => (
    <>
      {t("VaultEditor.pgp-key-hint-1")}
      <Tooltip
        placement="top"
        overlayClassName="hint-tooltip"
        overlayInnerStyle={tooltipStyle}
        overlay={t("VaultEditor.pgp-key-hint-tooltip")}>
        <InfoIcon className="onlyDesktop" width="15" height="15" fill={Colors.white} />
      </Tooltip>
      {t("VaultEditor.pgp-key-hint-2")}
    </>
  );

  const HintComponent = () => (
    <div className="onlyMobile">
      <div className="hint-question" onClick={() => setShowMobileHint((old) => !old)}>
        {t("VaultEditor.pgp-key-hint-question")}
        {showMobileHint ? (
          <img src={UpArrowIcon} alt="down arrow" width={12} />
        ) : (
          <img src={DownArrowIcon} alt="down arrow" width={12} />
        )}
      </div>

      <div className={`hint-tooltip ${showMobileHint ? "show" : ""}`}>{t("VaultEditor.pgp-key-hint-tooltip")}</div>
    </div>
  );

  return (
    <StyledHelper>
      <TooltipComponent />
      <HintComponent />
    </StyledHelper>
  );
};

return (
  <StyledCommunicationChannel>
    {getHelperComponent()}

    <p className="description">{t("VaultEditor.pgp-key-description")}</p>

    <KeyManager
      onSelected={(selectedKey) => {
        if (selectedKey) setPublicPgpKey(selectedKey.publicKey);
      }}
    />

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
        <div className="key-list">
          {publicKeys.map((key, index) => (
            <div key={index} className="key-card">
              <div className="key-number">{index + 1}</div>
              <div className="key-content">
                <span>{key.split("\n")[2].substring(0, 30) + "..."}</span>
                <button onClick={() => remove(index)}>{t("VaultEditor.remove-pgp")}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </StyledCommunicationChannel>
);
}
