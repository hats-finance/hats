import { useTranslation } from "react-i18next";

export const ErrorMessage = ({ error }) => {
    const { t } = useTranslation();
    console.log(error);

    return <span className="error">{t(error.message)}</span>;
}