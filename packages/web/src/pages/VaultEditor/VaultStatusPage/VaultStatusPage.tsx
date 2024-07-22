import { IAddressRoleInVault, IVaultStatusData } from "@hats.finance/shared";
import { CopyToClipboard, Loading, Seo } from "components";
import DOMPurify from "dompurify";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useIsGovMember } from "hooks/useIsGovMember";
import { useIsGrowthMember } from "hooks/useIsGrowthMember";
import { useIsReviewer } from "hooks/useIsReviewer";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { isAddress } from "utils/addresses.utils";
import { useAccount } from "wagmi";
import { checkIfAddressCanEditTheVault, vaultEditorRoleToIntlKey } from "../utils";
import * as VaultStatusService from "../vaultEditorService";
import {
  CheckInStatusCard,
  CongratsStatusCard,
  DepositStatusCard,
  EditVaultStatusCard,
  GenerateNftsAssetsCard,
  GovActionsStatusCard,
  GovApprovalStatusCard,
  OnChainDataStatusCard,
} from "./VaultStatusCards";
import { VaultStatusContext } from "./store";
import { StyledVaultStatusPage } from "./styles";

/**
 * Attetion: This page only works with V2 vaults
 */
export const VaultStatusPage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const navigate = useNavigate();
  const { allVaults, vaultsReadyAllChains } = useVaults();
  const { vaultAddress, vaultChainId } = useParams();

  const [vaultData, setVaultData] = useState<IVaultStatusData | undefined>();
  const [userPermissionData, setUserPermissionData] = useState<{ canEditVault: boolean; role: IAddressRoleInVault }>();
  const isGovMember = useIsGovMember();
  const isReviewer = useIsReviewer();
  const isGrowthMember = useIsGrowthMember();

  const loadVaultData = useCallback(
    async (address: string, chainId: number) => {
      const vault = allVaults?.find((v) => v.id.toLowerCase() === address.toLowerCase());
      if (!vault) return setVaultData(undefined);

      const vaultInfo = await VaultStatusService.getVaultInformation(vault);
      setVaultData(vaultInfo);
    },
    [allVaults]
  );

  useEffect(() => {
    if (!vaultsReadyAllChains) return;

    if (vaultAddress && vaultChainId && isAddress(vaultAddress)) {
      loadVaultData(vaultAddress, +vaultChainId);
    } else {
      navigate(-1);
    }
  }, [vaultAddress, vaultChainId, navigate, vaultsReadyAllChains, loadVaultData]);

  useEffect(() => {
    const getPermissionData = async () => {
      if (!vaultData) return;

      const permissionData = await checkIfAddressCanEditTheVault(address, vaultChainId, vaultData.committeeMulsitigAddress);
      setUserPermissionData(permissionData);
    };
    getPermissionData();
  }, [address, vaultChainId, vaultData]);

  const refreshVaultData = async () => {
    if (!vaultAddress || !vaultChainId) return;

    const vault = allVaults?.find((v) => v.id.toLowerCase() === vaultAddress.toLowerCase());
    if (!vault) return setVaultData(undefined);

    const vaultInfo = await VaultStatusService.getVaultInformation(vault);
    setVaultData(vaultInfo);
  };

  if (!vaultAddress || !vaultChainId) return null;
  if (!vaultData || !userPermissionData) return <Loading fixed extraText={`${t("loadingVaultData")}...`} />;

  const vaultStatusContext = {
    vaultData,
    userPermissionData,
    loadVaultData,
    refreshVaultData,
    vaultAddress,
    vaultChainId: +vaultChainId,
  };

  return (
    <>
      <Seo title={t("seo.vaultStatusTitle", { vaultName: vaultData.description?.["project-metadata"].name })} />
      <StyledVaultStatusPage className="content-wrapper">
        <div className="status-title">
          <div className="leftSide">
            <div className="title">
              {t("vaultCreator")}
              <span>/{t("vaultStatus")}</span>
            </div>
            <div className="role">{t(vaultEditorRoleToIntlKey(userPermissionData.role))}</div>
          </div>
          <CopyToClipboard valueToCopy={DOMPurify.sanitize(document.location.href)} overlayText={t("copyVaultLink")} />
        </div>

        {!vaultData.description && <div className="vault-error mb-4">{t("vaultWithoutDescriptionError")}</div>}

        <div className="status-cards">
          <VaultStatusContext.Provider value={vaultStatusContext}>
            <CongratsStatusCard />
            <EditVaultStatusCard />
            {(isGovMember || isReviewer || isGrowthMember) && <GenerateNftsAssetsCard />}
            <CheckInStatusCard />
            <DepositStatusCard />
            <OnChainDataStatusCard />
            <GovApprovalStatusCard />
            {(isGovMember || isGrowthMember) && <GovActionsStatusCard />}
          </VaultStatusContext.Provider>
        </div>
      </StyledVaultStatusPage>
    </>
  );
};
