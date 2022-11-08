import { BigNumber } from "ethers";
import { formatUnits } from "@ethersproject/units";

export class Amount {
  amount: BigNumber | undefined;
  decimals: string;
  symbol: string | undefined;

  constructor(amount: BigNumber | undefined, decimals: string, symbol?: string) {
    this.amount = amount;
    this.decimals = decimals;
    this.symbol = symbol;
  }

  get bigNumber() {
    return this.amount ? this.amount : BigNumber.from(0);
  }

  get number() {
    return this.amount ? Number(formatUnits(this.amount, this.decimals)) : 0;
  }

  get formattedWithoutSymbol() {
    return `${this.amount ? truncateNDecimalsFromString(formatUnits(this.amount, this.decimals), 3) : "-"}`;
  }

  get formatted() {
    const symbol = this.symbol ? ` ${this.symbol}` : "";
    return `${this.formattedWithoutSymbol}${symbol}`;
  }
}

function truncateNDecimalsFromString(str: string, n: number) {
  const parts = str.split(".");
  if (parts.length === 1) return str;

  return parts[0] + "." + parts[1].substring(0, n);
}
