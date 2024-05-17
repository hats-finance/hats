import { HatSpinner, Loading } from "components";
import { AirdropData } from "pages/Airdrops/types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNetwork } from "wagmi";
import { DelegateAirdropContract } from "../../../../contracts/DelegateAirdropContract";
import { AirdropElegibility, getAirdropElegibility } from "../../../../utils/getAirdropElegibility";
import { AirdropRedeemData, getAirdropRedeemedData } from "../../../../utils/getAirdropRedeemedData";
import { AirdropDelegateDelegatee } from "./steps/AirdropDelegateDelegatee";
import { AirdropDelegateReview } from "./steps/AirdropDelegateReview";
import { AirdropDelegateModalContext, IAirdropDelegateModalContext } from "./store";
import { StyledAirdropRedeemModal } from "./styles";

type AirdropDelegateModalProps = {
  airdropData: AirdropData;
  addressToCheck: string;
  closeModal: () => void;
};

const redeemSteps = [{ element: <AirdropDelegateDelegatee /> }, { element: <AirdropDelegateReview /> }];

export const AirdropDelegateModal = ({ airdropData, addressToCheck, closeModal }: AirdropDelegateModalProps) => {
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
    const elegibility = await getAirdropElegibility(addressToCheck, airdropData.descriptionData);
    setAirdropElegibility(elegibility);
    return elegibility;
  }, [addressToCheck, airdropData]);

  const updateAirdropRedeemedData = useCallback(async () => {
    if (!addressToCheck) return;
    const redeemed = await getAirdropRedeemedData(addressToCheck, airdropData);
    setRedeemData(redeemed);
    return redeemed;
  }, [addressToCheck, airdropData]);

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

  const handleDelegateAidrop = async () => {
    if (!selectedDelegatee) return;
    try {
      setIsDelegating(true);
      updateAirdropElegibility();
      const newRedeemData = await updateAirdropRedeemedData();
      const txResult = await DelegateAirdropContract.send(airdropData, newRedeemData, selectedDelegatee);
      await txResult?.wait();
      closeModal();
      setIsDelegating(false);
    } catch (error) {
      console.log(error);
      setIsDelegating(false);
    }
  };

  const airdropRedeemModalContext = {
    airdropData,
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
    handleDelegateAidrop,
  } satisfies IAirdropDelegateModalContext;

  // If the user is not eligible or already redeemed, we don't show the modal
  if (!isLoading && airdropElegibility === false) return null;

  return (
    <StyledAirdropRedeemModal>
      {isLoading && <HatSpinner text={t("Airdrop.loadingAirdropInformation")} />}
      {!isLoading && (
        <>
          <AirdropDelegateModalContext.Provider value={airdropRedeemModalContext}>
            {redeemSteps[currentStep].element}
          </AirdropDelegateModalContext.Provider>
        </>
      )}

      {isDelegating && <Loading fixed extraText={`${t("Airdrop.delegatingTokens")}...`} />}
    </StyledAirdropRedeemModal>
  );
};
