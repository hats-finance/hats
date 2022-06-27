import { IVault } from "types/types";
import "./index.scss";

interface IProps {
  vault: IVault;
}

export default function TokensSymbols({ vault }: IProps) {
  const symbols = vault.multipleVaults ? vault.multipleVaults.map((vault, index) => {
    return <span key={index} className="token-symbol">{vault.stakingTokenSymbol}</span>;
  }) : <span className="token-symbol">{vault.stakingTokenSymbol}</span>;

  return (
    <div className="tokens-symbols-wrapper">
      {symbols}
    </div>
  )
}
