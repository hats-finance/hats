import { AirdropFactoriesChainConfig } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { useAirdropsByFactories } from "pages/Airdrops/hooks";
import { DropData, PointdropDescriptionData } from "pages/Airdrops/types";
import { AirdropRedeemData, getAirdropRedeemedData } from "pages/Airdrops/utils/getAirdropRedeemedData";
import { DropDataConvertible } from "pages/MyWallet/types";
import { useEffect, useMemo, useState } from "react";
import { IS_PROD } from "settings";
import { useAccount, useNetwork } from "wagmi";

export const useAccountConvertibleTokens = () => {
  const { address: account } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const isTestnet = connectedChain?.testnet;
  const env = isTestnet && !IS_PROD ? "test" : "prod";

  const { data: pointdropsData, isLoading } = useAirdropsByFactories(AirdropFactoriesChainConfig[env].pointdrop);
  const eligiblePointdrops = useMemo(
    () =>
      (account &&
        pointdropsData?.filter((airdrop) =>
          Object.keys(airdrop.descriptionData.merkletree).find((add) => add.toLowerCase() === account.toLowerCase())
        )) ??
      [],
    [account, pointdropsData]
  );

  const [redeemedData, setRedeemedData] = useState<{ [airdropAddress: string]: AirdropRedeemData | undefined }>();
  const wasRedeemed = (airdrop: string) => !!redeemedData && !!redeemedData[airdrop];

  // Check if the address has redeemed the airdrops
  useEffect(() => {
    if (isLoading || !eligiblePointdrops || !account) return;
    const fetchRedeemedData = async () => {
      const redeemedData = await Promise.all(
        eligiblePointdrops.map(async (pointdrop) => {
          const redeemedData = await getAirdropRedeemedData(account, pointdrop);
          return { [pointdrop.address]: redeemedData };
        })
      );

      const redeemedDataMap = redeemedData.reduce((acc, data) => ({ ...acc, ...data }), {});
      setRedeemedData(redeemedDataMap);
    };

    fetchRedeemedData();
  }, [eligiblePointdrops, isLoading, account]);

  const redeemablePointdrops =
    eligiblePointdrops?.filter((pointdrop) => !wasRedeemed(pointdrop.address) && pointdrop.isLive) ?? [];
  const redeemedPointdrops = eligiblePointdrops?.filter((pointdrop) => wasRedeemed(pointdrop.address)) ?? [];

  const getPointdropsBreakdown = (pointdrops: DropData[]) => {
    return (
      (account &&
        pointdrops.map((pointdrop) => {
          const merkletree = Object.entries((pointdrop.descriptionData as PointdropDescriptionData).merkletree).find(
            ([add]) => add.toLowerCase() === account.toLowerCase()
          )?.[1]!;

          return {
            ...pointdrop,
            points: Number(merkletree.converted_points),
            tokens: BigNumber.from(merkletree.token_eligibility.converted_from_points),
          } as DropDataConvertible;
        })) ??
      []
    );
  };

  const redeemable = getPointdropsBreakdown(redeemablePointdrops);
  const redeemed = getPointdropsBreakdown(redeemedPointdrops);

  return {
    redeemable,
    redeemed,
    totalRedeemable: {
      points: redeemable.reduce((acc, airdrop) => acc + Number(airdrop.points), 0),
      tokens: redeemable.reduce((acc, airdrop) => acc.add(airdrop.tokens), BigNumber.from(0)),
    },
    totalRedeemed: {
      points: redeemed.reduce((acc, airdrop) => acc + Number(airdrop.points), 0),
      tokens: redeemed.reduce((acc, airdrop) => acc.add(airdrop.tokens), BigNumber.from(0)),
    },
  };
};
