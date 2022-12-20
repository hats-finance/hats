import { isAddress } from "ethers/lib/utils";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { shortenIfAddress } from "utils/addresses.utils";
import "./ContractsCovered.scss";

interface IProps {
  contracts: Array<{}>;
}

export function ContractsCovered(props: IProps) {
  // TODO: [v2] add link (on the anchor) to contract depending on chain

  return (
    <div className="contracts-covered-wrapper">
      {props.contracts.map((contract: { [key: string]: string }, index: number) => {
        const contractName = Object.keys(contract)[0];
        const contractValue = contract?.[contractName];
        const isLink = isAddress(contractValue) ? false : true;

        return (
          <a key={index} {...defaultAnchorProps} className="contract-wrapper" href={isLink ? contractValue : ""}>
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
