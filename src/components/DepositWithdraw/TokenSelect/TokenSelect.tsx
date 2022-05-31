import { IVault } from "types/types";
import "./index.scss";

interface IProps {
  vault: IVault
  onSelect: (pid: string) => void;
}

export default function TokenSelect({ vault, onSelect }: IProps) {

  const handleSelect = (e) => {
    onSelect(e.target.value);
  }

  return (
    <div className="token-select-wrapper">
      {vault.multipleVaults ? (
        <select onChange={handleSelect}>
          {vault.multipleVaults?.map((vault, index) => {
            return <option key={index} value={vault.pid}>{vault.stakingTokenSymbol}</option>
          })}
        </select>
      ) : (
        <div className="token-icon-wrapper">
          <img src={vault.description?.["project-metadata"].tokenIcon} className="token-icon" alt="token icon" />
          {vault.stakingTokenSymbol}
        </div>
      )}
    </div>
  )
}
