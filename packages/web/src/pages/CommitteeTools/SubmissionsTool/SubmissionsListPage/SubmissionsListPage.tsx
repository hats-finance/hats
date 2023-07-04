import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useVaultSubmissionsBySiweUser } from "../submissionsService.hooks";
import { StyledSubmissionsListPage } from "./styles";

export const SubmissionsListPage = () => {
  const { t } = useTranslation();
  const { tryAuthentication } = useSiweAuth();

  const { data, isLoading } = useVaultSubmissionsBySiweUser();

  useEffect(() => {
    tryAuthentication();
  }, [tryAuthentication]);

  return (
    <StyledSubmissionsListPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title">
          <p>
            {t("committeeTools")}/<span className="bold">{t("submissions")}</span>
          </p>
        </div>
      </div>
    </StyledSubmissionsListPage>
  );
};
