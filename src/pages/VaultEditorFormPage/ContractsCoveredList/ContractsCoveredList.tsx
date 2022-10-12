import { MultiSelectOption } from "components/MultiSelect/MultiSelect";
import React from "react";
import { IContract } from "../types";
import ContractCoveredForm from "./ContractCoveredForm/ContractCoveredForm";

type ContractsCoveredListProps = {
  contracts: IContract[];
  severitiesOptions: Array<MultiSelectOption>;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRemove: (index: number) => void;
  addContract: () => void;
};

export function ContractsCoveredList({
  contracts,
  severitiesOptions,
  onChange,
  onRemove,
  addContract,
}: ContractsCoveredListProps) {
  return (
    <>
      {contracts.map((contract, index) => (
        <ContractCoveredForm
          index={index}
          key={index}
          contract={contract}
          severitiesOptions={severitiesOptions}
          contractsCount={contracts.length}
          onChange={onChange}
          onRemove={onRemove}
          addContract={addContract}
        />
      ))}
    </>
  );
}
