import { IVault, IVulnerabilitySeverity } from "@hats-finance/shared";
import OpenIcon from "@mui/icons-material/FitScreenOutlined";
import { Button, Media, Modal, Pill } from "components";
import { useSeverityRewardInfo } from "hooks/severities/useSeverityRewardInfo";
import useModal from "hooks/useModal";
import { useTranslation } from "react-i18next";
import { ipfsTransformUri } from "utils";
import { StyledNFTDetailsModal, StyledVaultNftRewardCard } from "./styles";

export type VaultNftRewardCardProps = {
  severity: IVulnerabilitySeverity | undefined;
  vault?: IVault;
  type?: "small" | "normal" | "tiny" | "with_description";
};

/**
 * This component is used to preview a NFT based on a severity and vault.
 */
export const VaultNftRewardCard = ({ severity, vault, type = "normal" }: VaultNftRewardCardProps) => {
  const { t } = useTranslation();

  const { isShowing: isShowingNFTModal, show: showNFTModal, hide: hideNFTModal } = useModal();

  const nftData = severity && severity["nft-metadata"];
  const severityName = severity?.name.toLowerCase().replace("severity", "") ?? "";
  const severityIdx = vault?.description?.severities.findIndex((s) => s.name === severity?.name) ?? 0;

  const { rewardColor } = useSeverityRewardInfo(vault, severityIdx);

  return (
    <>
      <StyledVaultNftRewardCard type={type} onClick={nftData ? showNFTModal : undefined}>
        <div className="nft-asset">
          {nftData ? (
            <Media playOnHover={type === "with_description"} className="preview" link={ipfsTransformUri(nftData.image)} />
          ) : (
            <p>{t("noNFT")}</p>
          )}
          <OpenIcon className="icon" />
        </div>

        {type === "with_description" && (
          <div className="nft-description">
            <Pill isSeverity transparent textColor={rewardColor} text={severityName} />
            <h5 className="name">{nftData?.name}</h5>
            <p className="details">{nftData?.description}</p>
          </div>
        )}
      </StyledVaultNftRewardCard>

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
                {severity && (
                  <div className="item">
                    <div className="title">{t("severity")}</div>
                    <div className="info capitalize">{severityName}</div>
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
