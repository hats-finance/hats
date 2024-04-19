import { formatUnits } from "@ethersproject/units";
import { AirdropConfig } from "@hats.finance/shared";
import { HatSpinner, Loading } from "components";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNetwork, useWaitForTransaction } from "wagmi";
import { DelegateAirdropContract } from "../../../contracts/DelegateAirdropContract";
import { RedeemAirdropContract } from "../../../contracts/RedeemAirdropContract";
import { AirdropElegibility, getAirdropElegibility } from "../../../utils/getAirdropElegibility";
import { AirdropRedeemData, getAirdropRedeemedData } from "../../../utils/getAirdropRedeemedData";
import { AirdropRedeemDelegatee } from "./steps/AirdropRedeemDelegatee";
import { AirdropRedeemQuestionnaire } from "./steps/AirdropRedeemQuestionnaire";
import { AirdropRedeemReview } from "./steps/AirdropRedeemReview";
import { AirdropRedeemStart } from "./steps/AirdropRedeemStart";
import { AirdropRedeemModalContext, IAirdropRedeemModalContext } from "./store";
import { StyledAirdropRedeemModal } from "./styles";

type AirdropRedeemModalProps = {
  aidropData: AirdropConfig;
  addressToCheck: string;
  closeModal: () => void;
};

const redeemSteps = [
  { element: <AirdropRedeemStart /> },
  { element: <AirdropRedeemQuestionnaire /> },
  { element: <AirdropRedeemDelegatee /> },
  { element: <AirdropRedeemReview /> },
];

export const AirdropRedeemModal = ({ aidropData, addressToCheck, closeModal }: AirdropRedeemModalProps) => {
  const { t } = useTranslation();
  const { chain: connectedChain } = useNetwork();

  const [airdropElegibility, setAirdropElegibility] = useState<AirdropElegibility | false>();
  const [redeemData, setRedeemData] = useState<AirdropRedeemData>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = async () => {
    setCurrentStep((prev) => (prev === redeemSteps.length - 1 ? prev : prev + 1));
  };

  const prevStep = async () => {
    setCurrentStep((prev) => (prev === 0 ? prev : prev - 1));
  };

  const delegatee = "0xbd0c1BE472245dB26E39ed30C964e9e3132DE555";

  const updateAirdropElegibility = useCallback(async () => {
    if (!addressToCheck) return;
    const aidropInfo = { address: aidropData.address, chainId: aidropData.chain.id };

    const elegibility = await getAirdropElegibility(addressToCheck, aidropInfo);
    setAirdropElegibility(elegibility);
    return elegibility;
  }, [addressToCheck, aidropData]);

  const updateAirdropRedeemedData = useCallback(async () => {
    if (!addressToCheck) return;
    const aidropInfo = { address: aidropData.address, chainId: aidropData.chain.id };

    const redeemed = await getAirdropRedeemedData(addressToCheck, aidropInfo);
    setRedeemData(redeemed);
    return redeemed;
  }, [addressToCheck, aidropData]);

  const redeemAirdropCall = RedeemAirdropContract.hook(aidropData, airdropElegibility);
  const waitingRedeemAirdropCall = useWaitForTransaction({
    hash: redeemAirdropCall.data?.hash as `0x${string}`,
    onSuccess: async () => {
      updateAirdropElegibility();
      const newRedeemData = await updateAirdropRedeemedData();
      await DelegateAirdropContract.send(aidropData, newRedeemData, delegatee);
    },
  });

  useEffect(() => setAirdropElegibility(undefined), [addressToCheck, connectedChain]);
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await updateAirdropElegibility();
      await updateAirdropRedeemedData();
      setIsLoading(false);
    };
    init();
  }, [updateAirdropElegibility, updateAirdropRedeemedData]);

  const airdropRedeemModalContext = {
    addressToCheck,
    airdropElegibility,
    nextStep,
    prevStep,
    redeemData,
    updateAirdropElegibility,
    updateAirdropRedeemedData,
  } satisfies IAirdropRedeemModalContext;

  // If the user is not eligible or already redeemed, we don't show the modal
  if (!isLoading && airdropElegibility === false) return null;
  if (!isLoading && redeemData) return null;

  return (
    <StyledAirdropRedeemModal>
      {isLoading && <HatSpinner text={t("Airdrop.loadingAirdropInformation")} />}
      {!isLoading && (
        <>
          <AirdropRedeemModalContext.Provider value={airdropRedeemModalContext}>
            {redeemSteps[currentStep].element}
          </AirdropRedeemModalContext.Provider>

          {/* {!isLoading && airdropElegibility !== undefined && (
  <>
    {airdropElegibility === false ? (
      <p>You are not eligible</p>
    ) : (
      <div>
        <h2>Congrats! {redeemData ? "You have redeemed your airdrop" : "You are eligible"}</h2>
        <h2>{addressToCheck}</h2>
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
)} */}
        </>
      )}

      {redeemAirdropCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}
      {waitingRedeemAirdropCall.isLoading && <Loading fixed extraText={`${t("redeemingYourAirdrop")}...`} />}
    </StyledAirdropRedeemModal>
  );
};
