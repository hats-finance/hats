import { IHackerProfile } from "@hats.finance/shared";
import { FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const CreateProfileTitle = () => {
  const { t } = useTranslation();
  const { register, control } = useEnhancedFormContext<IHackerProfile>();

  const username = useWatch({ control, name: "username" });
  const title = useWatch({ control, name: "title" });

  return (
    <div className="create-profile-step">
      <div className="title">{t("HackerProfile.helloName", { username })}</div>
      <p className="mb-5">{t("HackerProfile.titleIntro")}</p>

      <FormInput
        {...register("title")}
        label={t("HackerProfile.title")}
        colorable
        placeholder={t("HackerProfile.title-placeholder")}
        helper={title?.length ? `${title?.length} ${t("characters")}` : ""}
      />

      {/* <p className="mb-5">{t("HackerProfile.bioIntro")}</p>

      <FormInput
        {...register("bio")}
        rows={4}
        type="textarea"
        label={t("HackerProfile.bio")}
        colorable
        placeholder={t("HackerProfile.bio-placeholder")}
      /> */}
    </div>
  );
};
