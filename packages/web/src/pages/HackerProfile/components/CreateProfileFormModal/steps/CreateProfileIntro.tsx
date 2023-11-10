import { useTranslation } from "react-i18next";

export const CreateProfileIntro = () => {
  const { t } = useTranslation();

  return (
    <div className="create-profile-step">
      <div className="title">{t("HackerProfile.introTitle")}</div>
      <div dangerouslySetInnerHTML={{ __html: t("HackerProfile.introContent") }} />
    </div>
  );
};
