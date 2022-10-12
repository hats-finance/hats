import { MultiSelectOption } from "components/MultiSelect/MultiSelect";
import React from "react";
import { IContract } from "../types";
import ContractCoveredCard from "./ContractCoveredCard/ContractCoveredCard";

type ContractsCoveredProps = {
  contracts: IContract[];
  severitiesOptions: Array<MultiSelectOption>;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRemove: (index: number) => void;
  addContract: () => void;
};

export function ContractsCovered({
  contracts,
  severitiesOptions,
  onChange,
  onRemove,
  addContract,
}: ContractsCoveredProps) {
  return (
    <>
      {contracts.map((contract, index) => (
        <ContractCoveredCard
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
