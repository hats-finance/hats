import { IAdditionalVaults } from "types/types";

interface IProps {
  stakingTokenSymbol: string;
  additionalVaults: IAdditionalVaults[];
}

export default function TokenSelect({ stakingTokenSymbol, additionalVaults }: IProps) {
  const tokens = additionalVaults.map(token => {
    return <option>{token.tokenSymbol}</option>
  })

  return (
    <select>
      <option>{stakingTokenSymbol}</option>
      {tokens}
    </select>
  )
}
