import { shortenIfAddress } from "@usedapp/core";
import { isAddress } from "ethers/lib/utils";
import CopyToClipboard from "components/CopyToClipboard";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import "./Multisig.scss";

interface IProps {
  multisigAddress: string;
}

export default function Multisig(props: IProps) {
  const { multisigAddress } = props;

  // TODO: [v2] add link to the multisig depending on chain

  return (
    <div className="multi-sig-address-wrapper">
      <a {...defaultAnchorProps} className="multi-sig-address">
        {isAddress(multisigAddress) && shortenIfAddress(multisigAddress)}
      </a>
      {isAddress(multisigAddress) && <CopyToClipboard value={multisigAddress} />}
    </div>
  );
}
