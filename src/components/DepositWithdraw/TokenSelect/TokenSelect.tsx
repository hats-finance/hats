import { IVault } from "types/types";
import "./index.scss";

interface IProps {
  tokenIcon: string | undefined;
  stakingToken: string;
  stakingTokenSymbol: string;
  tokens: IVault[] | undefined;
  onSelect: (token: string, tokenSymbol: string) => void;
}

export default function TokenSelect({ tokens, onSelect, stakingToken, stakingTokenSymbol, tokenIcon }: IProps) {

  const handleSelect = (e) => {
    const index = e.nativeEvent.target.selectedIndex;
    onSelect(e.target.value, e.nativeEvent.target[index].text);
  }

  return (
    <div className="token-select-wrapper">
      {!tokens ? (
        <div className="token-icon-wrapper">
          <img src={tokenIcon} className="token-icon" alt="token icon" />
          {stakingTokenSymbol}
        </div>
      ) : (
        <select onChange={handleSelect}>
          <option value={stakingToken}>{stakingTokenSymbol}</option>
          {tokens?.map((token, index) => {
            return <option key={index} value={token.stakingToken}>{token.stakingTokenSymbol}</option>
          })}
        </select>
      )}
    </div>
  )
}
