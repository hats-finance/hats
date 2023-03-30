import { useCallback, useEffect, useState } from "react";
import { getAddressSafes, IVault } from "@hats-finance/shared";
import { useAccount } from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CopyToClipboard, Loading } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { isAddress } from "utils/addresses.utils";
import { PayoutsWelcome } from "./PayoutsWelcome";
import * as PayoutsService from "../payoutsService";
import { StyledPayoutsListPage, PayoutListSections, PayoutListSection } from "./styles";

export const PayoutsListPage = () => {
  const { t } = useTranslation();
  const { vaultAddress, vaultChainId } = useParams();

  const { address } = useAccount();
  const { allVaults } = useVaults();

  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<"in_progress" | "finished">("in_progress");
  const [vaultsOptions, setVaultsOptions] = useState<{ label: string; value: string; icon: string | undefined }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (vaultAddress && vaultChainId && isAddress(vaultAddress)) {
        const payouts = await PayoutsService.getPayoutsListByVault(vaultAddress, +vaultChainId);
      }
    };
    loadData();
  }, []);

  const populateVaultsOptions = useCallback(async () => {
    if (!address || !allVaults || allVaults.length === 0) return setVaultsOptions([]);
    const userVaults = [] as IVault[];

    for (const vault of allVaults) {
      if (!vault.description) continue;

      const userSafes = await getAddressSafes(address, vault.chainId);
      const isSafeMember = userSafes.some((safeAddress) => safeAddress === vault.description?.committee["multisig-address"]);
      const isMultisigAddress = vault.description?.committee["multisig-address"] === address;

      if ((isSafeMember || isMultisigAddress) && vault.version === "v2") userVaults.push(vault);
    }

    setTimeout(() => setLoading(false), 200);
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

  if (loading && address) return <Loading />;
  if (!address || vaultsOptions.length === 0) return <PayoutsWelcome />;

  return (
    <StyledPayoutsListPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title">
          <p>{t("payouts")}</p>
        </div>

        <CopyToClipboard valueToCopy={document.location.href} overlayText={t("Payouts.copyPayoutListLink")} />
      </div>
      <PayoutListSections>
        <PayoutListSection active={section === "in_progress"} onClick={() => setSection("in_progress")}>
          {t("inProgress")}
        </PayoutListSection>
        <PayoutListSection active={section === "finished"} onClick={() => setSection("finished")}>
          {t("history")}
        </PayoutListSection>
      </PayoutListSections>
    </StyledPayoutsListPage>
  );
};
