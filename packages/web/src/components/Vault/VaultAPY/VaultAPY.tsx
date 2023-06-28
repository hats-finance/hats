import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import { useVaultsApy } from "hooks/vaults/useVaultsApy";
import Tooltip from "rc-tooltip";
import { IVault } from "types";
import { formatAPY } from "utils";
import "./index.scss";

interface IProps {
  vault: IVault;
}

export default function VaultAPY({ vault }: IProps) {
  const { apys } = useVaultsApy(vault.multipleVaults ?? [vault]);

  const calculateAPY = () => {
    if (vault.multipleVaults) {
      const overlay = Object.values(apys).map((object, index) => {
        return (
          <div key={index} className="vault-apy__multi-token-overlay-wrapper">
            <span>{`${object.tokenSymbol} ${formatAPY(object.apy)}`}</span>
          </div>
        );
      });

      // const sum = Object.values(apys).reduce((accumulator, object) => {
      //   // TODO: if the APY is undefined should we consider it as 0?
      //   return accumulator + (object.apy ?? 0);
      // }, 0);

      //const averagedAPY = sum / Object.values.length;

      return (
        <Tooltip overlay={overlay} overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE} placement="top">
          {/* <span>{formatAPY(averagedAPY)}</span> */}
          <span>-</span>
        </Tooltip>
      );
    } else {
      return "-";
      // return formatAPY(apys[vault.stakingToken].apy);
    }
  };

  return <>{calculateAPY()}</>;
}
