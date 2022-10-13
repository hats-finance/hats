import { useFieldArray, useFormContext } from "react-hook-form";
import ContractCoveredForm from "./ContractCoveredForm/ContractCoveredForm";


export function ContractsCoveredList() {
  const { control } = useFormContext();
  const { fields: contracts, append, remove } = useFieldArray({ control, name: "contracts-covered" });

  return (
    <>
      {contracts.map((contract, index) => (
        <ContractCoveredForm
          index={index}
          key={index}
          //          contractsCount={contracts.length}
          append={append}
          remove={remove}
        />
      ))}
    </>
  );
}
