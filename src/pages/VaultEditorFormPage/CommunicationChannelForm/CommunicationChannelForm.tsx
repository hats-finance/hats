import { useState } from "react";
import { readKey } from "openpgp";
import { useTranslation } from "react-i18next";
import Tooltip from "rc-tooltip";
import { KeyManager } from "components/Keystore";
import { HatsFormInput } from "components";
import InfoIcon from "assets/icons/info.icon";
import DownArrowIcon from "assets/icons/down-arrow.icon.svg";
import UpArrowIcon from "assets/icons/up-arrow.icon.svg";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../../../constants/constants";
import { IVaultDescription } from "types/types";
import { StyledCommunicationChannelForm, StyledHelper } from "./styles";

const tooltipStyle = {
  ...RC_TOOLTIP_OVERLAY_INNER_STYLE,
  maxWidth: 500,
};

type CommunicationChannelFormProps = {
  communicationChannel: IVaultDescription["communication-channel"];
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  addPgpKey: (key: string) => void;
  removePgpKey: (index: number) => void;
};

export function CommunicationChannelForm({
  communicationChannel,
  onChange,
  addPgpKey,
  removePgpKey,
}: CommunicationChannelFormProps) {
  const { t } = useTranslation();
  const [showMobileHint, setShowMobileHint] = useState<boolean>(false);
  const [publicPgpKey, setPublicPgpKey] = useState<string>();
  const [pgpError, setPgpError] = useState<string>();

  const keys = communicationChannel["pgp-pk"];
  const publicKeys: string[] = typeof keys === "string" ? (keys === "" ? [] : [keys]) : keys;

  const addPublicKey = async (publicPgpKey) => {
    setPgpError(undefined);
    if (publicPgpKey) {
      try {
        await readKey({ armoredKey: publicPgpKey });
        if (publicKeys.includes(publicPgpKey)) {
          throw new Error("Key already added");
        }
        addPgpKey(publicPgpKey);
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
        <HatsFormInput
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

        {publicKeys.length > 0 && (
          <div className="key-list">
            {publicKeys.map((key, index) => (
              <div key={index} className="key-card">
                <div className="key-number">{index + 1}</div>
                <div className="key-content">
                  <span>{key.split("\n")[2].substring(0, 30) + "..."}</span>
                  <button onClick={() => removePgpKey(index)}>{t("VaultEditor.remove-pgp")}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StyledCommunicationChannelForm>
  );
}