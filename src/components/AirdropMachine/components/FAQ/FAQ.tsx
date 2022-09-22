import { useState } from "react";
import UpArrowIcon from "assets/icons/up-arrow.icon.svg";
import DownArrowIcon from "assets/icons/down-arrow.icon.svg";
import { useTranslation } from "react-i18next";
import "./index.scss";

export default function FAQ() {
  const { t } = useTranslation();
  const [toggleFAQ, setToggleFAQ] = useState(false);

  return (
    <div className="faq-wrapper">
      <div className="faq__toggle-btn" onClick={() => setToggleFAQ(!toggleFAQ)}>
        FAQ <img src={toggleFAQ ? DownArrowIcon : UpArrowIcon} alt="up arrow" width={12} height={12} />
      </div>
      {toggleFAQ && (
        <div className="faq__qa-container">
          <p>
            <b>{t("AirdropMachine.FAQ.question-1")}</b>
            <span>{t("AirdropMachine.FAQ.answer-1")}</span>
          </p>
          <p>
            <b>{t("AirdropMachine.FAQ.question-2")}</b>
            <span>{t("AirdropMachine.FAQ.answer-2")}</span>
          </p>
          <p>
            <b>{t("AirdropMachine.FAQ.question-3")}</b>
            <span>{t("AirdropMachine.FAQ.answer-3")}</span>
          </p>
          <p>
            <b>{t("AirdropMachine.FAQ.question-4")}</b>
            <span>{t("AirdropMachine.FAQ.answer-4")}</span>
          </p>
          <p>
            <b>{t("AirdropMachine.FAQ.question-5")}</b>
            <span>{t("AirdropMachine.FAQ.answer-5")}</span>
          </p>
        </div>
      )}
    </div>
  )
}
