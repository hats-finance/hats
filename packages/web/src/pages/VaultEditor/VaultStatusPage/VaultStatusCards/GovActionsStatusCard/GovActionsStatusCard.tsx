import { IEditedSessionResponse, getBaseSafeAppUrl, getGnosisChainPrefixByChainId } from "@hats.finance/shared";
import { Alert, Button, FormInput, Loading } from "components";
import { useEnhancedForm } from "hooks/form";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useIsGrowthMember } from "hooks/useIsGrowthMember";
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

  const isGrowthMember = useIsGrowthMember();

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
    const isOk = await createVaultGovActionsProposalOnSafe(formData, vault, isGrowthMember ? "growth" : "gov", {
      chain,
      signer,
      account,
    });
    setProposalCreatedSuccessfully(isOk);
    setIsLoading(false);
  };

  const goToSafeApp = () => {
    if (!vault) return;

    const multisig = isGrowthMember ? appChains[vault.chainId].growthMultisig : appChains[vault.chainId].govMultisig;
    window.open(
      `${getBaseSafeAppUrl(vault.chainId)}/transactions/queue?safe=${getGnosisChainPrefixByChainId(vault.chainId)}:${multisig}`,
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
              {t("generateProposalOnSafe", { multisig: isGrowthMember ? "Growth" : "Gov" })}
            </Button>
          </div>
        </>
      ) : (
        <Alert type="success">
          <>
            <span>{t("proposalCreatedSuccessfully")}</span>
            <Button styleType="text" onClick={goToSafeApp}>
              {t("goToSafeAppNamed", { multisig: isGrowthMember ? "Growth" : "Gov" })}
            </Button>
          </>
        </Alert>
      )}

      {/* Vault data */}
      <div className="mt-5 ml-5">
        <ul>
          <li>
            <strong>{t("committeeMultisig")}</strong>: {vaultData.committeeMulsitigAddress}
          </li>
          <li>
            <strong>{t("maxBounty")}</strong>: {vaultData.parameters.maxBounty / 100}%
          </li>
          <li>
            <strong>{t("hatsGovFee")}</strong>: {vaultData.parameters.hatsGovernanceSplit / 100}% on-chain (
            {vaultData.description?.version === "v3" ? `${vaultData.description.parameters.fixedHatsGovPercetange}%` : ""} on
            vault editor)
          </li>
          <li>
            <strong>{t("bountySplit")}</strong>:
            <ul className="ml-3">
              <li>
                <strong>{t("immediate")}</strong>: {vaultData.parameters.bountySplitImmediate / 100}%
              </li>
              <li>
                <strong>{t("vested")}</strong>: {vaultData.parameters.bountySplitVested / 100}%
              </li>
              <li>
                <strong>{t("committee")}</strong>: {vaultData.parameters.bountySplitCommittee / 100}%
              </li>
            </ul>
          </li>
          {vaultData.arbitrator && (
            <li>
              <strong>{t("arbitrator")}</strong>: {vaultData.arbitrator}
            </li>
          )}
          {vaultData.arbitratorCanChangeBounty !== undefined && (
            <li>
              <strong>{t("arbitratorCanChangeBounty")}</strong>: {vaultData.arbitratorCanChangeBounty ? t("yes") : t("no")}
            </li>
          )}
          {vaultData.arbitratorCanChangeBeneficiary !== undefined && (
            <li>
              <strong>{t("arbitratorCanChangeBeneficiary")}</strong>:{" "}
              {vaultData.arbitratorCanChangeBeneficiary ? t("yes") : t("no")}
            </li>
          )}
          {vaultData.arbitratorCanSubmitClaims !== undefined && (
            <li>
              <strong>{t("arbitratorCanSubmitClaims")}</strong>: {vaultData.arbitratorCanSubmitClaims ? t("yes") : t("no")}
            </li>
          )}
          {vaultData.isTokenLockRevocable !== undefined && (
            <li>
              <strong>{t("isTokenLockRevocable")}</strong>: {vaultData.isTokenLockRevocable ? t("yes") : t("no")}
            </li>
          )}
        </ul>
      </div>

      {isLoading && <Loading extraText={t("creatingProposal")} fixed />}
    </div>
  );
};
