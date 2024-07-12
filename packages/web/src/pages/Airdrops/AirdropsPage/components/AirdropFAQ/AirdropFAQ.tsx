import { CollapsableTextContent } from "components";
import { useTranslation } from "react-i18next";
import { StyledFAQ } from "./styles";

export const AirdropFAQ = () => {
  const { t } = useTranslation();

  return (
    <StyledFAQ>
      <h2 className="mb-4">{t("Airdrop.faqTitle")}</h2>
      {[...Array(12).keys()].map((_, index) => (
        <div className="mb-2" key={index}>
          <CollapsableTextContent titleBold color="white" title={t(`Airdrop.FAQ.title-${index + 1}`)}>
            <div dangerouslySetInnerHTML={{ __html: t(`Airdrop.FAQ.content-${index + 1}`) }} />
          </CollapsableTextContent>
        </div>
      ))}
    </StyledFAQ>
  );
};
