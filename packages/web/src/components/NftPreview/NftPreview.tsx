import { INFTMetaData, IVault } from "@hats-finance/shared";
import OpenIcon from "@mui/icons-material/FitScreenOutlined";
import { Button, Media, Modal } from "components";
import useModal from "hooks/useModal";
import { useTranslation } from "react-i18next";
import { ipfsTransformUri } from "utils";
import { StyledNFTDetailsModal, StyledNftPreview } from "./styles";

export type NftPreviewProps = {
  nftData: INFTMetaData | undefined;
  severityName?: string;
  vault?: IVault;
  size?: "small" | "normal" | "tiny";
};

/**
 * This component is used to preview a NFT based on a severity and vault.
 */
export const NftPreview = ({ nftData, severityName, vault, size = "normal" }: NftPreviewProps) => {
  const { t } = useTranslation();

  const { isShowing: isShowingNFTModal, show: showNFTModal, hide: hideNFTModal } = useModal();

  return (
    <>
      <StyledNftPreview size={size} onClick={nftData ? showNFTModal : undefined}>
        {nftData ? <Media className="preview" link={ipfsTransformUri(nftData.image)} /> : <p>{t("noNFT")}</p>}
        <OpenIcon className="icon" />
      </StyledNftPreview>

      {nftData && (
        <Modal isShowing={isShowingNFTModal} title={t("nftPreview")} onHide={hideNFTModal}>
          <StyledNFTDetailsModal>
            <Media className="big-preview" link={ipfsTransformUri(nftData.image)} />

            <p className="nft-name mt-3 ">{nftData.name}</p>

            <div className="details mt-5">
              <div className="first">
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

              {nftData.description && (
                <div className="item">
                  <div className="title">{t("nftDescription")}</div>
                  <div className="info">{nftData.description}</div>
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
