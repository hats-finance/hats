import { useTranslation } from "react-i18next";
import { Button, FormInput, Pill } from "components";
import { useState } from "react";

export const OnChainDataStatusCard = () => {
  const { t } = useTranslation();

  const [editVaultParameters, setEditVaultParameters] = useState(false);

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <span>{t("deployOnChain")}</span>
          <Pill color="blue" text={t("completed")} />
        </div>
      </div>

      <FormInput
        name="editVaultParameters"
        value={`${editVaultParameters}`}
        onChange={(e) => setEditVaultParameters(e.target.checked)}
        type="checkbox"
        label={t("editVaultParameters")}
      />

      {editVaultParameters && (
        <>
          <div>FORM</div>
          <Button className="status-card__button">{t("changeVaultParameters")}</Button>
        </>
      )}
    </div>
  );
};
