import { IHackerProfile } from "@hats.finance/shared";
import { FormIconInput, FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const CreateProfileSocials = () => {
  const { t } = useTranslation();
  const { register, control } = useEnhancedFormContext<IHackerProfile>();

  const username = useWatch({ control, name: "username" });

  return (
    <div className="create-profile-step">
      <div className="title">{t("HackerProfile.addYourSocialsName", { username })}</div>

      <p className="mb-5">{t("HackerProfile.socialsIntro")}</p>
      <FormInput
        {...register("twitter_username")}
        label={t("HackerProfile.twitter")}
        colorable
        placeholder={t("HackerProfile.twitter-placeholder")}
      />
      <FormInput
        {...register("github_username")}
        label={t("HackerProfile.github")}
        colorable
        placeholder={t("HackerProfile.github-placeholder")}
      />

      <p className="mb-5">{t("HackerProfile.avatarIntro")}</p>
      <FormIconInput {...register("avatar")} type="image" colorable label={t("HackerProfile.avatar")} />
      <p className="mt-5">{t("HackerProfile.avatarGithubProdileImageExplanation")}</p>
    </div>
  );
};
