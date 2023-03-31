import { IVault } from "@hats-finance/shared";
import { useTranslation } from "react-i18next";
import { StyledPayoutCreateModal } from "./styles";

interface PayoutCreateModalProps {
  onSelectVault: (vault: IVault) => void;
  closeModal: Function;
}

export const PayoutCreateModal = ({ onSelectVault, closeModal }: PayoutCreateModalProps) => {
  const { t } = useTranslation();

  return (
    <StyledPayoutCreateModal>
      <p>{t("Payouts.createPayoutDescription")}</p>
    </StyledPayoutCreateModal>
  );
};
