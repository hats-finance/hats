import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IVault } from "types";
import { Button, FormSelectInput, Modal } from "components";
import { RoutePaths } from "navigation";
import { useVaults } from "hooks/vaults/useVaults";
import { StyledVaultEditorHome } from "./styles";
import { VaultReadyModal } from "./VaultReadyModal";

export const VaultEditorHome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { address } = useAccount();
  const { allVaults } = useVaults();

  const isVaultCreated = !!searchParams.get("vaultReady");

  const [vaultsOptions, setVaultsOptions] = useState<{ label: string; value: string; icon: string | undefined }[]>([]);
  const [selectedVaultAddress, setSelectedVaultAddress] = useState("");

  const populateVaultsOptions = useCallback(() => {
    console.log(allVaults);
    if (!address || !allVaults) return setVaultsOptions([]);
    const userVaults = [] as IVault[];

    for (const vault of allVaults) {
      const isMultisig = vault.committee === address;
      const isCommitteeMember = vault.description?.committee.members.map((member) => member.address).includes(address);

      if ((isMultisig || isCommitteeMember) && vault.version === "v2") userVaults.push(vault);
    }

    setVaultsOptions(
      userVaults.map((vault) => ({
        label: vault.description?.["project-metadata"].name ?? vault.name,
        value: vault.id,
        icon: vault.description?.["project-metadata"].icon,
      }))
    );
  }, [address, allVaults]);

  useEffect(() => {
    populateVaultsOptions();
  }, [populateVaultsOptions]);

  const createNewVault = () => {
    navigate(`${RoutePaths.vault_editor}/new-vault`);
  };

  const goToStatusPage = () => {
    const selectedVault = allVaults?.find((vault) => vault.id === selectedVaultAddress);
    if (!selectedVault || !selectedVault.chainId) return;

    navigate(`${RoutePaths.vault_editor}/status/${selectedVault.chainId}/${selectedVault.id}`);
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

        {address && (
          <>
            <div className="vault-selection">
              <FormSelectInput
                label={t("vault")}
                emptyState={t("youHaveNoVaults")}
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
  );
};
