import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, FormSelectInput } from "components";
import { StyledVaultEditorHome } from "./styles";
import { RoutePaths } from "navigation";

export const VaultEditorHome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedEditSessionId, setselectedEditSessionId] = useState("");

  const createNewVault = () => {
    navigate(`${RoutePaths.vault_editor}/new-vault`);
  };

  return (
    <StyledVaultEditorHome>
      <div className="container">
        <p className="title">{t("welcomeVaultEditorHome")}</p>
        <Button expanded size="big" onClick={createNewVault}>
          {t("createNewVault")}
        </Button>

        <div className="divider">
          <div />
          <p>{t("or")}</p>
          <div />
        </div>

        <p>{t("editExistingVaultExplanation")}</p>

        <div className="vault-selection">
          <FormSelectInput
            label={t("vault")}
            placeholder={t("selectVault")}
            name="editSessionId"
            value={selectedEditSessionId}
            onChange={(e) => setselectedEditSessionId(e as string)}
            options={[{ label: "Test", value: "test" }]}
          />

          <div className="options">
            <Button disabled={!selectedEditSessionId} styleType="outlined">
              {t("statusPage")}
            </Button>
            <Button disabled={!selectedEditSessionId}>{t("editVault")}</Button>
          </div>
        </div>
      </div>
    </StyledVaultEditorHome>
  );
};
