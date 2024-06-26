import { getBaseSafeAppUrl, getGnosisChainPrefixByChainId } from "@hats.finance/shared";
import HatsHat from "assets/icons/hats-hat.svg";
import { Button } from "components";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { StyledVaultReadyModal } from "./styles";

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

    window.open(`${getBaseSafeAppUrl(+chainId)}/${chainPrefix}:${mulsitigAddress}/home`, "_blank");
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
