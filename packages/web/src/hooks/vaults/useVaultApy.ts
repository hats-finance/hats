import { Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { IRewardController, IVault } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useBlockNumber, useProvider } from "wagmi";

export type IVaultApy = {
  rewardController: IRewardController;
  apy: number;
};

export const useVaultApy = (vault?: IVault): IVaultApy[] => {
  const provider = useProvider();
  const [vaultApys, setVaultApys] = useState<IVaultApy[]>([]);
  const { data: blockNumber } = useBlockNumber({ chainId: vault?.chainId, watch: false });

  useEffect(() => {
    if (!blockNumber) return setVaultApys([]);
    if (!vault) return setVaultApys([]);
    if (vault.version === "v1") return setVaultApys([]);

    const rewardControllers = vault.rewardControllers || [];
    if (!rewardControllers || rewardControllers.length === 0) return setVaultApys([]);

    const allocPoints = vault.allocPoints || [];
    if (!allocPoints || allocPoints.length === 0) return setVaultApys([]);

    const computeApy = async () => {
      const apys: IVaultApy[] = [];

      for (const [idx, controller] of rewardControllers.entries()) {
        if (!controller) continue;

        const blocksPerYear = await calculateBlocksPerYear(controller, provider);
        const allocPoint = +allocPoints[idx] ?? 0;
        const blocksPassed = blockNumber - +controller.startBlock;
        const epochsPassed = Math.floor(blocksPassed / +controller.epochLength);
        const epochRewardPerBlockBigNumber =
          +controller.epochRewardPerBlock[
            epochsPassed > controller.epochRewardPerBlock.length - 1 ? controller.epochRewardPerBlock.length - 1 : epochsPassed
          ] ?? 0;
        const epochRewardPerBlock = +formatUnits(
          BigNumber.from(`${epochRewardPerBlockBigNumber}`),
          controller.rewardTokenDecimals
        );

        const apy = calculateAPY(
          allocPoint,
          epochRewardPerBlock,
          +controller.totalAllocPoint,
          blocksPerYear,
          vault.amountsInfo?.tokenPriceUsd && controller.tokenPriceUsd
            ? controller.tokenPriceUsd / vault.amountsInfo.tokenPriceUsd
            : 0,
          vault.amountsInfo?.depositedAmount ? +vault.amountsInfo.depositedAmount.tokens : 0
        );

        apys.push({ rewardController: controller, apy });
      }

      setVaultApys(apys);
    };
    computeApy();
  }, [blockNumber, provider, vault]);

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

async function calculateBlocksPerYear(controller: IRewardController, provider: Provider): Promise<number> {
  const startedBlock = await provider.getBlock(+controller.startBlock);
  const currentBlock = await provider.getBlock("latest");

  const blocksPassed = currentBlock.number - startedBlock.number;
  const blocksPerSecond = blocksPassed / (currentBlock.timestamp - startedBlock.timestamp);
  const blocksPerYear = blocksPerSecond * 60 * 60 * 24 * 365;

  return blocksPerYear;
}
