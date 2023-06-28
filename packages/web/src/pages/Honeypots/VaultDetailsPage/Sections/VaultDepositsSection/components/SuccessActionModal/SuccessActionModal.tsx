import hatsBoat from "assets/images/hats_boat.jpg";
import { Button } from "components";
import { useTranslation } from "react-i18next";
import { StyledSuccessActionModal } from "./styles";

type SuccessActionModalProps = {
  title: string;
  content: string;
  closeModal: () => void;
};

export const SuccessActionModal = ({ title, content, closeModal }: SuccessActionModalProps) => {
  const { t } = useTranslation();

  return (
    <StyledSuccessActionModal>
      <img src={hatsBoat} alt="Hats boat" />
      <h2>{title}</h2>
      <p>{content}</p>

      <Button className="mt-4" expanded size="medium" onClick={closeModal}>
        {t("gotIt")}
      </Button>
    </StyledSuccessActionModal>
  );
};
