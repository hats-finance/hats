import { KeystoreContext, SelectKeyModal, UnlockKeystoreModal, CreateKeystoreModal } from "components/Keystore";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CopyIcon from "assets/icons/copy.icon.svg";

export function KeyManager({ onSelected }) {
  const [showSelectKeyModal, setShowSelectKeyModal] = useState(false);
  const [showSelectedKeyDetails, setShowSelectedKeyDetails] = useState(false);
  const [showCreateVault, setShowCreateVault] = useState(false);
  const [showUnlockVault, setShowUnlockVault] = useState(false);

  const keystoreContext = useContext(KeystoreContext);
  const { t } = useTranslation();

  useEffect(() => {
    onSelected(keystoreContext.selectedKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keystoreContext.selectedKey])

  const SelectedKeypair = () =>
    keystoreContext && (
      <div className="decrypt-wrapper__selected-key">
        <div className="box-with-copy">
          <div className="selected-key">
            <div className="selected-key__fish-eye" />
            <span>
              {keystoreContext.selectedKey
                ? keystoreContext.selectedKey.alias
                : t("CommitteeTools.Decrypt.no-key-selected")}
            </span>
          </div>
          {keystoreContext.selectedKey && (
            <img
              alt="copy"
              src={CopyIcon}
              onClick={() => {
                setShowSelectedKeyDetails(true);
              }}
            />
          )}
        </div>
        <button
          className="open-key-list fill"
          onClick={() => {
            setShowSelectKeyModal(true);
          }}
        >
          {t("CommitteeTools.Decrypt.select-keypair")}
        </button>
      </div>
    );

  return (
    <div>
      {!keystoreContext.isLocked && <SelectedKeypair />}
      {(showSelectKeyModal || showSelectedKeyDetails) && (
        <SelectKeyModal
          showKey={
            showSelectedKeyDetails ? keystoreContext.selectedKey : undefined
          }
          setShowModal={() => {
            if (showSelectedKeyDetails) setShowSelectedKeyDetails(false);
            if (showSelectKeyModal) setShowSelectKeyModal(false);
          }}
        />
      )}
      {keystoreContext.isCreated && keystoreContext.isLocked && (<>
        <button onClick={() => setShowUnlockVault(true)} className="fill">{t("CommitteeTools.unlock-vault")}</button>
      </>)}

      {!keystoreContext.isCreated && (<>
        <button onClick={() => setShowCreateVault(true)} className="fill">{t("CommitteeTools.create-vault")}</button>
      </>)}
      {showCreateVault && !keystoreContext.isCreated && (
        <CreateKeystoreModal setShowModal={setShowCreateVault} />
      )}
      {showUnlockVault && keystoreContext.isLocked && (
        <UnlockKeystoreModal />
      )}
    </div>
  )
}