import classNames from "classnames";
import { useTranslation } from "react-i18next";
import "./index.scss";

export default function Languages() {
  const { i18n } = useTranslation();

  return (
    <div className="languages-wrapper">
      {Object.keys(i18n.services.resourceStore.data).map((language, index) =>
        <span
          key={index}
          className={classNames("language", { "selected": i18n.language === language })}
          onClick={() => i18n.changeLanguage(language)}>
          {language.toUpperCase()}
        </span>
      )}
    </div>
  )
}
