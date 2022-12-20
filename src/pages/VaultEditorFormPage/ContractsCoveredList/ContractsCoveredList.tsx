import { useFieldArray } from "react-hook-form";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import ContractCoveredForm from "./ContractCoveredForm/ContractCoveredForm";
import { IEditedVaultDescription } from "../types";

export function ContractsCoveredList() {
  const { control } = useEnhancedFormContext<IEditedVaultDescription>();
  const { fields: contracts, append, remove } = useFieldArray<IEditedVaultDescription>({ control, name: "contracts-covered" });

  return (
    <>
      {contracts.map((contract, index) => (
        <ContractCoveredForm key={contract.id} index={index} append={append} remove={remove} contractsCount={contracts.length} />
      ))}
    </>
  );
}
