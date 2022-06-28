import { useSelector } from "react-redux";
import Tooltip from "rc-tooltip";
import { RootState } from "reducers";
import millify from "millify";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import { IVault } from "types/types";
import { formatWei } from "utils";
import { calculateUSDValue } from "../utils";
import "./index.scss";

interface IProps {
  vault: IVault;
}

export default function TokensSymbols({ vault }: IProps) {
  const tokensPrices = useSelector((state: RootState) => state.dataReducer.tokenPrices);
  const symbols = vault.multipleVaults ? vault.multipleVaults.map((vault, index) => {
    return (
      <Tooltip
        key={index}
        overlay={`${formatWei(vault.honeyPotBalance, 1, vault.stakingTokenDecimals)}  ≈ $${millify(calculateUSDValue(tokensPrices, vault) ?? 0)}`}
        overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
        placement="top">
        <span className="token-symbol">{vault.stakingTokenSymbol}</span>
      </Tooltip>
    );
  }) : <span className="token-symbol">{vault.stakingTokenSymbol}</span>;

  return (
    <div className="tokens-symbols-wrapper">
      {symbols}
    </div>
  )
}
