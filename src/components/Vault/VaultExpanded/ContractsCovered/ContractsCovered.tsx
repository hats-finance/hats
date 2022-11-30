import { shortenAddress } from "@usedapp/core";
import { isAddress } from "ethers/lib/utils";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import "./ContractsCovered.scss";

interface IProps {
  contracts: Array<{}>;
}

export function ContractsCovered(props: IProps) {
  // TODO: [v2] add link to contract depending on chain

  return (
    <div className="contracts-covered-wrapper">
      {props.contracts.map((contract: { [key: string]: string }, index: number) => {
        const contractName = Object.keys(contract)[0];
        const contractVaule = contract?.[contractName];
        const isLink = isAddress(contractVaule) ? false : true;

        return (
          <a key={index} {...defaultAnchorProps} className="contract-wrapper" href={isLink ? contractVaule : ""}>
            <span title={contractName} className="contract-name">
              {contractName}
            </span>
            <span title={contractVaule} className="contract-value">
              {isLink ? contractVaule : shortenAddress(contractVaule)}
            </span>
          </a>
        );
      })}
    </div>
  );
}
