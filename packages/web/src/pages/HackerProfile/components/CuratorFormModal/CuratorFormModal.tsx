import { IHackerProfile } from "@hats.finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBackOutlined";
import { Alert, Button, Loading, Modal } from "components";
import { queryClient } from "config/reactQuery";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { useCreateCuratorApplication, useProfileByAddress } from "../../hooks";
import { getCuratorFormYupSchema } from "./formSchema";
import { CuratorCommunication } from "./steps/CuratorCommunication";
import { CuratorRoles } from "./steps/CuratorRoles";
import { CuratorServices } from "./steps/CuratorServices";
import { CuratorShortBio } from "./steps/CuratorShortBio";
import { CuratorSubmitted } from "./steps/CuratorSubmitted";
import { CuratorTermsAndConditions } from "./steps/CuratorTermsAndConditions";
import { CuratorWelcome } from "./steps/CuratorWelcome";
import { CuratorWhyInterested } from "./steps/CuratorWhyInterested";
import { CuratorWorkedWeb3 } from "./steps/CuratorWorkedWeb3";
import { StyledCuratorFormModal } from "./styles";

type ICuratorFormModalProps = {
  isShowing: boolean;
  onHide: () => void;
};

const curatorFormSteps = [
  {
    element: <CuratorWelcome />,
    fields: [],
    nextButtonTextKey: { create: "next", update: "next" },
  },
  { element: <CuratorRoles />, fields: ["roles"], nextButtonTextKey: { create: "next", update: "next" } },
  { element: <CuratorServices />, fields: ["services"], nextButtonTextKey: { create: "next", update: "next" } },
  { element: <CuratorWhyInterested />, fields: ["whyInterested"], nextButtonTextKey: { create: "next", update: "next" } },
  {
    element: <CuratorWorkedWeb3 />,
    fields: ["workedWithweb3Security", "workedWithweb3SecurityDescription"],
    nextButtonTextKey: { create: "next", update: "next" },
  },
  { element: <CuratorShortBio />, fields: ["shortBio"], nextButtonTextKey: { create: "next", update: "next" } },
  {
    element: <CuratorCommunication />,
    fields: ["telegramHandle", "discordHandle"],
    nextButtonTextKey: { create: "next", update: "next" },
  },
  {
    element: <CuratorTermsAndConditions />,
    fields: ["termsAndConditions"],
    nextButtonTextKey: { create: "submit", update: "submit" },
  },
  {
    element: <CuratorSubmitted />,
    fields: [],
    nextButtonTextKey: { create: "gotIt", update: "gotIt" },
  },
];

export type CuratorFormType = NonNullable<IHackerProfile["curatorApplication"]>;

export const CuratorFormModal = ({ isShowing, onHide }: ICuratorFormModalProps) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { tryAuthentication } = useSiweAuth();

  const { data: createdProfile, isInitialLoading: isLoadingProfile } = useProfileByAddress(address);
  const createdCuratorApplication = createdProfile?.curatorApplication;

  const [currentFormStep, setCurrentFormStep] = useState<number>(0);
  const isSubmitStep = currentFormStep === curatorFormSteps.length - 2;
  const isLastStep = currentFormStep === curatorFormSteps.length - 1;

  const createCuratorApplication = useCreateCuratorApplication();

  const methods = useForm<CuratorFormType>({
    resolver: yupResolver(getCuratorFormYupSchema(t)),
    mode: "onChange",
  });
  const { trigger, handleSubmit, formState } = methods;

  const nextStep = async () => {
    const isValid = await trigger(curatorFormSteps[currentFormStep].fields as any);
    if (isLastStep) onHide();
    if (isValid) setCurrentFormStep((prev) => (prev === curatorFormSteps.length - 1 ? prev : prev + 1));
  };

  const prevStep = async () => {
    setCurrentFormStep((prev) => (prev === 0 ? prev : prev - 1));
  };

  const handleUpsertCuratorApplication = async (formData: CuratorFormType) => {
    if (!formState.isValid) return;

    try {
      const signedIn = await tryAuthentication();
      if (!signedIn) return;

      const curatorApplication = { ...formData };

      const result = await createCuratorApplication.mutateAsync({
        username: createdProfile ? createdProfile.username : undefined,
        curatorForm: curatorApplication,
      });

      if (result?.upsertedCount || result?.modifiedCount) {
        queryClient.invalidateQueries({ queryKey: ["hacker-profile-address", address] });
        queryClient.invalidateQueries({ queryKey: ["all-profiles"] });
        nextStep();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal capitalizeTitle isShowing={isShowing} onHide={onHide}>
        <FormProvider {...methods}>
          <StyledCuratorFormModal firstStep={currentFormStep === 0 || isLastStep}>
            {curatorFormSteps[currentFormStep].element}
            <div className="alerts">
              {!!createCuratorApplication.error && <Alert type="error" content={createCuratorApplication.error} />}
            </div>
            <div className="buttons">
              {currentFormStep !== 0 && currentFormStep !== curatorFormSteps.length - 1 && (
                <Button disabled={createCuratorApplication.isLoading} styleType="outlined" onClick={prevStep}>
                  <ArrowBackIcon />
                </Button>
              )}
              <Button
                bigHorizontalPadding
                disabled={formState.isValidating || createCuratorApplication.isLoading}
                onClick={isSubmitStep ? handleSubmit(handleUpsertCuratorApplication) : nextStep}
              >
                {formState.isValidating || createCuratorApplication.isLoading
                  ? `${t("loading")}...`
                  : t(curatorFormSteps[currentFormStep].nextButtonTextKey[createdCuratorApplication ? "update" : "create"])}
              </Button>
            </div>
          </StyledCuratorFormModal>
        </FormProvider>
      </Modal>
      {isLoadingProfile && <Loading fixed extraText={`${t("HackerProfile.loadingCuratorApplication")}...`} />}
    </>
  );
};
