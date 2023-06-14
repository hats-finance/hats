import { Button, Loading, Pill } from "components";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IEditedSessionResponse } from "types";
import * as VaultEditorService from "../../vaultEditorService";
import { VaultStatusContext } from "../store";

export const GenerateNftsAssetsCard = () => {
  const { t } = useTranslation();
  const { vaultAddress, vaultChainId, vaultData } = useContext(VaultStatusContext);

  const { tryAuthentication } = useSiweAuth();

  const [loading, setLoading] = useState(false);
  const [loadingEditSessions, setLoadingEditSessions] = useState(false);
  const [allEditSessions, setAllEditSessions] = useState<IEditedSessionResponse[]>([]);
  const [deployedEditSession, setDeployedEditSession] = useState<IEditedSessionResponse>();

  const nftsAreBeingGenerated = allEditSessions.some((editSession) => editSession.nftAssetsIpfsHash === "Generating assets...");

  const nftsGeneratedWithEditSession =
    allEditSessions.find(
      (editSession) => editSession.nftAssetsIpfsHash && editSession.nftAssetsIpfsHash !== "Generating assets..."
    ) ?? undefined;

  const nftsGeneratedInfo = nftsGeneratedWithEditSession
    ? {
        nftsIpfsHash: nftsGeneratedWithEditSession.nftAssetsIpfsHash,
        editSessionId: nftsGeneratedWithEditSession._id,
      }
    : undefined;

  const canRegenerateNfts = nftsGeneratedInfo && !deployedEditSession?.nftAssetsIpfsHash;

  useEffect(() => {
    fetchEditSessions(vaultAddress, vaultChainId, vaultData.descriptionHash);
  }, [vaultAddress, vaultChainId, vaultData.descriptionHash]);

  const fetchEditSessions = async (vaultAddress: string, vaultChainId: number, descriptionHash: string) => {
    setLoadingEditSessions(true);
    const editSessions = await VaultEditorService.getAllEditSessions(vaultAddress, vaultChainId);
    setAllEditSessions(editSessions);

    const currentEditSession = await VaultEditorService.getCurrentValidEditSession(descriptionHash, vaultAddress, vaultChainId);
    setDeployedEditSession(currentEditSession);
    setLoadingEditSessions(false);
  };

  const handleGenerateNfts = async () => {
    if (nftsGeneratedInfo && !canRegenerateNfts) return;
    if (!deployedEditSession) return alert("No deployed edit session found");

    const signedIn = await tryAuthentication();
    if (!signedIn) return;

    // Generate or regenerate NFTs
    setLoading(true);
    const generatedSuccessfully = await VaultEditorService.generateNftsAssets(deployedEditSession._id ?? "");
    await fetchEditSessions(vaultAddress, vaultChainId, vaultData.descriptionHash);

    if (generatedSuccessfully) alert("NFTs generated successfully");
    else alert("NFTs generation failed");

    setLoading(false);
  };

  const getInfoText = () => {
    if (nftsAreBeingGenerated) {
      return t("generatingNftsInfo");
    } else if (!nftsGeneratedInfo) {
      return t("noNftsGeneratedInfo");
    } else if (canRegenerateNfts) {
      return t("nftsRegenerateInfo");
    } else {
      return t("nftsGeneratedInfo");
    }
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <span>{t("generateNftsAssets")}</span>
          <Pill
            dotColor={nftsGeneratedInfo ? "blue" : nftsAreBeingGenerated ? "yellow" : "red"}
            text={
              nftsGeneratedInfo ? t("nftsGenerated") : nftsAreBeingGenerated ? `${t("generatingNfts")}..` : t("noNftsGenerated")
            }
          />
        </div>
      </div>

      <div>{getInfoText()}</div>
      {nftsGeneratedInfo && (
        <div>
          <p>
            {t("nftsGeneratedWithEditSessionId")}: {nftsGeneratedInfo.editSessionId}
          </p>
          <p>
            {t("nftsIpfsHash")}: {nftsGeneratedInfo.nftsIpfsHash}
          </p>
        </div>
      )}

      <div className="status-card__button">
        <Button disabled={loadingEditSessions || (nftsGeneratedInfo && !canRegenerateNfts)} onClick={handleGenerateNfts}>
          {canRegenerateNfts ? t("regenerateNfts") : t("generateNfts")}
        </Button>
      </div>
      {loading && <Loading fixed extraText={`${t("loading")}...`} />}
    </div>
  );
};
