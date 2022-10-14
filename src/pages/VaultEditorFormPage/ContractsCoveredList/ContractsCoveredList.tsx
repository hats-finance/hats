import { useFieldArray, useFormContext } from "react-hook-form";
import { IEditedVaultDescription } from "../types";
import ContractCoveredForm from "./ContractCoveredForm/ContractCoveredForm";

export function ContractsCoveredList() {
  const { control } = useFormContext<IEditedVaultDescription>();
  const { fields: contracts, append, remove } = useFieldArray({ control, name: "contracts-covered" });

  return (
    <>
      {contracts.map((contract, index) => (
        <ContractCoveredForm key={contract.id} index={index} append={append} remove={remove} />
      ))}
    </>
  );
}
