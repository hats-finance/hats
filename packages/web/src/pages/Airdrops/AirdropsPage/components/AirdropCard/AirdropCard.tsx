import { AirdropConfig } from "@hats.finance/shared";
import { Button } from "components";
import { BigNumber } from "ethers";
import { AirdropElegibility, getAirdropElegibility } from "pages/Airdrops/utils/getAirdropElegibility";
import { AirdropRedeemData, getAirdropRedeemedData } from "pages/Airdrops/utils/getAirdropRedeemedData";
import { useCallback, useEffect, useState } from "react";
import { Amount } from "utils/amounts.utils";

type AirdropCardProps = {
  airdrop: AirdropConfig;
  addressToCheck: string;
  onOpenClaimModal: () => void;
  onOpenDelegateModal: () => void;
};

export const AirdropCard = ({ airdrop, addressToCheck, onOpenClaimModal, onOpenDelegateModal }: AirdropCardProps) => {
  const [elegibilityData, setElegibilityData] = useState<AirdropElegibility | false>();
  const [redeemedData, setRedeemedData] = useState<AirdropRedeemData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateElegibility = useCallback(async () => {
    setIsLoading(true);
    const airdropData = { address: airdrop.address, chainId: airdrop.chain.id };
    const [elegibility, redeemded] = await Promise.all([
      getAirdropElegibility(addressToCheck, airdropData),
      getAirdropRedeemedData(addressToCheck, airdropData),
    ]);
    setElegibilityData(elegibility);
    setRedeemedData(redeemded);
    setIsLoading(false);
  }, [addressToCheck, airdrop]);

  useEffect(() => {
    updateElegibility();
  }, [addressToCheck, airdrop, updateElegibility]);

  return (
    <div className="mb-5">
      <h4>{airdrop.address}</h4>
      <p>{airdrop.chain.name}</p>
      {isLoading ? (
        <>Loading...</>
      ) : (
        <>
          {elegibilityData ? (
            <p>Elegible [{new Amount(BigNumber.from(elegibilityData.total), 18, "$HAT").formatted()}]</p>
          ) : (
            <p>Not elegible</p>
          )}
          {redeemedData && <p>Redeemed. Votes: {new Amount(redeemedData.currentVotes, 18).formatted()}</p>}
          {redeemedData?.tokenLock && <p>Token Lock: {redeemedData.tokenLock.address}</p>}
          {redeemedData?.delegator && (
            <p>
              Delegator: {redeemedData.delegator.delegatee} [{new Amount(redeemedData.delegator.votes, 18).formatted()} votes]
            </p>
          )}

          {elegibilityData && (
            <Button size="small" styleType={redeemedData ? "outlined" : "filled"} onClick={onOpenClaimModal}>
              {redeemedData ? "Claimed" : "Claim airdrop"}
            </Button>
          )}

          {redeemedData && (
            <Button size="small" onClick={onOpenDelegateModal}>
              {redeemedData?.delegator ? "Re-delegate" : "Delegate"}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
