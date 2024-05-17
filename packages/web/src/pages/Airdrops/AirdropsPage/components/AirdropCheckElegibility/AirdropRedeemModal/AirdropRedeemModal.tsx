import { HatSpinner, Loading } from "components";
import { AirdropData } from "pages/Airdrops/types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNetwork, useWaitForTransaction } from "wagmi";
import { DelegateAirdropContract } from "../../../../contracts/DelegateAirdropContract";
import { RedeemAirdropContract } from "../../../../contracts/RedeemAirdropContract";
import { AirdropElegibility, getAirdropElegibility } from "../../../../utils/getAirdropElegibility";
import { AirdropRedeemData, getAirdropRedeemedData } from "../../../../utils/getAirdropRedeemedData";
import { AirdropRedeemCompleted } from "./steps/AirdropRedeemCompleted";
import { AirdropRedeemDelegatee } from "./steps/AirdropRedeemDelegatee";
import { AirdropRedeemQuestionnaire } from "./steps/AirdropRedeemQuestionnaire";
import { AirdropRedeemReview } from "./steps/AirdropRedeemReview";
import { AirdropRedeemStart } from "./steps/AirdropRedeemStart";
import { AirdropRedeemModalContext, IAirdropRedeemModalContext } from "./store";
import { StyledAirdropRedeemModal } from "./styles";

type AirdropRedeemModalProps = {
  airdropData: AirdropData;
  addressToCheck: string;
  closeModal: () => void;
};

const redeemSteps = [
  { element: <AirdropRedeemStart /> },
  { element: <AirdropRedeemQuestionnaire /> },
  { element: <AirdropRedeemDelegatee /> },
  { element: <AirdropRedeemReview /> },
  { element: <AirdropRedeemCompleted /> },
];

export const AirdropRedeemModal = ({ airdropData: aidropData, addressToCheck, closeModal }: AirdropRedeemModalProps) => {
  const { t } = useTranslation();
  const { chain: connectedChain } = useNetwork();

  const [airdropElegibility, setAirdropElegibility] = useState<AirdropElegibility | false>();
  const [redeemData, setRedeemData] = useState<AirdropRedeemData>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDelegatee, setSelectedDelegatee] = useState<string>();

  const nextStep = async () => {
    setCurrentStep((prev) => (prev === redeemSteps.length - 1 ? prev : prev + 1));
  };

  const prevStep = async () => {
    setCurrentStep((prev) => (prev === 0 ? prev : prev - 1));
  };

  const updateAirdropElegibility = useCallback(async () => {
    if (!addressToCheck) return;
    const elegibility = await getAirdropElegibility(addressToCheck, aidropData.descriptionData);
    setAirdropElegibility(elegibility);
    return elegibility;
  }, [addressToCheck, aidropData]);

  const updateAirdropRedeemedData = useCallback(async () => {
    if (!addressToCheck) return;
    const redeemed = await getAirdropRedeemedData(addressToCheck, aidropData);
    setRedeemData(redeemed);
    return redeemed;
  }, [addressToCheck, aidropData]);

  const redeemAirdropCall = RedeemAirdropContract.hook(aidropData, airdropElegibility);
  const waitingRedeemAirdropCall = useWaitForTransaction({
    hash: redeemAirdropCall.data?.hash as `0x${string}`,
    confirmations: 2,
    onSuccess: async () => {
      if (!selectedDelegatee) return;
      try {
        setIsDelegating(true);
        updateAirdropElegibility();
        const newRedeemData = await updateAirdropRedeemedData();
        const txResult = await DelegateAirdropContract.send(aidropData, newRedeemData, selectedDelegatee);
        await txResult?.wait();
        setIsDelegating(false);
      } catch (error) {
        console.log(error);
        setIsDelegating(false);
      }
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

  useEffect(() => {
    if (!isLoading && redeemData) setCurrentStep(redeemSteps.length - 1);
  }, [isLoading, redeemData]);

  const handleClaimAirdrop = async () => {
    return redeemAirdropCall.send();
  };

  const airdropRedeemModalContext = {
    airdropData: aidropData,
    addressToCheck,
    airdropElegibility,
    nextStep,
    prevStep,
    redeemData,
    updateAirdropElegibility,
    updateAirdropRedeemedData,
    selectedDelegatee,
    setSelectedDelegatee,
    isDelegating,
    handleClaimAirdrop,
  } satisfies IAirdropRedeemModalContext;

  // If the user is not eligible or already redeemed, we don't show the modal
  if (!isLoading && airdropElegibility === false) return null;

  return (
    <StyledAirdropRedeemModal>
      {isLoading && <HatSpinner text={t("Airdrop.loadingAirdropInformation")} />}
      {!isLoading && (
        <>
          <AirdropRedeemModalContext.Provider value={airdropRedeemModalContext}>
            {redeemSteps[currentStep].element}
          </AirdropRedeemModalContext.Provider>
        </>
      )}

      {redeemAirdropCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}
      {waitingRedeemAirdropCall.isLoading && <Loading fixed extraText={`${t("redeemingYourAirdrop")}...`} />}
      {isDelegating && <Loading fixed extraText={`${t("Airdrop.delegatingTokens")}...`} />}
    </StyledAirdropRedeemModal>
  );
};
