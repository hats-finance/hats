import { Button, FormSelectInput, Modal, Seo } from "components";
import { useUserVaults } from "hooks/vaults/useUserVaults";
import { RoutePaths } from "navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { VaultReadyModal } from "./VaultReadyModal";
import { StyledVaultEditorHome } from "./styles";

export const VaultEditorHomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { address } = useAccount();

  const isVaultCreated = !!searchParams.get("vaultReady");
  const { userVaults, isLoading: isLoadingUserVaults, selectInputOptions: vaultsOptions } = useUserVaults(["v2", "v3"]);
  const [selectedVaultAddress, setSelectedVaultAddress] = useState("");

  const createNewVault = () => {
    navigate(`${RoutePaths.vault_editor}/new-vault`);
  };

  const goToStatusPage = () => {
    const selectedVault = userVaults?.find((vault) => vault.id === selectedVaultAddress);
    if (!selectedVault || !selectedVault.chainId) return;

    navigate(`${RoutePaths.vault_editor}/status/${selectedVault.chainId}/${selectedVault.id}`);
  };

  return (
    <>
      <Seo title={t("seo.createNewVaultTitle")} />
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

          {address && (
            <>
              <div className="vault-selection">
                <FormSelectInput
                  label={t("vault")}
                  emptyState={isLoadingUserVaults ? `${t("loadingVaults")}...` : t("youHaveNoVaults")}
                  placeholder={t("selectVault")}
                  name="editSessionId"
                  value={selectedVaultAddress}
                  onChange={(e) => setSelectedVaultAddress(e as string)}
                  options={vaultsOptions}
                />

                <div className="options">
                  <Button disabled={!selectedVaultAddress} onClick={goToStatusPage}>
                    {t("statusPage")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <Modal isShowing={isVaultCreated} onHide={() => navigate(RoutePaths.vault_editor)} disableOnOverlayClose>
          <VaultReadyModal closeModal={() => navigate(RoutePaths.vault_editor)} />
        </Modal>
      </StyledVaultEditorHome>
    </>
  );
};
