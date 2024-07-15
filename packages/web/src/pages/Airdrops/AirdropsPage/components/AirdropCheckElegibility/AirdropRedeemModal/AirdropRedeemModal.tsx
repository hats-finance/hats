import { HatSpinner, Loading } from "components";
import { RedeemMultipleAirdropsContract } from "pages/Airdrops/contracts/RedeemMultipleAirdropsContract";
import { DropData } from "pages/Airdrops/types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNetwork, useWaitForTransaction } from "wagmi";
import { AirdropElegibility, getAirdropElegibility } from "../../../../utils/getAirdropElegibility";
import { AirdropRedeemData, getAirdropRedeemedData } from "../../../../utils/getAirdropRedeemedData";
import { AirdropRedeemCompleted } from "./steps/AirdropRedeemCompleted";
import { AirdropRedeemDelegatee } from "./steps/AirdropRedeemDelegatee";
import { AirdropRedeemDeposit } from "./steps/AirdropRedeemDeposit";
import { AirdropRedeemQuestionnaire } from "./steps/AirdropRedeemQuestionnaire";
import { AirdropRedeemReview } from "./steps/AirdropRedeemReview";
import { AirdropRedeemStart } from "./steps/AirdropRedeemStart";
import { AirdropRedeemModalContext, IAirdropRedeemModalContext } from "./store";
import { StyledAirdropRedeemModal } from "./styles";

type AirdropRedeemModalProps = {
  airdropsData: DropData[];
  airdropFactory: string;
  addressToCheck: string;
  chainId: number;
};

const redeemSteps = {
  all: [
    { element: <AirdropRedeemStart /> },
    { element: <AirdropRedeemQuestionnaire /> },
    { element: <AirdropRedeemDelegatee /> },
    { element: <AirdropRedeemReview /> },
    { element: <AirdropRedeemDeposit /> },
    { element: <AirdropRedeemCompleted /> },
  ],
  tokenLock: [
    { element: <AirdropRedeemStart /> },
    { element: <AirdropRedeemQuestionnaire /> },
    { element: <AirdropRedeemReview /> },
    { element: <AirdropRedeemCompleted /> },
  ],
};

export const AirdropRedeemModal = ({ airdropsData, addressToCheck, airdropFactory, chainId }: AirdropRedeemModalProps) => {
  const { t } = useTranslation();
  const { chain: connectedChain } = useNetwork();

  const [airdropsElegibility, setAirdropsElegibility] = useState<(AirdropElegibility | undefined)[]>([]);
  const [airdropsRedeemData, setAidropsRedeemData] = useState<(AirdropRedeemData | undefined)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDelegatee, setSelectedDelegatee] = useState<string | "self">();

  const onlyTokenLocks = airdropsData.every((airdrop) => airdrop.isLocked);
  const stepsType = onlyTokenLocks ? "tokenLock" : "all";

  const nextStep = async () => {
    setCurrentStep((prev) => (prev === redeemSteps[stepsType].length - 1 ? prev : prev + 1));
  };

  const prevStep = async () => {
    setCurrentStep((prev) => (prev === 0 ? prev : prev - 1));
  };

  const updateAirdropsElegibility = useCallback(async () => {
    if (!addressToCheck) return [];

    const elegibilities = await Promise.all(
      airdropsData.map((airdrop) => getAirdropElegibility(addressToCheck, airdrop.descriptionData))
    );
    setAirdropsElegibility(elegibilities);
    return elegibilities;
  }, [addressToCheck, airdropsData]);

  const updateAirdropsRedeemedData = useCallback(async () => {
    if (!addressToCheck) return [];

    const redeemed = await Promise.all(airdropsData.map((airdrop) => getAirdropRedeemedData(addressToCheck, airdrop)));
    setAidropsRedeemData(redeemed);
    return redeemed;
  }, [addressToCheck, airdropsData]);

  const redeemAirdropsCall = RedeemMultipleAirdropsContract.hook(airdropsData, airdropsElegibility, airdropFactory, chainId);
  const waitingRedeemAirdropsCall = useWaitForTransaction({
    hash: redeemAirdropsCall.data?.hash as `0x${string}`,
    onSuccess: async () => {
      updateAirdropsElegibility();
      updateAirdropsRedeemedData();
      nextStep();
    },
  });

  useEffect(() => setAirdropsElegibility([]), [addressToCheck, connectedChain]);
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await updateAirdropsElegibility();
      await updateAirdropsRedeemedData();
      setIsLoading(false);
    };
    init();
  }, [updateAirdropsElegibility, updateAirdropsRedeemedData]);

  useEffect(() => {
    // if (!isLoading && airdropsRedeemData.some((air) => !!air)) setCurrentStep(redeemSteps[stepsType].length - 1);
  }, [isLoading, airdropsRedeemData, stepsType]);

  const handleClaimAirdrops = async (percentageToDeposit: number | undefined, vaultToDeposit: string | undefined) => {
    return redeemAirdropsCall.send(percentageToDeposit, vaultToDeposit, selectedDelegatee);
  };

  const airdropRedeemModalContext = {
    airdropsData,
    addressToCheck,
    airdropsElegibility,
    nextStep,
    prevStep,
    airdropsRedeemData,
    updateAirdropsElegibility,
    updateAirdropsRedeemedData,
    selectedDelegatee,
    setSelectedDelegatee,
    handleClaimAirdrops,
    onlyTokenLocks,
  } satisfies IAirdropRedeemModalContext;

  // If the user is not eligible or already redeemed, we don't show the modal
  if (!isLoading && airdropsElegibility.some((elegibility) => !elegibility)) return null;

  return (
    <StyledAirdropRedeemModal>
      {isLoading && <HatSpinner text={t("Airdrop.loadingAirdropInformation")} />}
      {!isLoading && (
        <>
          <AirdropRedeemModalContext.Provider value={airdropRedeemModalContext}>
            {redeemSteps[stepsType][currentStep].element}
          </AirdropRedeemModalContext.Provider>
        </>
      )}

      {redeemAirdropsCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}
      {waitingRedeemAirdropsCall.isLoading && <Loading fixed extraText={`${t("redeemingYourAirdrop")}...`} />}
      {redeemAirdropsCall.isCollectingDelegationSig && <Loading fixed extraText={`${t("Airdrop.delegatingTokens")}...`} />}
      {/* {isDelegating && <Loading fixed extraText={`${t("Airdrop.delegatingTokens")}...`} />} */}
    </StyledAirdropRedeemModal>
  );
};
