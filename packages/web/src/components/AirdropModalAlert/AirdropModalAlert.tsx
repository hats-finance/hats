import { Button } from "components";
import { RoutePaths } from "navigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { StyledAirdropModalAlert } from "./styles";

type AirdropModalAlertProps = {
  onRedirect: () => void;
};

export const AirdropModalAlert = ({ onRedirect }: AirdropModalAlertProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToAirdrop = () => {
    onRedirect();
    navigate(`${RoutePaths.airdrop}`);
  };

  return (
    <StyledAirdropModalAlert>
      <div className="image">
        <img src={require("assets/images/vault-opening.gif")} alt="vault opening" />
      </div>
      <h3>{t("Airdrop.hatsAirdropIsLive")}</h3>
      <h4>{t("Airdrop.checkEligibilityNow")}</h4>
      <p>{t("Airdrop.checkEligibilityNowDescription")}</p>

      <Button onClick={goToAirdrop}>{t("Airdrop.checkEligibility")}</Button>
    </StyledAirdropModalAlert>
  );
};
