import { useTranslation } from "react-i18next";

export const CreateProfileWelcome = () => {
  const { t } = useTranslation();

  return (
    <div className="create-profile-step">
      <div className="title">{t("HackerProfile.welcomeTitle")}</div>
      <div dangerouslySetInnerHTML={{ __html: t("HackerProfile.welcomeContent") }} />
    </div>
  );
};
