import { CHAINID } from "../../settings";
import { isAddress } from "ethers/lib/utils";
import { shortenAddress } from "@usedapp/core";
import { Chains } from "../../constants/constants";
import { defaultAnchorProps } from "constants/defaultAnchorProps";

interface IProps {
  contracts: Array<{}>
}

export function ContractsCovered(props: IProps) {
  const chain = Chains[CHAINID];

  return (
    <>
      {props.contracts.map((contract: { [key: string]: string; }, index: number) => {
        const contractName = Object.keys(contract)[0];
        const contractVaule = contract?.[contractName];
        const isLink = isAddress(contractVaule) ? false : true;

        return (
          <a key={index} {...defaultAnchorProps} className="contract-wrapper" href={isLink ? contractVaule : chain?.getExplorerAddressLink(contractVaule)}>
            <span title={contractName} className="contract-name">{contractName}</span>
            <span title={contractVaule} className="contract-value">{isLink ? contractVaule : shortenAddress(contractVaule)}</span>
          </a>
        )
      })}
    </>
  )
}
