import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { getAddressSafes, IVault } from "@hats-finance/shared";
import { useTranslation } from "react-i18next";
import { RoutePaths } from "navigation";
import { Button, FormSelectInput, Loading } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import * as PayoutsService from "../payoutsService";
import { StyledPayoutCreateModal } from "./styles";

interface PayoutCreateModalProps {
  closeModal: Function;
}

export const PayoutCreateModal = ({ closeModal }: PayoutCreateModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { address } = useAccount();
  const { allVaults } = useVaults();

  const [isLoading, setIsLoading] = useState(false);
  const [vaultsOptions, setVaultsOptions] = useState<{ label: string; value: string; icon: string | undefined }[]>([]);
  const [selectedVaultAddress, setSelectedVaultAddress] = useState("");

  // Get user vaults
  useEffect(() => {
    const populateVaultsOptions = async () => {
      if (!address || !allVaults || allVaults.length === 0) return setVaultsOptions([]);
      const foundVaults = [] as IVault[];

      for (const vault of allVaults) {
        if (!vault.description) continue;

        const userSafes = await getAddressSafes(address, vault.chainId);
        const isSafeMember = userSafes.some((safeAddress) => safeAddress === vault.description?.committee["multisig-address"]);
        const isMultisigAddress = vault.description?.committee["multisig-address"] === address;

        if ((isSafeMember || isMultisigAddress) && vault.version === "v2") foundVaults.push(vault);
      }

      setVaultsOptions(
        foundVaults.map((vault) => ({
          label: vault.description?.["project-metadata"].name ?? vault.name,
          value: vault.id,
          icon: vault.description?.["project-metadata"].icon,
        }))
      );
    };
    populateVaultsOptions();
  }, [address, allVaults]);

  const handleCreatePayout = async () => {
    const selectedVault = allVaults?.find((vault) => vault.id === selectedVaultAddress);
    if (!selectedVault) return;
    setIsLoading(true);

    const payoutId = await PayoutsService.createNewPayout(selectedVault.chainId as number, selectedVault.id);
    console.log(payoutId);
    if (payoutId) navigate(`${RoutePaths.payouts}/${payoutId}`);

    setIsLoading(false);
    closeModal();
  };

  return (
    <StyledPayoutCreateModal>
      <p>{t("Payouts.createPayoutDescription")}</p>

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
          <Button disabled={!selectedVaultAddress} onClick={handleCreatePayout}>
            {t("Payouts.createPayout")}
          </Button>
        </div>
      </div>

      {isLoading && <Loading fixed extraText={`${t("Payouts.creatingPayout")}...`} />}
    </StyledPayoutCreateModal>
  );
};
