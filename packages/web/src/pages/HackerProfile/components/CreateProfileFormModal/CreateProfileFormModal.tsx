import { IHackerProfile } from "@hats-finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBackOutlined";
import HatsBoat from "assets/images/hats_boat.jpg";
import { Alert, Button, Loading, Modal } from "components";
import { queryClient } from "config/reactQuery";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { RoutePaths } from "navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useHackerProfile, useUpsertProfile } from "../../hooks";
import { getCreateProfileYupSchema } from "./formSchema";
import { CreateProfileBio } from "./steps/CreateProfileBio";
import { CreateProfileIntro } from "./steps/CreateProfileIntro";
import { CreateProfileReview } from "./steps/CreateProfileReview";
import { CreateProfileSocials } from "./steps/CreateProfileSocials";
import { CreateProfileTitle } from "./steps/CreateProfileTitle";
import { CreateProfileUsername } from "./steps/CreateProfileUsername";
import { StyledCreateProfileFormModal } from "./styles";

type ICreateProfileFormModalProps = {
  isShowing: boolean;
  onHide: () => void;
};

const createProfileFormSteps = [
  {
    element: <CreateProfileIntro />,
    fields: [],
    nextButtonTextKey: { create: "HackerProfile.soundGreatLetsGo", update: "HackerProfile.updateProfileCta" },
  },
  { element: <CreateProfileUsername />, fields: ["username"], nextButtonTextKey: { create: "continue", update: "continue" } },
  { element: <CreateProfileTitle />, fields: ["title"], nextButtonTextKey: { create: "continue", update: "continue" } },
  { element: <CreateProfileBio />, fields: ["bio"], nextButtonTextKey: { create: "continue", update: "continue" } },
  {
    element: <CreateProfileSocials />,
    fields: ["twitter_username", "github_username", "avatar"],
    nextButtonTextKey: { create: "continue", update: "continue" },
  },
  {
    element: <CreateProfileReview />,
    fields: [],
    nextButtonTextKey: { create: "HackerProfile.createProfileCta", update: "HackerProfile.updateProfileCta" },
  },
];

export const CreateProfileFormModal = ({ isShowing, onHide }: ICreateProfileFormModalProps) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const navigate = useNavigate();
  const { tryAuthentication, isSigningIn } = useSiweAuth();

  const { data: createdProfile, isLoading: isLoadingProfile } = useHackerProfile();

  const [currentFormStep, setCurrentFormStep] = useState<number>(0);
  const isLastStep = currentFormStep === createProfileFormSteps.length - 1;

  const upsertProfile = useUpsertProfile();

  const methods = useForm<IHackerProfile>({
    resolver: yupResolver(getCreateProfileYupSchema(t)),
    mode: "onSubmit",
  });
  const { trigger, handleSubmit, formState, reset } = methods;

  useEffect(() => {
    if (!createdProfile) return;
    reset(createdProfile);
  }, [createdProfile, reset]);

  const nextStep = async () => {
    const isValid = await trigger(createProfileFormSteps[currentFormStep].fields as any);
    if (isValid) setCurrentFormStep((prev) => (prev === createProfileFormSteps.length - 1 ? prev : prev + 1));
  };

  const prevStep = async () => {
    setCurrentFormStep((prev) => (prev === 0 ? prev : prev - 1));
  };

  const handleUpsertProfile = async (formData: IHackerProfile) => {
    if (!formState.isValid) return;

    try {
      const signedIn = await tryAuthentication();
      if (!signedIn) return;

      const profileToUpsert = { ...formData };

      if (createdProfile) {
        profileToUpsert.addresses = createdProfile.addresses;
        profileToUpsert.username = createdProfile.username;
      }

      const result = await upsertProfile.mutateAsync({
        username: createdProfile ? createdProfile.username : undefined,
        profile: profileToUpsert,
      });

      if (result?.upsertedCount || result?.modifiedCount) {
        onHide();
        navigate(`${RoutePaths.profile}/${profileToUpsert.username}`);
        queryClient.invalidateQueries({ queryKey: ["hacker-profile-address", address] });
        setCurrentFormStep(0);
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        capitalizeTitle
        isShowing={isShowing}
        title={createdProfile ? t("HackerProfile.updateProfile") : t("HackerProfile.createProfile")}
        onHide={onHide}
      >
        <FormProvider {...methods}>
          <StyledCreateProfileFormModal firstStep={currentFormStep === 0}>
            {!isLastStep && <img className="hats-boat" src={HatsBoat} alt="Hats boat" />}
            {createProfileFormSteps[currentFormStep].element}
            {!!upsertProfile.error && <Alert type="error" content={upsertProfile.error} />}
            <div className="buttons">
              {currentFormStep !== 0 && (
                <Button disabled={upsertProfile.isLoading} styleType="outlined" onClick={prevStep}>
                  <ArrowBackIcon />
                </Button>
              )}
              <Button
                disabled={formState.isValidating || upsertProfile.isLoading}
                onClick={isLastStep ? handleSubmit(handleUpsertProfile) : nextStep}
              >
                {formState.isValidating || upsertProfile.isLoading
                  ? `${t("loading")}...`
                  : t(createProfileFormSteps[currentFormStep].nextButtonTextKey[createdProfile ? "update" : "create"])}
              </Button>
            </div>
          </StyledCreateProfileFormModal>
        </FormProvider>
      </Modal>
      {isLoadingProfile && <Loading fixed extraText={`${t("HackerProfile.loadingProfile")}...`} />}
      {isSigningIn && <Loading fixed extraText={`${t("signingInWithEthereum")}...`} />}
    </>
  );
};
