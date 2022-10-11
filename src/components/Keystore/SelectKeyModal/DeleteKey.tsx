import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { IStoredKey } from "../types";
import { KeystoreContext } from "../store";

function DeleteKey({
  keyToDelete,
  onFinish
}: {
  keyToDelete: IStoredKey;
  onFinish: () => any;
}) {
  const { t } = useTranslation();
  const keystoreContext = useContext(KeystoreContext);

  return (
    <>
      <p className="keymodal-delete__description">
        {t("CommitteeTools.keymodal.delete-text")}
      </p>
      <div className="keymodal-delete__button-container">
        <button
          className="fill"
          onClick={() => {
            keystoreContext.deleteKey(keyToDelete);
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
