import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getVaultInfoFromVault } from "@hats-finance/shared";
import { RoutePaths } from "navigation";
import { Button, FormSelectInput, Loading } from "components";
import { useUserVaults } from "hooks/vaults/useUserVaults";
import { useCreateDraftPayout } from "../payoutsService.hooks";
import { StyledPayoutCreateModal } from "./styles";

interface PayoutCreateModalProps {
  closeModal: Function;
}

export const PayoutCreateModal = ({ closeModal }: PayoutCreateModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const createDraftPayout = useCreateDraftPayout();

  const { userVaults, isLoading: isLoadingUserVaults, selectInputOptions: vaultsOptions } = useUserVaults("all");
  const [selectedVaultAddress, setSelectedVaultAddress] = useState("");

  const handleCreatePayout = async () => {
    const selectedVault = userVaults?.find((vault) => vault.id === selectedVaultAddress);
    if (!selectedVault) return;

    const payoutId = await createDraftPayout.mutateAsync(getVaultInfoFromVault(selectedVault));
    if (payoutId) navigate(`${RoutePaths.payouts}/${payoutId}`);

    closeModal();
  };

  return (
    <StyledPayoutCreateModal>
      <p>{t("Payouts.createPayoutDescription")}</p>

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
          <Button disabled={!selectedVaultAddress} onClick={handleCreatePayout}>
            {t("Payouts.createPayout")}
          </Button>
        </div>
      </div>

      {createDraftPayout.isLoading && <Loading fixed extraText={`${t("Payouts.creatingPayout")}...`} />}
    </StyledPayoutCreateModal>
  );
};
