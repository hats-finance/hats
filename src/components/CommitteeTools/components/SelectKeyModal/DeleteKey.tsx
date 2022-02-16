import { useContext } from "react";
import { IStoredKey } from "../../../../types/types";
import { VaultContext } from "../../store";
import { t } from "i18next";

function DeleteKey({
  keyToDelete,
  onFinish
}: {
  keyToDelete: IStoredKey;
  onFinish: () => any;
}) {
  const vaultContext = useContext(VaultContext);

  return (
    <>
      <p className="keymodal-delete__description">
        {t("CommitteeTools.keymodal.delete-text")}
      </p>
      <div className="keymodal-delete__button-container">
        <button
          className="fill"
          onClick={() => {
            vaultContext.deleteKey(keyToDelete);
            onFinish();
          }}
        >
          {t("Shared.yes")}
        </button>
        <button
          className="keymodal-delete__button-cancel"
          onClick={() => {
            onFinish();
          }}
        >
          {t("Shared.cancel")}
        </button>
      </div>
    </>
  );
}

export default DeleteKey;
