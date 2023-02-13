import { useTranslation } from "react-i18next";
import { Button, Modal } from "components";
import { StyledDialog } from "./styles";

type DialogProps = {
  isShowing: boolean;
  onCancel?: () => void;
  onSuccess: () => void;
  confirmText?: string;
  cancelText?: string;
  title?: string;
  description: string;
};

function Dialog({ isShowing, onCancel, onSuccess, confirmText, cancelText, title, description }: DialogProps) {
  const { t } = useTranslation();

  return (
    <Modal isShowing={isShowing} title={title} onHide={onCancel} withTitleDivider={!!title}>
      <StyledDialog>
        <p className="description">{description}</p>
        <div className="button-container">
          <Button onClick={onCancel} styleType="invisible">
            {cancelText ?? t("cancel")}
          </Button>
          <Button onClick={onSuccess}>{confirmText ?? t("confirm")}</Button>
        </div>
      </StyledDialog>
    </Modal>
  );
}

export { Dialog };
