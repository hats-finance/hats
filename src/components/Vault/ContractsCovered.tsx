import { NETWORK } from "../../settings";
import { linkToEtherscan, truncatedAddress } from "../../utils";
import { isAddress } from "ethers/lib/utils";

interface IProps {
  contracts: Array<{}>
}

export default function ContractsCovered(props: IProps) {
  return (
    <>
      {props.contracts.map((contract: { [key: string]: string; }, index: number) => {
        const contractName = Object.keys(contract)[0];
        const contractVaule = contract?.[contractName];
        const isLink = isAddress(contractVaule) ? false : true;

        return (
          <a key={index} target="_blank" rel="noopener noreferrer" className="contract-wrapper" href={isLink ? contractVaule : linkToEtherscan(contractVaule, NETWORK)}>
            <span title={contractName} className="contract-name">{contractName}</span>
            <span title={contractVaule} className="contract-value">{isLink ? contractVaule : truncatedAddress(contractVaule)}</span>
          </a>
        )
      })}
    </>
  )
}
