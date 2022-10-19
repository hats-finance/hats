import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { KeystoreContext, SelectKeyModal, UnlockKeystoreModal, CreateKeystoreModal, KeyDetailsModal } from "components/Keystore";
import useModal from "hooks/useModal";
import CopyIcon from "assets/icons/copy.icon.svg";
import { StyledKeyManager } from "./styles";

export function KeyManager({ onSelected }) {
  const { isShowing: isShowingKeyDetails, show: showKeyDetails, hide: hideKeyDetails } = useModal();
  const { isShowing: isShowingSelectKey, show: showSelectKey, hide: hideSelectKey } = useModal();
  const { isShowing: isShowingUnlockKeystore, show: showUnlockKeystore, hide: hideUnlockKeystore } = useModal();
  const { isShowing: isShowingCreateKeystore, show: showCreateKeystore, hide: hideCreateKeystore } = useModal();

  const keystoreContext = useContext(KeystoreContext);
  const { t } = useTranslation();

  useEffect(() => {
    onSelected(keystoreContext.selectedKey);
  }, [keystoreContext.selectedKey, onSelected]);

  const SelectedKeypair = () =>
    keystoreContext && (
      <StyledKeyManager>
        <div className="box-with-copy">
          <div className="selected-key">
            <div className="selected-key__fish-eye" />
            <span>
              {keystoreContext.selectedKey ? keystoreContext.selectedKey.alias : t("CommitteeTools.Decrypt.no-key-selected")}
            </span>
          </div>
          {keystoreContext.selectedKey && <img alt="copy" src={CopyIcon} onClick={showKeyDetails} />}
        </div>

        <button type="button" className="open-key-list fill" onClick={showSelectKey}>
          {t("CommitteeTools.Decrypt.select-keypair")}
        </button>
      </StyledKeyManager>
    );

  return (
    <div>
      {!keystoreContext.isLocked && <SelectedKeypair />}

      {keystoreContext.isCreated && keystoreContext.isLocked && (
        <button type="button" onClick={showUnlockKeystore} className="fill">
          {t("CommitteeTools.unlock-vault")}
        </button>
      )}

      {!keystoreContext.isCreated && (
        <button type="button" onClick={showCreateKeystore} className="fill">
          {t("CommitteeTools.create-vault")}
        </button>
      )}

      {keystoreContext.selectedKey && (
        <KeyDetailsModal keyToShow={keystoreContext.selectedKey} isShowing={isShowingKeyDetails} onHide={hideKeyDetails} />
      )}
      <SelectKeyModal isShowing={isShowingSelectKey} onHide={hideSelectKey} />
      <CreateKeystoreModal isShowing={isShowingCreateKeystore && !keystoreContext.isCreated} onHide={hideCreateKeystore} />
      <UnlockKeystoreModal isShowing={isShowingUnlockKeystore && keystoreContext.isLocked} onHide={hideUnlockKeystore} />
    </div>
  );
}
