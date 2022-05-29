import { IAdditionalVaults } from "types/types";

interface IProps {
  stakingToken: string;
  stakingTokenSymbol: string;
  additionalVaults: IAdditionalVaults[];
  onSelect: (token: string, tokenSymbol: string) => void;
}

export default function TokenSelect({ stakingToken, stakingTokenSymbol, additionalVaults, onSelect }: IProps) {
  const tokens = additionalVaults.map((token, index) => {
    return <option key={index} value={token.token}>{token.tokenSymbol}</option>
  })

  const handleSelect = (e) => {
    const index = e.nativeEvent.target.selectedIndex;
    onSelect(e.target.value, e.nativeEvent.target[index].text);
  }

  return (
    <select onChange={handleSelect}>
      <option value={stakingToken}>{stakingTokenSymbol}</option>
      {tokens}
    </select>
  )
}
