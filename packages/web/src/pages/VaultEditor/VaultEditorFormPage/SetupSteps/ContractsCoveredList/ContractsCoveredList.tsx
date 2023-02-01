import { useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "components";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import ContractCoveredForm from "./ContractCoveredForm/ContractCoveredForm";
import { IEditedVaultDescription } from "types";
import { createNewCoveredContract } from "@hats-finance/shared";
import AddIcon from "@mui/icons-material/Add";

export function ContractsCoveredList() {
  const { t } = useTranslation();

  const { control } = useEnhancedFormContext<IEditedVaultDescription>();
  const { fields: contracts, append, remove } = useFieldArray<IEditedVaultDescription>({ control, name: "contracts-covered" });

  const severitiesOptions = useWatch({ control, name: "severitiesOptions" });
  const severitiesFormIds = useMemo(
    () => (severitiesOptions ? severitiesOptions.map((sev) => sev.value) : []),
    [severitiesOptions]
  );

  return (
    <>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorContractsCoveredExplanation") }} />

      {contracts.map((contract, index) => (
        <ContractCoveredForm key={contract.id} index={index} append={append} remove={remove} contractsCount={contracts.length} />
      ))}

      <Button styleType="invisible" onClick={() => append(createNewCoveredContract(severitiesFormIds))}>
        <AddIcon className="mr-1" />
        <span>{t("addContractAsset")}</span>
      </Button>

      <p className="helper-text">
        {t("totalAmountOfContracts")}: <strong>{contracts.length}</strong>
      </p>
    </>
  );
}
