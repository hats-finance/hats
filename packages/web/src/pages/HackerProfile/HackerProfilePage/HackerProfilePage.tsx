import ArrowIcon from "@mui/icons-material/ArrowBackOutlined";
import { Alert, Button, Loading } from "components";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useProfileByUsername } from "../hooks";
import { StyledHackerProfilePage } from "./styles";

export const HackerProfilePage = () => {
  const { t } = useTranslation();
  const { username } = useParams();
  const navigate = useNavigate();

  const { data: profileFound, isLoading: isLoadingProfile } = useProfileByUsername(username);

  // If profile is not found
  if (profileFound === null) {
    return (
      <>
        <Alert type="error" content={t("HackerProfile.profileNotFoundError")} />
        <Button className="mt-4" onClick={() => navigate(-1)}>
          <ArrowIcon className="mr-2" /> {t("goBack")}
        </Button>
      </>
    );
  }

  return (
    <StyledHackerProfilePage>
      {isLoadingProfile && <Loading extraText={`${t("HackerProfile.loadingProfile")}...`} />}
    </StyledHackerProfilePage>
  );
};
