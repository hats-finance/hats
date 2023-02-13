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
};

function ConfirmDialog({ isShowing, onCancel, onSuccess, confirmText, cancelText, title, description }: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal isShowing={isShowing} title={title} onHide={onCancel} withTitleDivider={!!title} disableClose>
      <StyledConfirmDialog>
        <p className="description">{description}</p>
        <div className="button-container">
          <Button onClick={onCancel} styleType="invisible">
            {cancelText ?? t("cancel")}
          </Button>
          <Button onClick={onSuccess}>{confirmText ?? t("confirm")}</Button>
        </div>
      </StyledConfirmDialog>
    </Modal>
  );
}

export { ConfirmDialog, type ConfirmDialogProps };
