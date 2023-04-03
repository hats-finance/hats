import { INFTMetaData, IVault } from "@hats-finance/shared";
import { useTranslation } from "react-i18next";
import { Button, Media, Modal } from "components";
import useModal from "hooks/useModal";
import { ipfsTransformUri } from "utils";
import { StyledNFTDetailsModal, StyledNftPreview } from "./styles";
import OpenIcon from "@mui/icons-material/FitScreenOutlined";

type NftPreviewProps = {
  nftData: INFTMetaData | undefined;
  severityName?: string;
  vault?: IVault;
};

export const NftPreview = ({ nftData, severityName, vault }: NftPreviewProps) => {
  const { t } = useTranslation();

  const { isShowing: isShowingNFTModal, show: showNFTModal, hide: hideNFTModal } = useModal();

  return (
    <>
      <StyledNftPreview onClick={nftData ? showNFTModal : undefined}>
        {nftData ? <Media className="preview" link={ipfsTransformUri(nftData.image)} /> : <p>asd</p>}
        <OpenIcon className="icon" />
      </StyledNftPreview>

      {nftData && (
        <Modal newStyles isShowing={isShowingNFTModal} title={t("nft")} onHide={hideNFTModal}>
          <StyledNFTDetailsModal>
            <Media className="preview" link={ipfsTransformUri(nftData.image)} />

            <p className="nft-name mt-5">{nftData.name}</p>

            <div className="details mt-5">
              {nftData.description && (
                <div className="item">
                  <div className="title">{t("nftDescription")}</div>
                  <div className="info">{nftData.description}</div>
                </div>
              )}
              {vault && (
                <div className="item">
                  <div className="title">{t("vaultName")}</div>
                  <div className="info">
                    <img src={ipfsTransformUri(vault.description?.["project-metadata"].icon)} alt="vault name" />
                    <p>{vault.description?.["project-metadata"].name}</p>
                  </div>
                </div>
              )}
              {severityName && (
                <div className="item">
                  <div className="title">{t("severity")}</div>
                  <div className="info">{severityName}</div>
                </div>
              )}
            </div>

            <Button className="mt-5" onClick={hideNFTModal} expanded>
              {t("close")}
            </Button>
          </StyledNFTDetailsModal>
        </Modal>
      )}
    </>
  );
};
