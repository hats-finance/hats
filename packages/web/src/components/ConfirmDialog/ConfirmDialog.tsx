import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, FormInput, Modal } from "components";
import { StyledConfirmDialog } from "./styles";
import CheckIcon from "@mui/icons-material/Check";

type ConfirmDialogProps = {
  isShowing: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
  confirmText?: string;
  cancelText?: string;
  title?: string;
  description?: string;
  titleIcon?: string | React.ReactElement;
  bodyComponent?: React.ReactElement;
  confirmTextInput?: {
    label: string;
    placeholder: string;
    textToConfirm: string;
  };
};

function ConfirmDialog({
  isShowing,
  onCancel,
  onSuccess,
  confirmText,
  cancelText,
  title,
  description,
  titleIcon,
  bodyComponent,
  confirmTextInput,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  const [confirmationText, setConfirmationText] = useState("");

  useEffect(() => {
    setConfirmationText("");
  }, [isShowing]);

  const handleConfirm = () => {
    if (confirmTextInput && confirmationText !== confirmTextInput.textToConfirm) return;
    if (onSuccess) onSuccess();
  };

  return (
    <Modal
      newStyles
      isShowing={isShowing}
      titleIcon={titleIcon}
      title={title}
      onHide={onCancel}
      capitalizeTitle
      disableClose
      removeAnimation
    >
      <StyledConfirmDialog>
        <div className="description-container">
          <div>{description}</div>
          {bodyComponent && <div className="mt-4">{bodyComponent}</div>}
          {confirmTextInput && (
            <div className="mt-4">
              <p className="strong mb-2">{t("toConfirmWriteThisBelow", { text: confirmTextInput.textToConfirm })}</p>
              <FormInput
                prefixIcon={confirmationText === confirmTextInput.textToConfirm ? <CheckIcon color="primary" /> : undefined}
                onChange={(e) => setConfirmationText(e.target.value)}
                label={confirmTextInput.label}
                placeholder={confirmTextInput.placeholder}
              />
            </div>
          )}
        </div>

        <div className="button-container">
          <Button expanded onClick={onCancel} styleType="outlined">
            {cancelText ?? t("cancel")}
          </Button>
          <Button
            expanded
            onClick={handleConfirm}
            disabled={confirmTextInput && confirmationText !== confirmTextInput.textToConfirm}
          >
            {confirmText ?? t("confirm")}
          </Button>
        </div>
      </StyledConfirmDialog>
    </Modal>
  );
}

export { ConfirmDialog, type ConfirmDialogProps };
