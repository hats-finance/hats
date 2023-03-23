import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CollapsableTextContent, FormInput, Modal } from "components";
import { getPath } from "utils/objects.utils";
import { getSelectPublicKeySchema } from "./formSchema";
import { StyledBaseKeystoreContainer } from "../../styles";
import { KeystoreDashboard } from "../KeystoreDashboard/KeystoreDashboard";

type SelectPublicKeyProps = {
  isCreated: boolean;
  initKeystore: () => Promise<boolean>;
  onClose?: () => void;
  onPublicKeySelected?: (publickey: string) => Promise<void> | undefined;
};

type ISelectPublicKeyForm = {
  publicKey: string;
};

export const SelectPublicKey = ({ isCreated, initKeystore, onClose, onPublicKeySelected }: SelectPublicKeyProps) => {
  const { t } = useTranslation();
  const [openKeystoreForSelecting, setOpenKeystoreForSelecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ISelectPublicKeyForm>({
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
        <Modal
          removeAnimation
          title={t("PGPTool.selectPgpKey")}
          pgpKeystoreStyles
          capitalizeTitle
          isShowing={true}
          onHide={onClose}
        >
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
              {isCreated ? t("PGPTool.openKeystore") : t("PGPTool.createKeystore")}
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
                      error={getPath(errors, "publicKey")}
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
