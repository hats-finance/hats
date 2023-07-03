import { IEditedSessionResponse } from "@hats-finance/shared";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { Alert, Button, FormInput } from "components";
import { useEnhancedForm } from "hooks/form";
import { useVaults } from "hooks/vaults/useVaults";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useNetwork, useSigner } from "wagmi";
import * as VaultEditorService from "../../vaultEditorService";
import { VaultStatusContext } from "../store";

type IGovActionsForm = {
  showVault: {
    active: boolean;
  };
  hideVault: {
    active: boolean;
  };
  setDescriptionHash: {
    active: boolean;
    descriptionHash: string;
  };
};

export const GovActionsStatusCard = () => {
  const { t } = useTranslation();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  const { register, watch, setValue } = useEnhancedForm<IGovActionsForm>({
    mode: "onChange",
    defaultValues: {
      hideVault: { active: false },
      showVault: { active: false },
      setDescriptionHash: { active: false, descriptionHash: undefined },
    },
  });

  const { vaultData, vaultAddress, vaultChainId } = useContext(VaultStatusContext);
  const { allVaults } = useVaults();
  const vault = allVaults?.find((vault) => vault.id === vaultAddress);
  const isApprovedByGov = vaultData.isRegistered;

  const [editSessions, setEditSessions] = useState<IEditedSessionResponse[]>([]);
  const lastEditSession = editSessions.length > 0 ? editSessions[0] : undefined;
  const isLastEditionWaitingApproval = lastEditSession?.vaultEditionStatus === "pendingApproval";

  const formData = watch();
  const isFormValid = useMemo(() => {
    return (
      formData.showVault.active ||
      formData.hideVault.active ||
      (formData.setDescriptionHash.active && formData.setDescriptionHash.descriptionHash)
    );
  }, [formData]);

  // Fetch edit sessions
  useEffect(() => {
    const fetchEditSessions = async () => {
      const editSessions = await VaultEditorService.getEditionEditSessions(vaultAddress, vaultChainId);
      setEditSessions(editSessions);
    };
    fetchEditSessions();
  }, [vaultAddress, vaultChainId]);

  // Set description hash
  useEffect(() => {
    if (isLastEditionWaitingApproval) {
      setValue("setDescriptionHash.descriptionHash", lastEditSession.descriptionHash);
    }
  }, [isLastEditionWaitingApproval, lastEditSession, setValue]);

  const handleGenerateProposal = async () => {
    if (!isFormValid) return;
    if (!chain || !vault) return;
    await switchNetworkAndValidate(chain.id, vault.chainId);

    const govAddress = appChains[vault.chainId].govMultisig;
    if (!govAddress) return alert("No gov multisig address for this chain. Please contact Hats team with this error.");

    // const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer as Signer });
    // const txServiceUrl = "https://safe-transaction-mainnet.safe.global";
    // const safeService = new SafeApiKit({ txServiceUrl, ethAdapter });
    // const safeSdk = await Safe.create({ ethAdapter, safeAddress: govAddress });

    // const a = await safeSdk.createTransaction({ safeTransactionData: { data: "0x", to: "0x", value: "" } });
    // // a.
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <h3>{t("govActions")}</h3>
        </div>
      </div>

      {isApprovedByGov ? (
        <div className="mt-5 ml-3">
          <h3 className="mb-3">{t("removeVaultFromDapp")}</h3>
          <FormInput {...register("hideVault.active")} label={t("removeVaultFromDapp")} type="toggle" />
        </div>
      ) : (
        <div className="mt-5 ml-3">
          <h3 className="mb-3">{t("setVaultVisibleOnDapp")}</h3>
          <FormInput {...register("showVault.active")} label={t("setVaultVisibleOnDapp")} type="toggle" />
        </div>
      )}

      <div className="mt-5 ml-3">
        <h3 className="mb-3">{t("updateDescriptionHash")}</h3>
        {isLastEditionWaitingApproval ? (
          <>
            <FormInput {...register("setDescriptionHash.active")} label={t("updateDescriptionHash")} type="toggle" />
            {formData.setDescriptionHash.active && (
              <div className="ml-3">
                <p className="mb-2">{`${t("editSessionId")}: ${lastEditSession._id}`}</p>
                <FormInput {...register("setDescriptionHash.descriptionHash")} label={t("descriptionHashToSet")} readOnly />
              </div>
            )}
          </>
        ) : (
          <Alert type="info">{t("vaultDoesNotHaveWaitingApprovalEditSession")}</Alert>
        )}
      </div>

      <div className="status-card__button">
        <Button disabled={!isFormValid} onClick={handleGenerateProposal}>
          {t("generateProposalOnSafe")}
        </Button>
      </div>

      {/* {vault && (
        <>
          <Button className="mt-5" onClick={showPreview}>
            {t("showVaultPreview")} <OpenIcon className="ml-3" />
          </Button>
          <Modal isShowing={isShowingPreview} onHide={hidePreview}>
            <StyledPreviewModal>
              <VaultDetailsPage vaultToUse={vault} noActions />
            </StyledPreviewModal>
          </Modal>
        </>
      )} */}
    </div>
  );
};
