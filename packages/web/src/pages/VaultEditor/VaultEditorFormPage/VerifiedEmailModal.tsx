import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Button } from "components";
import { StyledVerifiedEmailModal } from "./styles";
import ErrorIcon from "@mui/icons-material/ErrorOutlineOutlined";
import EmailVerifiedIcon from "@mui/icons-material/MarkEmailReadOutlined";

type VerifiedEmailModalProps = {
  closeModal: () => void;
};

export const VerifiedEmailModal = ({ closeModal }: VerifiedEmailModalProps) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const verifiedEmail = searchParams.get("verifiedEmail");
  const unverifiedEmail = searchParams.get("unverifiedEmail");

  return (
    <StyledVerifiedEmailModal error={!!unverifiedEmail}>
      <div className="info">
        <p className="title">
          {verifiedEmail ? t("emailVerificationModal.titleSuccess") : t("emailVerificationModal.titleError")}
          {verifiedEmail ? (
            <EmailVerifiedIcon fontSize="large" className="ml-3" />
          ) : (
            <ErrorIcon fontSize="large" className="ml-3" />
          )}
        </p>
        <p className="description">
          {verifiedEmail
            ? t("emailVerificationModal.descriptionSuccess", { email: verifiedEmail })
            : t("emailVerificationModal.descriptionError", { email: unverifiedEmail === "invalid" ? "" : unverifiedEmail })}
        </p>

        <Button onClick={closeModal} bigHorizontalPadding>
          {t("gotIt")}
        </Button>
      </div>
    </StyledVerifiedEmailModal>
  );
};
