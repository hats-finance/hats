import { formatUnits } from "@ethersproject/units";
import { AirdropChainConfig } from "@hats.finance/shared";
import { Loading, Seo } from "components";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IS_PROD } from "settings";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import { DelegateAirdropContract } from "../contracts/DelegateAirdropContract";
import { RedeemAirdropContract } from "../contracts/RedeemAirdropContract";
import { AirdropElegibility, getAirdropElegibility } from "../utils/getAirdropElegibility";
import { AirdropRedeemData, getAirdropRedeemedData } from "../utils/getAirdropRedeemedData";
import { StyledAidropPage } from "./styles";

export const AirdropPage = () => {
  const { t } = useTranslation();
  const { chain: connectedChain } = useNetwork();
  const { address } = useAccount();
  const [airdropElegibility, setAirdropElegibility] = useState<AirdropElegibility | false>();
  const [redeemData, setRedeemData] = useState<AirdropRedeemData>();
  const [isLoading, setIsLoading] = useState(false);

  const delegatee = "0xCC5BD779A1EACeEFA704315A1F504446B6D25a1F";

  const redeemAirdropCall = RedeemAirdropContract.hook(airdropElegibility);
  const delegateAirdropCall = DelegateAirdropContract.hook(redeemData);
  const waitingRedeemAirdropCall = useWaitForTransaction({
    hash: redeemAirdropCall.data?.hash as `0x${string}`,
    onSuccess: () => delegateAirdropCall.send(delegatee),
  });
  const waitingDelegateAirdropCall = useWaitForTransaction({
    hash: delegateAirdropCall.data?.hash as `0x${string}`,
    onSuccess: () => console.log("Ready delegate"),
  });

  useEffect(() => setAirdropElegibility(undefined), [address, connectedChain]);

  return (
    <>
      <Seo title={t("seo.leaderboardTitle")} />
      <StyledAidropPage className="content-wrapper">
        <h2 className="subtitle">{t("airdrop")}</h2>
      </StyledAidropPage>

      <br />
      <br />

      <button
        onClick={async () => {
          if (!address) return;
          setIsLoading(true);

          const isTestnet = !IS_PROD && connectedChain?.testnet;
          const aidropData = AirdropChainConfig[isTestnet ? "test" : "prod"];
          const aidropInfo = { address: aidropData.address, chainId: aidropData.chain.id };

          const elegibility = await getAirdropElegibility(address, aidropInfo);
          setAirdropElegibility(elegibility);
          const redeemed = await getAirdropRedeemedData(address, aidropInfo);
          setRedeemData(redeemed);

          setIsLoading(false);
        }}
      >
        {isLoading ? "Loading..." : "Check airdrop elegibility"}
      </button>

      <br />
      <br />

      {!isLoading && airdropElegibility !== undefined && (
        <>
          {airdropElegibility === false ? (
            <p>You are not eligible</p>
          ) : (
            <div>
              <h2>Congrats! {redeemData ? "You have redeemed your airdrop" : "You are eligible"}</h2>
              <h2>{address}</h2>
              <br />
              <h2>Amount: {formatUnits(airdropElegibility.total, 18)}</h2>
              {airdropElegibility.info.isLocked && (
                <h4>Your tokens will be locked until {airdropElegibility.info.lockEndDate.toDateString()}</h4>
              )}
              <br />

              {Object.keys(airdropElegibility)
                .filter((key) => key !== "total" && key !== "info")
                .map((key) => {
                  const amount = BigNumber.from(airdropElegibility[key]);
                  return (
                    <p key={key}>
                      {key}: {amount.gt(0) ? `Yes ${formatUnits(amount, 18)}` : "No"}
                    </p>
                  );
                })}

              <br />
              <br />

              {!redeemData && <button onClick={redeemAirdropCall.send}>Redeem airdrop</button>}
              {redeemData && redeemData.tokenLock && (
                <>
                  <h3>Token lock information:</h3>
                  <p>Address: {redeemData.tokenLock?.address}</p>
                </>
              )}
              {redeemData && redeemData.delegator && (
                <>
                  <h3>Delegator information:</h3>
                  <p>Delegatee: {redeemData.delegator.delegatee}</p>
                  <p>Votes: {formatUnits(redeemData.delegator.votes, 18)}</p>
                </>
              )}
            </div>
          )}
        </>
      )}

      {redeemAirdropCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}
      {waitingRedeemAirdropCall.isLoading && <Loading fixed extraText={`${t("redeemingYourAirdrop")}...`} />}
      {waitingDelegateAirdropCall.isLoading && <Loading fixed extraText={`${t("delegatingYourAirdrop")}...`} />}
    </>
  );
};
