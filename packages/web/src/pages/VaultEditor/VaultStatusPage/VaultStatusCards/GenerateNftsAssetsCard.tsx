import { Alert, Button, Loading, Pill } from "components";
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
  const isLastEditSessionApproved = allEditSessions[0]?._id === deployedEditSession?._id;

  const nftsAreBeingGenerated = allEditSessions.some((editSession) => editSession.nftAssetsIpfsHash === "Generating assets...");

  const nftsGeneratedWithEditSession =
    allEditSessions
      .filter((editSession) => editSession.nftAssetsIpfsHash && editSession.nftAssetsIpfsHash !== "Generating assets...")
      .at(0) ?? undefined;

  const nftsGeneratedInfo = nftsGeneratedWithEditSession
    ? {
        nftsIpfsHash: nftsGeneratedWithEditSession.nftAssetsIpfsHash,
        editSessionId: nftsGeneratedWithEditSession._id,
      }
    : undefined;

  // const canRegenerateNfts = nftsGeneratedInfo && !deployedEditSession?.nftAssetsIpfsHash;
  // If the logos are different, ask GOV to regenerate the NFTs
  const shouldRegenerateNfts =
    allEditSessions.find((es) => es._id === nftsGeneratedInfo?.editSessionId)?.editedDescription["project-metadata"].icon !==
    deployedEditSession?.editedDescription["project-metadata"].icon;

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
    if (nftsGeneratedInfo && !shouldRegenerateNfts) return;
    if (nftsAreBeingGenerated) return alert("NFTs are being generated");
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
    } else if (shouldRegenerateNfts) {
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

      <div className="mb-4">{getInfoText()}</div>

      {nftsGeneratedInfo && (
        <div>
          <p>
            <span className="bold">{t("nftsGeneratedWithEditSessionId")}:</span> {nftsGeneratedInfo.editSessionId}
          </p>
          <p>
            <span className="bold">{t("nftsIpfsHash")}:</span> {nftsGeneratedInfo.nftsIpfsHash}
          </p>
        </div>
      )}

      {!isLastEditSessionApproved && !nftsGeneratedInfo && <Alert type="warning">{t("makeSureLastEditSessionIsApproved")}</Alert>}

      <div className="status-card__button">
        <Button
          disabled={
            loadingEditSessions ||
            !isLastEditSessionApproved ||
            (nftsGeneratedInfo && !shouldRegenerateNfts) ||
            nftsAreBeingGenerated
          }
          onClick={handleGenerateNfts}
        >
          {shouldRegenerateNfts && !!nftsGeneratedInfo ? t("regenerateNfts") : t("generateNfts")}
        </Button>
      </div>
      {loading && <Loading fixed extraText={`${t("loading")}...`} />}
    </div>
  );
};
