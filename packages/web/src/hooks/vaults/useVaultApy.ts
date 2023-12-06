import { formatUnits } from "@ethersproject/units";
import { IRewardController, IVault } from "@hats-finance/shared";
import { BigNumber } from "ethers";
import { useBlockNumber } from "wagmi";

type IVaultApy = {
  rewardController: IRewardController;
  apy: number;
};

export const useVaultApy = (vault?: IVault): IVaultApy[] => {
  const { data: blockNumber, isError, isLoading } = useBlockNumber({ chainId: vault?.chainId, watch: false });

  if (isError || isLoading || !blockNumber) return [];
  if (!vault) return [];
  if (vault.version === "v1") return [];

  const rewardControllers = vault.rewardControllers || [];
  if (!rewardControllers || rewardControllers.length === 0) return [];

  const allocPoints = vault.allocPoints || [];
  if (!allocPoints || allocPoints.length === 0) return [];

  const vaultApys: IVaultApy[] = [];
  for (const [idx, controller] of rewardControllers.entries()) {
    if (!controller) continue;
    const allocPoint = +allocPoints[idx] ?? 0;

    const blocksPassed = blockNumber - +controller.startBlock;
    const epochsPassed = Math.floor(blocksPassed / +controller.epochLength);
    const epochRewardPerBlockBigNumber =
      +controller.epochRewardPerBlock[
        epochsPassed > controller.epochRewardPerBlock.length - 1 ? controller.epochRewardPerBlock.length - 1 : epochsPassed
      ] ?? 0;
    const epochRewardPerBlock = +formatUnits(BigNumber.from(`${epochRewardPerBlockBigNumber}`), controller.rewardTokenDecimals);

    const apy = calculateAPY(
      allocPoint,
      epochRewardPerBlock,
      +controller.totalAllocPoint,
      +controller.epochLength * 12,
      vault.amountsInfo?.tokenPriceUsd && controller.tokenPriceUsd
        ? controller.tokenPriceUsd / vault.amountsInfo.tokenPriceUsd
        : 0,
      vault.amountsInfo?.depositedAmount ? +vault.amountsInfo.depositedAmount.tokens : 0
    );

    vaultApys.push({ rewardController: controller, apy });
  }

  console.log(vaultApys);
  return vaultApys;
};

function calculateAPY(
  allocPoint: number,
  _epochRewardPerBlock: number,
  totalAllocPoint: number,
  blocksPerYear: number,
  tokenPrice: number,
  vaultTokenStaked: number
): number {
  // Calculate the total reward per block for the vault
  const vaultRewardPerBlock = (_epochRewardPerBlock * allocPoint) / totalAllocPoint;

  // Calculate the total annual reward for the vault
  const annualReward = vaultRewardPerBlock * blocksPerYear;

  // Convert the annual reward to its equivalent value in fiat/crypto
  const annualRewardValue = annualReward * tokenPrice;

  // Calculate the APY
  // Note: vaultTokenStaked should be the total value of tokens staked in the vault
  // in the same currency as tokenPrice for an accurate APY calculation
  const apy = (annualRewardValue / vaultTokenStaked) * 100;

  return apy > 100 ? +apy.toFixed(0) : +apy.toFixed(2);
}
