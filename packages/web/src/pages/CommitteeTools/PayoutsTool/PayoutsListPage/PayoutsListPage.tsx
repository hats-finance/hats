import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RoutePaths } from "navigation";
import { CopyToClipboard } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { isAddress } from "utils/addresses.utils";
import * as PayoutsService from "../payoutsService";
import { StyledPayoutsListPage, PayoutListSections, PayoutListSection } from "./styles";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { getAddressRoleOnVault, IVault } from "@hats-finance/shared";
import { PayoutsWelcome } from "./PayoutsWelcome";

export const PayoutsListPage = () => {
  const { t } = useTranslation();
  const { vaultAddress, vaultChainId } = useParams();
  const navigate = useNavigate();

  const { address } = useAccount();
  const { allVaults, vaults } = useVaults();

  const [vaultsOptions, setVaultsOptions] = useState<{ label: string; value: string; icon: string | undefined }[] | undefined>(
    undefined
  );
  const [section, setSection] = useState<"in_progress" | "finished">("in_progress");

  console.log(vaultsOptions);

  useEffect(() => {
    const loadData = async () => {
      if (vaultAddress && vaultChainId && isAddress(vaultAddress)) {
        const payouts = await PayoutsService.getPayoutsListByVault(vaultAddress, +vaultChainId);
      }
    };
    loadData();
  }, []);

  const populateVaultsOptions = useCallback(async () => {
    if (!address || !allVaults || allVaults.length === 0) return setVaultsOptions(undefined);
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

  // console.log(!address);
  // console.log(vaultsOptions);

  if (!address || vaultsOptions?.length === 0) return <PayoutsWelcome />;

  return (
    <StyledPayoutsListPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title" onClick={() => navigate(RoutePaths.payouts)}>
          <BackIcon />
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
