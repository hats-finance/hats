import { IVault, IVulnerabilitySeverity } from "@hats.finance/shared";
import OpenIcon from "@mui/icons-material/FitScreenOutlined";
import { Button, Media, Modal, Pill } from "components";
import { useSeverityRewardInfo } from "hooks/severities/useSeverityRewardInfo";
import useModal from "hooks/useModal";
import { useEffect, useState } from "react";
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

  const showTemplate = !!severity && !severity["nft-metadata"].jsonMetadataIpfsHash;
  const [nftAssetsData, setNftAssetsData] = useState<
    { image: string; animation_url: string; name: string; description: string } | undefined
  >();

  const nftData = showTemplate ? severity["nft-metadata"] : nftAssetsData;
  const severityName = severity?.name.toLowerCase().replace("severity", "").trim() ?? "";
  const severityIdx = vault?.description?.severities.findIndex((s) => s.name === severity?.name) ?? 0;

  const { rewardColor } = useSeverityRewardInfo(vault, severityIdx);

  useEffect(() => {
    if (!severity || !severity["nft-metadata"].jsonMetadataIpfsHash) return;

    fetch(ipfsTransformUri(severity["nft-metadata"].jsonMetadataIpfsHash))
      .then((res) => res.json())
      .then((data) => setNftAssetsData(data));
  }, [severity]);

  if (!nftData?.name || !nftData?.image || !nftData?.description) return null;

  return (
    <>
      <StyledVaultNftRewardCard type={type} onClick={nftData ? showNFTModal : undefined}>
        <div className="nft-asset">
          {nftData ? (
            <Media
              playOnHover={type === "with_description"}
              className="preview"
              link={ipfsTransformUri(nftData?.animation_url)}
            />
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
            <Media className="big-preview" link={ipfsTransformUri(nftData?.animation_url)} />

            <p className="nft-name mt-3 ">{nftData?.name}</p>

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
                  <div className="info">{showTemplate ? nftData.description : nftAssetsData?.description}</div>
                </div>
              )}
            </div>

            <Button className="mt-5 mb-4" onClick={hideNFTModal} expanded>
              {t("close")}
            </Button>
            <br />
          </StyledNFTDetailsModal>
        </Modal>
      )}
    </>
  );
};
