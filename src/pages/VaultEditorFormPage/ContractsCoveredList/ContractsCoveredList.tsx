import { MultiSelectOption } from "components/MultiSelect/MultiSelect";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IContract } from "../types";
import ContractCoveredForm from "./ContractCoveredForm/ContractCoveredForm";

type ContractsCoveredListProps = {
  contracts: IContract[];
  severitiesOptions: Array<MultiSelectOption>;
};

export function ContractsCoveredList({
  severitiesOptions,
}: ContractsCoveredListProps) {
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
