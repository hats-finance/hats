import { useSelector } from "react-redux";
import DepositWithdraw from "./DepositWithdraw";
import Loading from "./Shared/Loading";
import "../styles/LiquidityPools.scss";
import { IVault } from "../types/types";
import { RootState } from "../reducers";
import { isProviderAndNetwork } from "../utils";
import { NETWORK } from "../settings";

export default function LiquidityPools() {
  const poolsData = useSelector((state: RootState) => state.dataReducer.vaults);
  // Meanwhile we have just Uniswap pool so we take the first we find.
  const pool = poolsData.find((element: IVault) => element.liquidityPool);
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);

  // TODO: if no liquidity pool should show "no pools" instead of inifinite spinner
  return (
    <div className="content liquidity-pools-wrapper">
      {!isProviderAndNetwork(provider) ? <span>{`Please connect the wallet to ${NETWORK}`}</span> : pool === undefined ? <Loading fixed /> : <DepositWithdraw data={pool} isPool={true} />}
    </div>
  )
}
