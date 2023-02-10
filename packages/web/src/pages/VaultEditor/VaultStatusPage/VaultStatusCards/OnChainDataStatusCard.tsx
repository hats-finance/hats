import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormInput, Pill } from "components";
import { IEditedVaultParameters } from "types";
import { VaultParametersForm } from "pages/VaultEditor/VaultEditorFormPage";
import { VaultStatusContext } from "../store";

export const OnChainDataStatusCard = () => {
  const { t } = useTranslation();

  const { vaultData } = useContext(VaultStatusContext);
  const [editVaultParameters, setEditVaultParameters] = useState(false);
  const [defaultVaultParametersData, setDefaultVaultParametersData] = useState<{ parameters: IEditedVaultParameters }>();

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
  }, [vaultData.parameters]);

  const onChangeOnChainData = (data: { parameters: IEditedVaultParameters }) => {
    console.log(data);
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <span>{t("deployOnChain")}</span>
          <Pill color="blue" text={t("completed")} />
        </div>
      </div>

      <FormInput
        name="editVaultParameters"
        value={`${editVaultParameters}`}
        onChange={(e) => setEditVaultParameters(e.target.checked)}
        type="checkbox"
        label={t("editVaultParameters")}
      />

      {editVaultParameters && (
        <>
          <VaultParametersForm statusCardFormDefaultData={defaultVaultParametersData} onSubmit={onChangeOnChainData} />
        </>
      )}
    </div>
  );
};
