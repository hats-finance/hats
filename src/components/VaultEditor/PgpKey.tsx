import { VaultContext } from "components/CommitteeTools/store";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SelectKeyModal from "components/CommitteeTools/components/SelectKeyModal/SelectKeyModal";
import CreateVaultModal from "components/CommitteeTools/components/CreateVaultModal/CreateVaultModal";
import UnlockVaultModal from "components/CommitteeTools/components/UnlockVaultModal/UnlockVaultModal";
import CopyIcon from "assets/icons/copy.icon.svg";


export default function PgpKey({ onSelected }) {
  const [showSelectKeyModal, setShowSelectKeyModal] = useState(false);
  const [showSelectedKeyDetails, setShowSelectedKeyDetails] = useState(false);
  const [showCreateVault, setShowCreateVault] = useState(false);
  const [showUnlockVault, setShowUnlockVault] = useState(false);

  const vaultContext = useContext(VaultContext);
  const { t } = useTranslation();

  useEffect(() => {
    onSelected(vaultContext.selectedKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultContext.selectedKey])

  const SelectedKeypair = () =>
    vaultContext && (
      <div className="decrypt-wrapper__selected-key">
        <div className="box-with-copy">
          <div className="selected-key">
            <div className="selected-key__fish-eye" />
            <span>
              {vaultContext.selectedKey
                ? vaultContext.selectedKey.alias
                : t("CommitteeTools.Decrypt.no-key-selected")}
            </span>
          </div>
          {vaultContext.selectedKey && (
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
      {!vaultContext.isLocked && <SelectedKeypair />}
      {(showSelectKeyModal || showSelectedKeyDetails) && (
        <SelectKeyModal
          showKey={
            showSelectedKeyDetails ? vaultContext.selectedKey : undefined
          }
          setShowModal={() => {
            if (showSelectedKeyDetails) setShowSelectedKeyDetails(false);
            if (showSelectKeyModal) setShowSelectKeyModal(false);
          }}
        />
      )}
      {vaultContext.isCreated && vaultContext.isLocked && (<>
        <button onClick={() => setShowUnlockVault(true)} className="fill">{t("CommitteeTools.unlock-vault")}</button>
      </>)}

      {!vaultContext.isCreated && (<>
        <button onClick={() => setShowCreateVault(true)} className="fill">{t("CommitteeTools.create-vault")}</button>
      </>)}
      {showCreateVault && !vaultContext.isCreated && (
        <CreateVaultModal setShowModal={setShowCreateVault} />
      )}
      {showUnlockVault && vaultContext.isLocked && (
        <UnlockVaultModal setShowModal={setShowUnlockVault} />
      )}
    </div>
  )
}