import { IHackerProfile } from "@hats-finance/shared";
import { FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const CreateProfileBio = () => {
  const { t } = useTranslation();
  const { register, control } = useEnhancedFormContext<IHackerProfile>();

  const username = useWatch({ control, name: "username" });
  const bio = useWatch({ control, name: "bio" });

  return (
    <div className="create-profile-step">
      <div className="title">{t("HackerProfile.introduceYourself", { username })}</div>

      <p className="mb-5">{t("HackerProfile.bioIntro")}</p>

      <FormInput
        {...register("bio")}
        rows={4}
        type="textarea"
        label={t("HackerProfile.bio")}
        colorable
        placeholder={t("HackerProfile.bio-placeholder")}
        helper={bio?.length ? `${bio?.length} ${t("characters")}` : ""}
      />
    </div>
  );
};
