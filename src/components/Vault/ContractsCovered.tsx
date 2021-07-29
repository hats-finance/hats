import { NETWORK } from "../../settings";
import { linkToEtherscan, truncatedAddress } from "../../utils";

interface IProps {
  contracts: Array<string>
}

export default function ContractsCovered(props: IProps) {
  return (
    <>
      {props.contracts.map((contract: string, index: number) => {
        const contractName = Object.keys(contract)[0];
        return (
          <a key={index} target="_blank" rel="noopener noreferrer" className="contract-wrapper" href={linkToEtherscan(contract?.[contractName], NETWORK)}>
            <span className="contract-name">{contractName}</span>
            <span>{truncatedAddress(contract?.[contractName])}</span>
          </a>
        )
      })}
    </>
  )
}
