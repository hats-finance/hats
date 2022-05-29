import { IVault } from "types/types";

interface IProps {
  tokens: IVault[]
  onSelect: (token: string, tokenSymbol: string) => void;
}

export default function TokenSelect({ tokens, onSelect }: IProps) {

  const handleSelect = (e) => {
    const index = e.nativeEvent.target.selectedIndex;
    onSelect(e.target.value, e.nativeEvent.target[index].text);
  }

  return (
    <select onChange={handleSelect}>
      {tokens.map((token, index) => {
        return <option key={index} value={token.stakingToken}>{token.stakingTokenSymbol}</option>
      })}
    </select>
  )
}
