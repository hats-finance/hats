import { shortenIfAddress } from "@usedapp/core";
import { isAddress } from "ethers/lib/utils";
import { CHAINID, CHAINS } from "settings";
import CopyToClipboard from "components/CopyToClipboard";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import "./Multisig.scss";

interface IProps {
  multisigAddress: string;
}

export default function Multisig(props: IProps) {
  const { multisigAddress } = props;
  const chain = CHAINS[CHAINID].chain;

  return (
    <div className="multi-sig-address-wrapper">
      <a {...defaultAnchorProps} href={chain?.getExplorerAddressLink(multisigAddress)} className="multi-sig-address">
        {isAddress(multisigAddress) && shortenIfAddress(multisigAddress)}
      </a>
      {isAddress(multisigAddress) && <CopyToClipboard value={multisigAddress} />}
    </div>
  );
}
