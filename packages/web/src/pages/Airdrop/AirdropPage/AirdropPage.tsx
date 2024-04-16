import { Loading, Seo } from "components";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IS_PROD } from "settings";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import { RedeemAirdropContract } from "../contracts/RedeemAirdrop";
import { AirdropElegibility } from "../types";
import { getAirdropElegibility } from "../utils/getAirdropElegibility";
import { AirdropRedeemStatus, getAirdropRedeemStatus } from "../utils/getAirdropRedeemStatus";
import { StyledAidropPage } from "./styles";

export const AirdropPage = () => {
  const { t } = useTranslation();
  const { chain: connectedChain } = useNetwork();
  const { address } = useAccount();
  const [airdropElegibility, setAirdropElegibility] = useState<AirdropElegibility | false>();
  const [redeemStatus, setRedeemStatus] = useState<AirdropRedeemStatus>();

  const redeemAirdropCall = RedeemAirdropContract.hook(airdropElegibility);
  const waitingRedeemAirdropCall = useWaitForTransaction({
    hash: redeemAirdropCall.data?.hash as `0x${string}`,
    // onSuccess: () => showSuccessModal(),
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
        onClick={() => {
          if (!address) return;
          const isTestnet = !IS_PROD && connectedChain?.testnet;

          getAirdropElegibility(address, isTestnet ? "test" : "prod").then(setAirdropElegibility);
          getAirdropRedeemStatus(address, isTestnet ? "test" : "prod").then(setRedeemStatus);
        }}
      >
        Check Elegibility
      </button>

      <br />
      <br />

      {airdropElegibility !== undefined && (
        <>
          {airdropElegibility === false ? (
            <p>You are not eligible</p>
          ) : (
            <div>
              <h2>Congrats! {redeemStatus === "redeemed" ? "You have redeemed your airdrop" : "You are eligible"}</h2>
              <h2>{address}</h2>
              <br />
              <h2>Amount: {ethers.utils.formatUnits(airdropElegibility.total, 18)}</h2>
              <br />

              {Object.keys(airdropElegibility)
                .filter((key) => key !== "total")
                .map((key) => (
                  <p key={key}>
                    {key}: {BigNumber.from(airdropElegibility[key]).gt(0) ? "Yes" : "No"}
                  </p>
                ))}

              <br />
              <br />

              {redeemStatus === "redeemable" && <button onClick={redeemAirdropCall.send}>Redeem airdrop</button>}
            </div>
          )}
        </>
      )}

      {redeemAirdropCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}
      {waitingRedeemAirdropCall.isLoading && <Loading fixed extraText={`${t("redeemingYourAirdrop")}...`} />}
    </>
  );
};
