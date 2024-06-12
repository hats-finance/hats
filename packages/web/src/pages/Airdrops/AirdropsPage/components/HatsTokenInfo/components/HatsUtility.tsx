import { useTranslation } from "react-i18next";

const UTILITIES = [1, 2, 3];

export const HatsUtility = () => {
  const { t } = useTranslation();

  return (
    <div className="hats-utility">
      <h3>{t("Airdrop.hatsTokenUtility")}</h3>

      <div className="utilities">
        {UTILITIES.map((index) => {
          return (
            <div key={index} className="utility">
              <img src={require(`../assets/utility-${index}.png`)} alt={`hats utility ${index}`} />
              <h3>{t(`Airdrop.hatsUtility-${index}`)}</h3>
              <p>{t(`Airdrop.hatsUtilityContent-${index}`)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
