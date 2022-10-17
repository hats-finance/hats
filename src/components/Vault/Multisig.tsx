import { CHAINID } from "../../settings";
import CopyToClipboard from "../CopyToClipboard";
import "./Multisig.scss";
import { Chains } from "../../constants/constants";
import { shortenIfAddress } from "@usedapp/core";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { isAddress } from "ethers/lib/utils";

interface IProps {
  multisigAddress: string
}

export default function Multisig(props: IProps) {
  const { multisigAddress } = props;
  const chain = Chains[CHAINID];

  return (
    <div className="multi-sig-address-wrapper">
      <a
        {...defaultAnchorProps}
        href={chain?.getExplorerAddressLink(multisigAddress)}
        className="multi-sig-address">
        {isAddress(multisigAddress) && shortenIfAddress(multisigAddress)}
      </a>
      {isAddress(multisigAddress) && <CopyToClipboard value={multisigAddress} />}
    </div>
  )
}
