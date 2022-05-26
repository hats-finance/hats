import { IAdditionalToken } from "types/types";

interface IProps {
  stakingTokenSymbol: string;
  additionalTokens: IAdditionalToken[];
}

export default function TokenSelect({ stakingTokenSymbol, additionalTokens }: IProps) {
  const tokens = additionalTokens.map(token => {
    return <option>{token.tokenSymbol}</option>
  })

  return (
    <select>
      <option>{stakingTokenSymbol}</option>
      {tokens}
    </select>
  )
}
