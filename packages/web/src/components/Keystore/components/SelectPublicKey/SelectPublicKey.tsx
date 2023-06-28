import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CollapsableTextContent, FormInput, Modal } from "components";
import { useKeystore } from "components/Keystore/KeystoreProvider";
import { useEnhancedForm } from "hooks/form";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledBaseKeystoreContainer } from "../../styles";
import { KeystoreDashboard } from "../KeystoreDashboard/KeystoreDashboard";
import { getSelectPublicKeySchema } from "./formSchema";

type SelectPublicKeyProps = {
  initKeystore: () => Promise<boolean>;
  onClose?: () => void;
  onPublicKeySelected?: (publickey: string) => Promise<void> | undefined;
};

type ISelectPublicKeyForm = {
  publicKey: string;
};

export const SelectPublicKey = ({ initKeystore, onClose, onPublicKeySelected }: SelectPublicKeyProps) => {
  const { t } = useTranslation();
  const { isKeystoreCreated } = useKeystore();

  const [openKeystoreForSelecting, setOpenKeystoreForSelecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useEnhancedForm<ISelectPublicKeyForm>({
    resolver: yupResolver(getSelectPublicKeySchema(t)),
    mode: "onChange",
  });

  const onSubmit = async (data: ISelectPublicKeyForm) => {
    if (onPublicKeySelected) onPublicKeySelected(data.publicKey);
  };

  const handleOpenPgpKeystore = async () => {
    const wasInitiated = await initKeystore();
    if (wasInitiated) setOpenKeystoreForSelecting(true);
  };

  return (
    <>
      {!openKeystoreForSelecting && (
        <Modal removeAnimation title={t("PGPTool.selectPgpKey")} capitalizeTitle isShowing={true} onHide={onClose}>
          <StyledBaseKeystoreContainer size="big">
            <div className="mb-5">{t("PGPTool.selectPgpKeyDescription")}</div>

            <div className="mb-4">
              <CollapsableTextContent title={t("PGPTool.whyDoINeedKeys")}>
                {t("PGPTool.whyDoINeedKeysExplanation")}
              </CollapsableTextContent>
            </div>

            <div className="mb-5">
              <CollapsableTextContent title={t("PGPTool.whereAreTheKeysStored")}>
                {t("PGPTool.whereAreTheKeysStoredExplanation")}
              </CollapsableTextContent>
            </div>

            <div className="mb-4">{t("PGPTool.useKeystoreForSelectCreate")}</div>

            <Button type="button" expanded onClick={handleOpenPgpKeystore}>
              {isKeystoreCreated ? t("PGPTool.openKeystore") : t("PGPTool.createKeystore")}
            </Button>

            <div className="mt-5">
              <CollapsableTextContent noContentPadding title={t("PGPTool.dontWantToUseOurKeystore")}>
                <>
                  <p className="mb-3">{t("PGPTool.pasteExistingPublicKey")}</p>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                      {...register("publicKey")}
                      type="textarea"
                      colorable
                      placeholder={t("PGPTool.publicKeyPlaceholder")}
                      label={t("PGPTool.publicKey")}
                    />

                    <Button disabled={!isValid} type="submit" expanded>
                      {t("PGPTool.selectKey")}
                    </Button>
                  </form>
                </>
              </CollapsableTextContent>
            </div>
          </StyledBaseKeystoreContainer>
        </Modal>
      )}

      {openKeystoreForSelecting && (
        <KeystoreDashboard
          onPublicKeySelected={(publickey) => onPublicKeySelected && onPublicKeySelected(publickey)}
          onClose={() => setOpenKeystoreForSelecting(false)}
        />
      )}
    </>
  );
};
