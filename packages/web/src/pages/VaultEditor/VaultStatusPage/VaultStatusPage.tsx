import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { isAddress } from "utils/addresses.utils";
import { CopyToClipboard, Loading } from "components";
import {
  OnChainDataStatusCard,
  CongratsStatusCard,
  EditVaultStatusCard,
  CheckInStatusCard,
  DepositStatusCard,
  GovApprovalStatusCard,
} from "./VaultStatusCards";
import * as VaultStatusService from "./vaultStatusService";
import { IVaultStatusData } from "./types";
import { StyledVaultStatusPage } from "./styles";
import { VaultStatusContext } from "./store";

/**
 * Attetion: This page only works with V2 vaults
 */
export const VaultStatusPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { vaultAddress, vaultChainId } = useParams();

  const [vaultData, setVaultData] = useState<IVaultStatusData | undefined>();

  useEffect(() => {
    if (vaultAddress && vaultChainId && isAddress(vaultAddress)) {
      loadVaultData(vaultAddress, +vaultChainId);
    } else {
      navigate(-1);
    }
  }, [vaultAddress, vaultChainId, navigate]);

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
  if (!vaultData) return <Loading fixed extraText={`${t("loadingVaultData")}...`} />;

  const vaultStatusContext = { vaultData, loadVaultData, refreshVaultData, vaultAddress, vaultChainId: +vaultChainId };

  return (
    <StyledVaultStatusPage className="content-wrapper">
      <div className="status-title">
        <div className="title">
          {t("vaultCreator")}
          <span>/{t("vaultStatus")}</span>
        </div>
        <CopyToClipboard valueToCopy={document.location.href} overlayText={t("copyVaultLink")} />
      </div>

      {!vaultData.description && <div className="vault-error mb-4">{t("vaultWithoutDescriptionError")}</div>}

      <div className="status-cards">
        <VaultStatusContext.Provider value={vaultStatusContext}>
          <CongratsStatusCard />
          <EditVaultStatusCard />
          <OnChainDataStatusCard />
          <CheckInStatusCard />
          <DepositStatusCard />
          <GovApprovalStatusCard />
        </VaultStatusContext.Provider>
      </div>
    </StyledVaultStatusPage>
  );
};
