import { useState } from "react";
import Tooltip from "rc-tooltip";
import useModal from "hooks/useModal";
import InfoIcon from "assets/icons/info.icon";
import ZoomIcon from "assets/icons/zoom.icon";
import { formatNumber, ipfsTransformUri } from "utils";
import { IVault } from "types";
import { NFTPrize, Modal, Media } from "components";
import { useSeverityReward } from "components/Vault/hooks/useSeverityReward";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE, VAULTS_TYPE_SEVERITIES_COLORS } from "constants/constants";

interface IProps {
  vault: IVault;
  index: number;
}

export default function Award({ vault, index: severityIndex }: IProps) {
  const { rewardPrice, rewardPercentage } = useSeverityReward(vault, severityIndex) ?? { rewardPercentage: 0, rewardPrice: 0 };
  const severity = vault.description?.severities[severityIndex];
  const { isShowing, show, hide } = useModal();
  const [modalNFTData, setModalNFTData] = useState({});
  const orderedSeverities = vault?.description?.severities.map((severity) => severity.index).sort((a, b) => a - b);
  const severitiesColors = VAULTS_TYPE_SEVERITIES_COLORS[vault.description?.["project-metadata"].type ?? "normal"];

  let cellColor: string = "";

  if (vault.version === "v1") {
    const severity = vault.description?.severities[severityIndex];
    cellColor = severitiesColors?.[orderedSeverities?.indexOf(severity?.index) ?? 0];
  }
  // TODO: and for version v2?

  return (
    <tr>
      <td style={{ backgroundColor: cellColor }}>{severity?.name.toUpperCase()}</td>
      <td style={{ backgroundColor: cellColor }} className="total-vault-wrapper">
        <b>{`${rewardPercentage.toFixed(2)}%`}</b> of vault &#8776; {`$${formatNumber(rewardPrice)}`}&nbsp;
        <Tooltip
          overlay="Prizes are in correlation to the funds in the vault and may change at any time"
          overlayClassName="tooltip"
          overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
        >
          <span>
            <InfoIcon width="15" height="15" fill={Colors.white} />
          </span>
        </Tooltip>
      </td>
      <td
        style={{ backgroundColor: cellColor }}
        className="nft-wrapper"
        onClick={() => {
          show();
          if (severity) setModalNFTData(severity);
        }}
      >
        {severity?.["nft-metadata"] ? (
          <>
            <Media link={ipfsTransformUri(severity["nft-metadata"]?.image)} className="nft-wrapper__video" />
            <ZoomIcon />
          </>
        ) : (
          "No NFT data"
        )}
      </td>
      {isShowing && (
        <Modal title="NFT PRIZE" isShowing={isShowing} onHide={hide}>
          <NFTPrize data={modalNFTData as any} />
        </Modal>
      )}
    </tr>
  );
}
