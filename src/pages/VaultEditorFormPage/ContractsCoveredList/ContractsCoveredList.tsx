import { useFieldArray, useFormContext } from "react-hook-form";
import { newContract } from "../utils";
import ContractCoveredForm from "./ContractCoveredForm/ContractCoveredForm";


export function ContractsCoveredList() {
  const { control } = useFormContext();
  const { fields: contracts, append, remove } = useFieldArray({ control, name: "contracts-covered" });
  const appendEmpty = () => {
    append(newContract);
  };

  return (
    <>
      {contracts.map((contract, index) => (
        <ContractCoveredForm
          index={index}
          key={index}
          append={appendEmpty}
          remove={remove}
        />
      ))}
    </>
  );
}
