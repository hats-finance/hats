import { ChainsConfig } from "@hats-finance/shared";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { isAddress, shortenIfAddress } from "utils/addresses.utils";
import { IVault } from "types";
import "./ContractsCovered.scss";

interface ContractsCoveredProps {
  contracts: Array<{}>;
  vault: IVault;
}

export function ContractsCovered({ contracts, vault }: ContractsCoveredProps) {
  const vaultChain = vault.chainId ? ChainsConfig[vault.chainId] : undefined;
  const blockExplorer = vaultChain?.chain.blockExplorers?.etherscan.url;

  return (
    <div className="contracts-covered-wrapper">
      {contracts.map((contract: { [key: string]: string }, index: number) => {
        const contractName = Object.keys(contract)[0];
        const contractValue = contract?.[contractName];
        const isLink = isAddress(contractValue) ? false : true;
        const blockExplorerLink = !isLink ? `${blockExplorer}/address/${contractValue}` : null;

        return (
          <a key={index} {...defaultAnchorProps} className="contract-wrapper" href={blockExplorerLink ?? contractValue}>
            <span title={contractName} className="contract-name">
              {contractName}
            </span>
            <span title={contractValue} className="contract-value">
              {isLink ? contractValue : shortenIfAddress(contractValue)}
            </span>
          </a>
        );
      })}
    </div>
  );
}
