import { NETWORK } from "../../settings";
import { linkToEtherscan, truncatedAddress } from "../../utils";
import CopyToClipboard from "../Shared/CopyToClipboard";


interface IProps {
  multisigAddress: string
}

export default function Multisig(props: IProps) {
  const { multisigAddress } = props;
  return (
    <div className="multi-sig-address-wrapper">
      <a target="_blank"
        rel="noopener noreferrer"
        href={linkToEtherscan(multisigAddress, NETWORK)}
        className="multi-sig-address">
        {truncatedAddress(multisigAddress ?? "")}
      </a>
      <CopyToClipboard value={multisigAddress} />
    </div>
  )
}
