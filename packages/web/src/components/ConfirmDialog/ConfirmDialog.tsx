import { useTranslation } from "react-i18next";
import { Button, Modal } from "components";
import { StyledConfirmDialog } from "./styles";

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
}: ConfirmDialogProps) {
  const { t } = useTranslation();

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
        </div>

        <div className="button-container">
          <Button expanded onClick={onCancel} styleType="outlined">
            {cancelText ?? t("cancel")}
          </Button>
          <Button expanded onClick={onSuccess}>
            {confirmText ?? t("confirm")}
          </Button>
        </div>
      </StyledConfirmDialog>
    </Modal>
  );
}

export { ConfirmDialog, type ConfirmDialogProps };
