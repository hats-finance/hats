import { IHackerProfile } from "@hats-finance/shared";
import { FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import { ipfsTransformUri } from "utils";
import { useAccount } from "wagmi";

export const CreateProfileReview = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const { control } = useEnhancedFormContext<IHackerProfile>();

  const { data: createdProfile } = useProfileByAddress(address);

  const formData = useWatch({ control });

  const getProfileAvatar = () => {
    if (formData.avatar)
      return (
        <img
          className="avatar-preview"
          src={createdProfile ? ipfsTransformUri(formData.avatar, { isPinned: true }) : formData.avatar}
          alt="avatar"
        />
      );

    if (formData.github_username)
      return (
        <img
          className="avatar-preview"
          src={`https://github.com/${formData.github_username}.png`}
          alt="avatar directly from github"
        />
      );

    return (
      <div className="mb-5">
        <Identicon string={formData.username} size={144} bg="#fff" />
      </div>
    );
  };

  return (
    <div className="create-profile-step">
      <div className="title">{t("HackerProfile.helloNameReview", { username: formData.username })}</div>

      {getProfileAvatar()}

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
