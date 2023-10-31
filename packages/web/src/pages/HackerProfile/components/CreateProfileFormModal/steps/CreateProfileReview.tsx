import { IHackerProfile } from "@hats-finance/shared";
import { FormInput, HackerProfileImage } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const CreateProfileReview = () => {
  const { t } = useTranslation();

  const { control } = useEnhancedFormContext<IHackerProfile>();

  const formData = useWatch<IHackerProfile>({ control });

  return (
    <div className="create-profile-step">
      <div className="title">{t("HackerProfile.helloNameReview", { username: formData.username })}</div>

      <HackerProfileImage hackerProfile={formData as IHackerProfile} size="large" />

      <FormInput
        value={formData.username}
        readOnly
        label={t("HackerProfile.username")}
        placeholder={t("HackerProfile.username-placeholder")}
      />
      {formData.title && (
        <FormInput
          value={formData.title}
          readOnly
          label={t("HackerProfile.title")}
          placeholder={t("HackerProfile.title-placeholder")}
        />
      )}
      {formData.bio && (
        <FormInput
          value={formData.bio}
          readOnly
          rows={4}
          type="textarea"
          label={t("HackerProfile.bio")}
          placeholder={t("HackerProfile.bio-placeholder")}
        />
      )}
      <div className="row">
        {formData.twitter_username && (
          <FormInput
            value={formData.twitter_username}
            readOnly
            label={t("HackerProfile.twitter")}
            placeholder={t("HackerProfile.twitter-placeholder")}
          />
        )}
        {formData.github_username && (
          <FormInput
            value={formData.github_username}
            readOnly
            label={t("HackerProfile.github")}
            placeholder={t("HackerProfile.github-placeholder")}
          />
        )}
      </div>
    </div>
  );
};
