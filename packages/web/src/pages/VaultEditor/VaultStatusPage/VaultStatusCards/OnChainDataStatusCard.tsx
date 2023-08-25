import { IEditedVaultParameters, isAGnosisSafeTx } from "@hats-finance/shared";
import SyncIcon from "@mui/icons-material/Sync";
import { Alert, FormInput, Loading, Pill } from "components";
import { VaultBountySplitEditionContract } from "contracts";
import useConfirm from "hooks/useConfirm";
import { VaultParametersForm } from "pages/VaultEditor/VaultEditorFormPage";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { VaultStatusContext } from "../store";

export const OnChainDataStatusCard = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const [isBeingExecuted, setIsBeingExecuted] = useState(false);

  const { vaultData, vaultAddress, vaultChainId, refreshVaultData } = useContext(VaultStatusContext);
  const [editVaultParameters, setEditVaultParameters] = useState(false);
  const [defaultVaultParametersData, setDefaultVaultParametersData] = useState<{ parameters: IEditedVaultParameters }>();

  const confirm = useConfirm();

  const isMultisigConnected = address === vaultData.committeeMulsitigAddress;

  const editBountySplitCall = VaultBountySplitEditionContract.hook({ address: vaultAddress, chainId: vaultChainId });
  const handleEditBountySplit = (params: IEditedVaultParameters) => {
    if (!isMultisigConnected) return;
    editBountySplitCall.send(params);
  };

  useEffect(() => {
    const txHash = editBountySplitCall?.data?.hash;
    if (!txHash) return;

    isAGnosisSafeTx(txHash, vaultChainId).then((isSafeTx) => {
      if (isSafeTx) setIsBeingExecuted(true);
      setTimeout(() => refreshVaultData(), 2000);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editBountySplitCall.data]);

  useEffect(() => {
    setDefaultVaultParametersData({
      parameters: {
        maxBountyPercentage: vaultData.parameters.maxBounty / 100,
        committeePercentage: vaultData.parameters.bountySplitCommittee / 100,
        immediatePercentage: vaultData.parameters.bountySplitImmediate / 100,
        vestedPercentage: vaultData.parameters.bountySplitVested / 100,
        fixedCommitteeControlledPercetange: vaultData.parameters.committeeControlledSplit / 100,
        fixedHatsGovPercetange: vaultData.parameters.hatsGovernanceSplit / 100,
        fixedHatsRewardPercetange: vaultData.parameters.hatsRewardSplit / 100,
      },
    });
  }, [vaultData.parameters, isBeingExecuted]);

  const onChangeOnChainData = async (data: { parameters: IEditedVaultParameters }) => {
    if (!isMultisigConnected) return;

    let editMaxBounty,
      editBountySplit = false;

    // Wants to edit maxBountyPercentage
    if (vaultData.parameters.maxBounty !== +data.parameters.maxBountyPercentage * 100) {
      editMaxBounty = true;
    }

    // Wants to edit bountySplit
    if (
      vaultData.parameters.bountySplitCommittee !== +data.parameters.committeePercentage * 100 ||
      vaultData.parameters.bountySplitImmediate !== +data.parameters.immediatePercentage * 100 ||
      vaultData.parameters.bountySplitVested !== +data.parameters.vestedPercentage * 100
    ) {
      editBountySplit = true;
    }

    if (!editMaxBounty && !editBountySplit) return;

    const wantsToEdit = await confirm({
      confirmText: t("changeVaultParameters"),
      description:
        editMaxBounty && editBountySplit
          ? t("areYouSureYouWantToChangeBothVaultParameters")
          : editMaxBounty
          ? t("areYouSureYouWantToChangeMaxBounty")
          : t("areYouSureYouWantToChangeBountySplit"),
    });

    if (!wantsToEdit) return;

    if (editBountySplit) handleEditBountySplit(data.parameters);
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <h3>{t("parametersOnChain")}</h3>
          <Pill dotColor="blue" text={t("parametersEditable")} />
        </div>
        {editVaultParameters && (
          <div className="reload" onClick={refreshVaultData}>
            <SyncIcon />
          </div>
        )}
      </div>

      <p className="status-card__text mb-5">{t("changeTheVaultParametersOnChain")}</p>
      {!isMultisigConnected && <Alert content={t("connectWithCommitteeMultisig")} type="warning" />}

      {isMultisigConnected && (
        <>
          <FormInput
            name="editVaultParameters"
            checked={editVaultParameters}
            onChange={(e) => setEditVaultParameters(e.target.checked)}
            type="toggle"
            label={t("editVaultParameters")}
          />

          {editVaultParameters && (
            <>
              <VaultParametersForm statusCardFormDefaultData={defaultVaultParametersData} onSubmit={onChangeOnChainData} />
            </>
          )}
        </>
      )}

      <div className="mt-4">
        {editBountySplitCall?.error && <p className="status-card__error">{editBountySplitCall?.error.message}</p>}
        {isBeingExecuted && !editBountySplitCall?.error && (
          <Alert content={t("safeProposalCreatedSuccessfully")} type="warning" />
        )}
      </div>

      {editBountySplitCall?.isLoading && <Loading fixed extraText={`${t("approveTheTransactionOnSafeApp")}`} />}
    </div>
  );
};
