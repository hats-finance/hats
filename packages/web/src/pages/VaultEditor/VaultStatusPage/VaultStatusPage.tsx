import { IAddressRoleInVault, IVaultStatusData } from "@hats-finance/shared";
import { CopyToClipboard, Loading } from "components";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
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
  const { vaultAddress, vaultChainId } = useParams();

  const [vaultData, setVaultData] = useState<IVaultStatusData | undefined>();
  const [userPermissionData, setUserPermissionData] = useState<{ canEditVault: boolean; role: IAddressRoleInVault }>();

  useEffect(() => {
    if (vaultAddress && vaultChainId && isAddress(vaultAddress)) {
      loadVaultData(vaultAddress, +vaultChainId);
    } else {
      navigate(-1);
    }
  }, [vaultAddress, vaultChainId, navigate]);

  useEffect(() => {
    const getPermissionData = async () => {
      if (!vaultData) return;

      const permissionData = await checkIfAddressCanEditTheVault(address, vaultChainId, vaultData.committeeMulsitigAddress);
      setUserPermissionData(permissionData);
    };
    getPermissionData();
  }, [address, vaultChainId, vaultData]);

  const loadVaultData = async (address: string, chainId: number) => {
    const vaultInfo = await VaultStatusService.getVaultInformation(address, chainId);
    setVaultData(vaultInfo);
  };

  const refreshVaultData = async () => {
    if (!vaultAddress || !vaultChainId) return;

    const vaultInfo = await VaultStatusService.getVaultInformation(vaultAddress, +vaultChainId);
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
    <StyledVaultStatusPage className="content-wrapper-md">
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
          {userPermissionData.role === "gov" && <GenerateNftsAssetsCard />}
          <OnChainDataStatusCard />
          <CheckInStatusCard />
          <DepositStatusCard />
          <GovApprovalStatusCard />
        </VaultStatusContext.Provider>
      </div>
    </StyledVaultStatusPage>
  );
};
