import { IHackerProfile } from "@hats.finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBackOutlined";
import HatsBoat from "assets/images/profile-creation.jpg";
import { Alert, Button, Loading, Modal } from "components";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useProfileByAddress, useUpsertProfile } from "../../hooks";
import { getCuratorFormYupSchema } from "./formSchema";
import { CuratorRoles } from "./steps/CuratorRoles";
import { CuratorWelcome } from "./steps/CuratorWelcome";
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
  // {
  //   element: <CreateProfileIntro />,
  //   fields: [],
  //   nextButtonTextKey: { create: "HackerProfile.createProfileCta", update: "HackerProfile.updateProfileCta" },
  // },
  // { element: <CreateProfileTitle />, fields: ["title"], nextButtonTextKey: { create: "continue", update: "continue" } },
  // { element: <CreateProfileBio />, fields: ["bio"], nextButtonTextKey: { create: "continue", update: "continue" } },
  // {
  //   element: <CreateProfileSocials />,
  //   fields: ["twitter_username", "github_username", "avatar"],
  //   nextButtonTextKey: { create: "continue", update: "continue" },
  // },
  // {
  //   element: <CreateProfileReview />,
  //   fields: [],
  //   nextButtonTextKey: { create: "HackerProfile.createProfileCta", update: "HackerProfile.updateProfileCta" },
  // },
];

type CuratorFormType = NonNullable<IHackerProfile["curatorApplication"]>;

export const CuratorFormModal = ({ isShowing, onHide }: ICuratorFormModalProps) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { tryAuthentication } = useSiweAuth();

  const { data: createdProfile, isInitialLoading: isLoadingProfile } = useProfileByAddress(address);
  const createdCuratorApplication = createdProfile?.curatorApplication;

  const [currentFormStep, setCurrentFormStep] = useState<number>(0);
  const isLastStep = currentFormStep === curatorFormSteps.length - 1;

  const upsertCuratorApplication = useUpsertProfile();

  const methods = useForm<CuratorFormType>({
    resolver: yupResolver(getCuratorFormYupSchema(t)),
    mode: "onBlur",
  });
  const { trigger, handleSubmit, formState, reset } = methods;

  const nextStep = async () => {
    const isValid = await trigger(curatorFormSteps[currentFormStep].fields as any);
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

      // const profileToUpsert = { ...formData };

      // if (createdProfile) {
      //   profileToUpsert.addresses = createdProfile.addresses;
      //   profileToUpsert.username = createdProfile.username;
      // }

      // const result = await upsertProfile.mutateAsync({
      //   username: createdProfile ? createdProfile.username : undefined,
      //   profile: profileToUpsert,
      // });

      // if (result?.upsertedCount || result?.modifiedCount) {
      //   onHide();
      //   navigate(`${RoutePaths.profile}/${profileToUpsert.username}`);
      //   queryClient.invalidateQueries({ queryKey: ["hacker-profile-address", address] });
      //   queryClient.invalidateQueries({ queryKey: ["all-profiles"] });
      //   setCurrentFormStep(0);
      //   reset();
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal capitalizeTitle isShowing={isShowing} onHide={onHide}>
        <FormProvider {...methods}>
          <StyledCuratorFormModal firstStep={currentFormStep === 0 && !createdCuratorApplication}>
            {curatorFormSteps[currentFormStep].element}
            <div className="alerts">
              {!!upsertCuratorApplication.error && <Alert type="error" content={upsertCuratorApplication.error} />}
            </div>
            <div className="buttons">
              {currentFormStep !== 0 && (
                <Button disabled={upsertCuratorApplication.isLoading} styleType="outlined" onClick={prevStep}>
                  <ArrowBackIcon />
                </Button>
              )}
              <Button
                bigHorizontalPadding
                disabled={formState.isValidating || upsertCuratorApplication.isLoading}
                onClick={isLastStep ? handleSubmit(handleUpsertCuratorApplication) : nextStep}
              >
                {formState.isValidating || upsertCuratorApplication.isLoading
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
