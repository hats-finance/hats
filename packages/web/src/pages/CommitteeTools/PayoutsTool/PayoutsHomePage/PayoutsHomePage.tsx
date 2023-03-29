import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { getAddressRoleOnVault, IVault } from "@hats-finance/shared";
import PayoutIcon from "assets/icons/payout.svg";
import { Button, FormSelectInput, WalletButton } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { StyledPayoutsHome } from "./styles";

export const PayoutsHomePage = () => {
  const { t } = useTranslation();

  const { address } = useAccount();
  const { allVaults } = useVaults();

  const [vaultsOptions, setVaultsOptions] = useState<{ label: string; value: string; icon: string | undefined }[]>([]);
  const [selectedVaultAddress, setSelectedVaultAddress] = useState("");

  const populateVaultsOptions = useCallback(async () => {
    if (!address || !allVaults) return setVaultsOptions([]);
    const userVaults = [] as IVault[];

    for (const vault of allVaults) {
      if (!vault.description) continue;

      const userRole = await getAddressRoleOnVault(address, vault.description);
      if ((userRole === "committee-multisig" || userRole === "committee") && vault.version === "v2") userVaults.push(vault);
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

  return (
    <StyledPayoutsHome>
      <div className="container">
        <div className="title-container">
          <img src={PayoutIcon} alt="payout" />
          <p className="title">{t("Payouts.welcomeTitle")}</p>
        </div>

        {address ? (
          <div className="vault-selection">
            <p className="mb-2">{t("Payouts.selectVaultToCreatePayout")}</p>
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
              <Button disabled={!selectedVaultAddress}>{t("continue")}</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-5">{t("Payouts.connectWithACommitteeMemberWallet")}</p>
            <WalletButton expanded />
          </>
        )}
      </div>
    </StyledPayoutsHome>
  );
};
