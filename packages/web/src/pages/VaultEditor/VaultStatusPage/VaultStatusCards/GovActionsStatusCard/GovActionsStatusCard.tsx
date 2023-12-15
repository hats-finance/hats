import { IEditedSessionResponse, getGnosisChainPrefixByChainId } from "@hats.finance/shared";
import { Alert, Button, FormInput, Loading } from "components";
import { useEnhancedForm } from "hooks/form";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { useAccount, useNetwork, useSigner } from "wagmi";
import * as VaultEditorService from "../../../vaultEditorService";
import { VaultStatusContext } from "../../store";
import { createVaultGovActionsProposalOnSafe } from "./vaultGovActions.utils";

export type IVaultGovActionsForm = {
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
  const { address: account } = useAccount();

  const [proposalCreatedSuccessfully, setProposalCreatedSuccessfully] = useState<boolean | undefined>();
  const [isLoading, setIsLoading] = useState<boolean | undefined>();

  const { register, watch, setValue, getValues } = useEnhancedForm<IVaultGovActionsForm>({
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
    if (!chain || !vault || !signer || !account) return;

    setIsLoading(true);
    const formData = getValues();
    const isOk = await createVaultGovActionsProposalOnSafe(formData, vault, { chain, signer, account });
    setProposalCreatedSuccessfully(isOk);
    setIsLoading(false);
  };

  const goToSafeApp = () => {
    if (!vault) return;

    const govAddress = appChains[vault.chainId].govMultisig;
    window.open(
      `https://app.safe.global/transactions/queue?safe=${getGnosisChainPrefixByChainId(vault.chainId)}:${govAddress}`,
      "_blank"
    );
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <h3>{t("govActions")}</h3>
        </div>
      </div>

      {proposalCreatedSuccessfully === false && <Alert type="error">{t("errorDuringSafeProposal")}</Alert>}

      {!proposalCreatedSuccessfully ? (
        <>
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
        </>
      ) : (
        <Alert type="success">
          <>
            <span>{t("proposalCreatedSuccessfully")}</span>
            <Button styleType="text" onClick={goToSafeApp}>
              {t("goToSafeApp")}
            </Button>
          </>
        </Alert>
      )}

      {isLoading && <Loading extraText={t("creatingProposal")} fixed />}
    </div>
  );
};
