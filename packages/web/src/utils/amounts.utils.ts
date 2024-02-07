import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "ethers";

export class Amount {
  amount: BigNumber | undefined;
  decimals: number;
  symbol: string | undefined;

  static fromBalanceResult(balanceRes: any | undefined): Amount {
    return new this(balanceRes?.value ?? BigNumber.from(0), balanceRes?.decimals ?? 18, balanceRes?.symbol);
  }

  constructor(amount: BigNumber | undefined, decimals: number | string, symbol?: string) {
    this.amount = amount;
    this.decimals = +decimals;
    this.symbol = symbol;
  }

  get bigNumber() {
    return this.amount ? this.amount : BigNumber.from(0);
  }

  get number() {
    return this.amount ? Number(formatUnits(this.amount, this.decimals)) : 0;
  }

  formattedWithoutSymbol(decimals = 5) {
    return `${this.amount ? this.truncateNDecimals(decimals) : "-"}`;
  }

  formatted(decimals = 5) {
    const symbol = this.symbol ? ` ${this.symbol}` : "";
    return `${this.formattedWithoutSymbol(decimals)}${symbol}`;
  }

  get string() {
    return this.amount ? formatUnits(this.amount, this.decimals) : "0";
  }

  private truncateNDecimals(decimals: number) {
    // truncate n decimals and remove trailing zeros
    const [int, decimal] = this.string.split(".");
    if (!decimal) return int;
    const decimalPart = decimal.substring(0, decimals).replace(/0+$/, "");
    return `${int}${decimalPart ? `.${decimalPart}` : ""}`;
  }
}

export function toFixedIfNecessary(value: string | number, dp: number) {
  return +parseFloat(`${value}`).toFixed(dp);
}

export function numberWithThousandSeparator(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
