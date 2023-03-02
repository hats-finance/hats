import { CopyToClipboard } from "components";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { isAddress, shortenIfAddress } from "utils/addresses.utils";
import "./Multisig.scss";

interface IProps {
  multisigAddress: string;
}

export default function Multisig(props: IProps) {
  const { multisigAddress } = props;

  // TODO: [v2] add anchor link to the multisig depending on chain

  return (
    <div className="multi-sig-address-wrapper">
      <a {...defaultAnchorProps} className="multi-sig-address">
        {isAddress(multisigAddress) && shortenIfAddress(multisigAddress)}
      </a>
      {isAddress(multisigAddress) && <CopyToClipboard valueToCopy={multisigAddress} />}
    </div>
  );
}
