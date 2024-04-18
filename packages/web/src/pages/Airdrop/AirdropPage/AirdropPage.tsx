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

  const delegatee = "0xbd0c1BE472245dB26E39ed30C964e9e3132DE555";

  const updateAirdropElegibility = async () => {
    if (!address) return;
    const isTestnet = !IS_PROD && connectedChain?.testnet;
    const aidropData = AirdropChainConfig[isTestnet ? "test" : "prod"];
    const aidropInfo = { address: aidropData.address, chainId: aidropData.chain.id };

    const elegibility = await getAirdropElegibility(address, aidropInfo);
    setAirdropElegibility(elegibility);
    return elegibility;
  };

  const updateAirdropRedeemedData = async () => {
    if (!address) return;
    const isTestnet = !IS_PROD && connectedChain?.testnet;
    const aidropData = AirdropChainConfig[isTestnet ? "test" : "prod"];
    const aidropInfo = { address: aidropData.address, chainId: aidropData.chain.id };

    const redeemed = await getAirdropRedeemedData(address, aidropInfo);
    setRedeemData(redeemed);
    return redeemed;
  };

  const redeemAirdropCall = RedeemAirdropContract.hook(airdropElegibility);
  const waitingRedeemAirdropCall = useWaitForTransaction({
    hash: redeemAirdropCall.data?.hash as `0x${string}`,
    onSuccess: async () => {
      updateAirdropElegibility();
      const newRedeemData = await updateAirdropRedeemedData();
      await DelegateAirdropContract.send(newRedeemData, delegatee);
    },
  });

  useEffect(() => setAirdropElegibility(undefined), [address, connectedChain]);

  return (
    <>
      <Seo title={t("seo.leaderboardTitle")} />
      {/* <button
        onClick={() => {
          const contractInterface = new ethers.utils.Interface(HATAirdrop_abi);
          console.log(
            contractInterface.encodeFunctionData("initialize", [
              "QmXBAjEK29uCKaYaC13SK49z8fUbuQm3dxP1GPah1j1KQL",
              "0xa173d3942100e26f4fd830b3d05d5e480fceea8f9f9e26509683e4c44aaeac7f",
              1713195154,
              1714080754,
              1715808754,
              30,
              "0xbdb34BB8665510d331FacAAaA0eeAe994a5B6612",
              "0x0153A75550E32CDf9a4458301bb89b600e745EAf",
            ])
          );
        }}
      >
        Get Init Data
      </button> */}
      <StyledAidropPage className="content-wrapper">
        <h2 className="subtitle">{t("airdrop")}</h2>
      </StyledAidropPage>

      <br />
      <br />

      <button
        onClick={async () => {
          if (!address) return;
          setIsLoading(true);
          await updateAirdropElegibility();
          await updateAirdropRedeemedData();
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
            </div>
          )}
        </>
      )}

      {redeemAirdropCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}
      {waitingRedeemAirdropCall.isLoading && <Loading fixed extraText={`${t("redeemingYourAirdrop")}...`} />}
    </>
  );
};
