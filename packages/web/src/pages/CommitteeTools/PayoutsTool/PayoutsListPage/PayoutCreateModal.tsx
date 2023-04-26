import { PayoutType, getVaultInfoFromVault } from "@hats-finance/shared";
import { Button, FormRadioInput, FormSelectInput, Loading } from "components";
import { useUserVaults } from "hooks/vaults/useUserVaults";
import { RoutePaths } from "navigation";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
  const [selectedVaultAddress, setSelectedVaultAddress] = useState<string>();
  const [payoutType, setPayoutType] = useState<PayoutType>();
  const selectedVault = userVaults?.find((vault) => vault.id === selectedVaultAddress);

  const handleCreatePayout = async () => {
    if (!selectedVault || !payoutType) return;

    const payoutId = await createDraftPayout.mutateAsync({ vaultInfo: getVaultInfoFromVault(selectedVault), type: payoutType });
    if (payoutId) navigate(`${RoutePaths.payouts}/${payoutId}`);

    closeModal();
  };

  const payoutTypeOptions = useMemo(() => {
    if (!selectedVault) return [];

    if (selectedVault.version === "v1") {
      return [{ label: t("Payouts.singlePayout"), value: "single" }];
    } else {
      if (selectedVault?.description?.["project-metadata"].type === "audit") {
        return [{ label: t("Payouts.splitPayout"), value: "split" }];
      } else {
        return [
          { label: t("Payouts.singlePayout"), value: "single" },
          { label: t("Payouts.splitPayout"), value: "split" },
        ];
      }
    }
  }, [selectedVault, t]);

  return (
    <StyledPayoutCreateModal>
      <p>{t("Payouts.createPayoutDescription")}</p>

      <div className="vault-selection">
        <FormSelectInput
          label={t("vault")}
          emptyState={isLoadingUserVaults ? `${t("loadingVaults")}...` : t("youHaveNoVaults")}
          placeholder={t("selectVault")}
          name="editSessionId"
          value={selectedVaultAddress ?? ""}
          onChange={(e) => setSelectedVaultAddress(e as string)}
          options={vaultsOptions}
        />

        {payoutTypeOptions.length > 0 && (
          <FormRadioInput
            name="payoutType"
            label={t("Payouts.choosePayoutType")}
            radioOptions={payoutTypeOptions}
            onChange={(e) => setPayoutType(e.target.value as "single" | "split")}
          />
        )}

        {payoutType && <p className="mb-5">{t(`Payouts.${payoutType}PayoutExplanation`)}</p>}

        <div className="options">
          <Button disabled={!selectedVaultAddress || !payoutType} onClick={handleCreatePayout}>
            {t("Payouts.createPayout")}
          </Button>
        </div>
      </div>

      {createDraftPayout.isLoading && <Loading fixed extraText={`${t("Payouts.creatingPayout")}...`} />}
    </StyledPayoutCreateModal>
  );
};
