import { CHAINID } from "../../settings";
import { linkToEtherscan, truncatedAddress } from "../../utils";
import CopyToClipboard from "../Shared/CopyToClipboard";
import "./Multisig.scss";

interface IProps {
  multisigAddress: string
}

export default function Multisig(props: IProps) {
  const { multisigAddress } = props;
  return (
    <div className="multi-sig-address-wrapper">
      <a target="_blank"
        rel="noopener noreferrer"
        href={linkToEtherscan(multisigAddress, CHAINID)}
        className="multi-sig-address">
        {truncatedAddress(multisigAddress ?? "")}
      </a>
      <CopyToClipboard value={multisigAddress} />
    </div>
  )
}
