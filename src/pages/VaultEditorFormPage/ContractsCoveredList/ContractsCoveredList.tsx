import { useFieldArray, useFormContext } from "react-hook-form";
import ContractCoveredForm from "./ContractCoveredForm/ContractCoveredForm";
import { IEditedVaultDescription } from "../types";

export function ContractsCoveredList() {
  const { control } = useFormContext<IEditedVaultDescription>();
  const { fields: contracts, append, remove } = useFieldArray<IEditedVaultDescription>({ control, name: "contracts-covered" });

  return (
    <>
      {contracts.map((contract, index) => (
        <ContractCoveredForm key={contract.id} index={index} append={append} remove={remove} />
      ))}
    </>
  );
}
