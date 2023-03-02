import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { getGnosisChainPrefixByChainId } from "utils/gnosis.utils";
import { Button } from "components";
import { StyledVaultReadyModal } from "./styles";
import HatsHat from "assets/icons/hats-hat.svg";

type VaultReadyModalProps = {
  closeModal: () => void;
};

export const VaultReadyModal = ({ closeModal }: VaultReadyModalProps) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const gnosisMultisig = searchParams.get("gnosisMultisig");

  const goToGnosis = () => {
    const [chainId, mulsitigAddress] = gnosisMultisig?.split(":") ?? [];
    if (!chainId || !mulsitigAddress) return;

    const chainPrefix = getGnosisChainPrefixByChainId(+chainId);

    window.open(`https://app.safe.global/${chainPrefix}:${mulsitigAddress}/home`, "_blank");
  };

  return (
    <StyledVaultReadyModal>
      <img src={HatsHat} alt="Hats hat" />
      <div className="info">
        <p className="title">{gnosisMultisig ? t("vaultCreatedModal.titleMultisig") : t("vaultCreatedModal.titleNoMultisig")}</p>
        <p className="description">
          {gnosisMultisig ? t("vaultCreatedModal.descriptionMultisig") : t("vaultCreatedModal.descriptionNoMultisig")}
        </p>

        <Button onClick={gnosisMultisig ? goToGnosis : closeModal} bigHorizontalPadding>
          {gnosisMultisig ? t("goToGnosisSafe") : t("gotIt")}
        </Button>
      </div>
    </StyledVaultReadyModal>
  );
};
