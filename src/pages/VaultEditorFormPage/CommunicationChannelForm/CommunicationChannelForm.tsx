import { useState } from "react";
import { readKey } from "openpgp";
import { useTranslation } from "react-i18next";
import Tooltip from "rc-tooltip";
import { KeyManager } from "components/Keystore";
import { FormInput } from "components";
import InfoIcon from "assets/icons/info.icon";
import DownArrowIcon from "assets/icons/down-arrow.icon.svg";
import UpArrowIcon from "assets/icons/up-arrow.icon.svg";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../../../constants/constants";
import { StyledCommunicationChannelForm, StyledHelper } from "./styles";
import { useFieldArray, useFormContext } from "react-hook-form";

const tooltipStyle = {
  ...RC_TOOLTIP_OVERLAY_INNER_STYLE,
  maxWidth: 500,
};

export function CommunicationChannelForm() {
  const { t } = useTranslation();
  const [showMobileHint, setShowMobileHint] = useState<boolean>(false);
  const [publicPgpKey, setPublicPgpKey] = useState<string>();
  const [pgpError, setPgpError] = useState<string>();

  const { control, watch } = useFormContext();
  const basePath = "communication-channel.pgp-pk";
  const { fields: keys, append, remove } = useFieldArray({ control, name: basePath });
  //const publicKeys: string[] = typeof keys === "string" ? (keys === "" ? [] : [keys]) : keys;

  const addPublicKey = async (publicPgpKey) => {
    setPgpError(undefined);
    if (publicPgpKey) {
      try {
        await readKey({ armoredKey: publicPgpKey });
        if (keys.includes(publicPgpKey)) {
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
    <StyledCommunicationChannelForm>
      {getHelperComponent()}

      <p className="description">{t("VaultEditor.pgp-key-description")}</p>

      <KeyManager
        onSelected={(selectedKey) => {
          if (selectedKey) setPublicPgpKey(selectedKey.publicKey);
        }}
      />

      <div>
        <label>{t("VaultEditor.pgp-key")}</label>
        <FormInput
          name="communication-channel.pgp-pk"
          type="textarea"
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

        {keys.length > 0 && (
          <div className="key-list">
            {keys.map((key, index) => (
              <div key={key.id} className="key-card">
                <div className="key-number">{index + 1}</div>
                <div className="key-content">
                  <span>{watch(`${basePath}.${index}`)}</span>
                  <button onClick={() => remove(index)}>{t("VaultEditor.remove-pgp")}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StyledCommunicationChannelForm>
  );
}