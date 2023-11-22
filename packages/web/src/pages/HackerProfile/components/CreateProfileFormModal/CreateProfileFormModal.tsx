import { IHackerProfile } from "@hats-finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBackOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import HatsBoat from "assets/images/profile-creation.jpg";
import { Alert, Button, Loading, Modal } from "components";
import { queryClient } from "config/reactQuery";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import useConfirm from "hooks/useConfirm";
import { RoutePaths } from "navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useDeleteProfile, useProfileByAddress, useUpsertProfile } from "../../hooks";
import { getCreateProfileYupSchema } from "./formSchema";
import { CreateProfileBio } from "./steps/CreateProfileBio";
import { CreateProfileIntro } from "./steps/CreateProfileIntro";
import { CreateProfileReview } from "./steps/CreateProfileReview";
import { CreateProfileSocials } from "./steps/CreateProfileSocials";
import { CreateProfileTitle } from "./steps/CreateProfileTitle";
import { CreateProfileUsername } from "./steps/CreateProfileUsername";
import { CreateProfileWelcome } from "./steps/CreateProfileWelcome";
import { StyledCreateProfileFormModal } from "./styles";

type ICreateProfileFormModalProps = {
  isShowing: boolean;
  onHide: () => void;
};

const createProfileFormSteps = [
  {
    element: <CreateProfileWelcome />,
    fields: [],
    nextButtonTextKey: { create: "HackerProfile.letsDiveIn", update: "HackerProfile.letsDiveIn" },
  },
  {
    element: <CreateProfileIntro />,
    fields: [],
    nextButtonTextKey: { create: "HackerProfile.createProfileCta", update: "HackerProfile.updateProfileCta" },
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
  const confirm = useConfirm();
  const { tryAuthentication, isSigningIn } = useSiweAuth();

  const { data: createdProfile, isInitialLoading: isLoadingProfile } = useProfileByAddress(address);

  const [currentFormStep, setCurrentFormStep] = useState<number>(0);
  const isLastStep = currentFormStep === createProfileFormSteps.length - 1;

  const upsertProfile = useUpsertProfile();
  const deleteProfile = useDeleteProfile();

  const methods = useForm<IHackerProfile>({
    resolver: yupResolver(getCreateProfileYupSchema(t)),
    mode: "onBlur",
  });
  const { trigger, handleSubmit, formState, reset } = methods;

  useEffect(() => {
    reset(createdProfile ?? {}, { keepDefaultValues: true });
    setCurrentFormStep(createdProfile ? 2 : 0);
  }, [createdProfile, address, reset]);

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
        queryClient.invalidateQueries({ queryKey: ["all-profiles"] });
        setCurrentFormStep(0);
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProfile = async () => {
    if (!createdProfile) return;

    const signedIn = await tryAuthentication();
    if (!signedIn) return;

    const wantsToDelete = await confirm({
      title: t("HackerProfile.deleteProfile"),
      titleIcon: <DeleteIcon className="mr-2" fontSize="large" />,
      description: t("HackerProfile.deleteProfileDescription"),
      cancelText: t("no"),
      confirmText: t("delete"),
      confirmTextInput: {
        label: t("HackerProfile.username"),
        placeholder: t("HackerProfile.username-placeholder"),
        textToConfirm: createdProfile.username,
      },
    });

    if (!wantsToDelete) return;

    const wasDeleted = await deleteProfile.mutateAsync({ username: createdProfile.username });
    if (wasDeleted) {
      onHide();
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["hacker-profile-address", address] });
      queryClient.invalidateQueries({ queryKey: ["all-profiles"] });
      setCurrentFormStep(0);
      reset();
    }
  };

  return (
    <>
      <Modal capitalizeTitle isShowing={isShowing} onHide={onHide}>
        <FormProvider {...methods}>
          <StyledCreateProfileFormModal firstStep={currentFormStep === 0 && !createdProfile}>
            {!isLastStep && <img className="hats-boat" src={HatsBoat} alt="Hats boat" />}
            {createProfileFormSteps[currentFormStep].element}
            <div className="alerts">
              {!!upsertProfile.error && <Alert type="error" content={upsertProfile.error} />}
              {!!deleteProfile.error && <Alert type="error" content={deleteProfile.error} />}
            </div>
            <div className="buttons">
              {currentFormStep === 0 && createdProfile && (
                <Button textColor="error" styleType="invisible" onClick={handleDeleteProfile}>
                  <DeleteIcon className="mr-2" /> {t("HackerProfile.deleteProfile")}
                </Button>
              )}
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
