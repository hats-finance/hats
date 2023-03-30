import { useCallback, useEffect, useState } from "react";
import { getAddressSafes, IVault } from "@hats-finance/shared";
import { useAccount } from "wagmi";
import { useTranslation } from "react-i18next";
import { Loading } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { PayoutsWelcome } from "./PayoutsWelcome";
import * as PayoutsService from "../payoutsService";
import { StyledPayoutsListPage, PayoutListSections, PayoutListSection } from "./styles";

export const PayoutsListPage = () => {
  const { t } = useTranslation();

  const { address } = useAccount();
  const { allVaults } = useVaults();

  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<"in_progress" | "finished">("in_progress");
  const [userVaults, setUserVaults] = useState<IVault[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (userVaults.length === 0) return;

      const payouts = await PayoutsService.getPayoutsListByVault(
        userVaults.map((vault) => ({ chainId: vault.chainId as number, vaultAddress: vault.id }))
      );
    };
    loadData();
  }, [userVaults]);

  const populateVaultsOptions = useCallback(async () => {
    if (!address || !allVaults || allVaults.length === 0) return setUserVaults([]);
    const foundVaults = [] as IVault[];

    for (const vault of allVaults) {
      if (!vault.description) continue;

      const userSafes = await getAddressSafes(address, vault.chainId);
      const isSafeMember = userSafes.some((safeAddress) => safeAddress === vault.description?.committee["multisig-address"]);
      const isMultisigAddress = vault.description?.committee["multisig-address"] === address;

      if ((isSafeMember || isMultisigAddress) && vault.version === "v2") foundVaults.push(vault);
    }

    setTimeout(() => setLoading(false), 200);
    setUserVaults(foundVaults);
  }, [address, allVaults]);

  useEffect(() => {
    populateVaultsOptions();
  }, [populateVaultsOptions]);

  if (loading && address && allVaults) return <Loading />;
  if (!address || userVaults.length === 0) return <PayoutsWelcome />;

  return (
    <StyledPayoutsListPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title">
          <p>{t("payouts")}</p>
        </div>
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
