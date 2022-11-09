import Tooltip from "rc-tooltip";
import millify from "millify";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import { IVault } from "types/types";
import { formatWei } from "utils";
import { useVaultsTotalPrices } from "../hooks/useVaultsTotalPrices";
import "./index.scss";

interface IProps {
  vault: IVault;
}

export default function VaultTokens({ vault }: IProps) {
  const { totalPrices } = useVaultsTotalPrices(vault.multipleVaults ?? [vault]);

  const symbols = vault.multipleVaults ? (
    vault.multipleVaults.map((vault, index) => {
      return (
        <Tooltip
          key={index}
          overlay={`${formatWei(vault.honeyPotBalance, 1, vault.stakingTokenDecimals)}  ≈ $${millify(
            totalPrices[vault.stakingToken] ?? 0
          )}`}
          overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
          placement="top">
          <span className="token-symbol">{vault.stakingTokenSymbol}</span>
        </Tooltip>
      );
    })
  ) : (
    <span className="token-symbol">{vault.stakingTokenSymbol}</span>
  );

  return <div className="tokens-symbols-wrapper">{symbols}</div>;
}
