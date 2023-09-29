import { ISubmissionMessageObject } from "@hats-finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import KeyIcon from "@mui/icons-material/KeyOutlined";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import { Alert, Button, FormInput, Loading } from "components";
import { IStoredKey, PgpKeyCard, readPrivateKeyFromStoredKey, useKeystore } from "components/Keystore";
import { useEnhancedForm } from "hooks/form";
import { decrypt, readMessage } from "openpgp";
import { useCallback, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { getPath } from "utils/objects.utils";
import { getDecryptMessageSchema } from "./formSchema";
import { StyledDecryptionPage } from "./styles";

type IDecryptMessageForm = {
  encryptedMessage: string;
  decryptedMessage: string;
};

export const DecryptionPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const { keystore, openKeystore } = useKeystore();
  const [errorDecrypting, setErrorDecrypting] = useState(false);
  const [decryptedWith, setDecryptedWith] = useState<IStoredKey | undefined>();
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid, errors },
  } = useEnhancedForm<IDecryptMessageForm>({
    resolver: yupResolver(getDecryptMessageSchema(t)),
    mode: "onChange",
  });

  const encryptedMessage = useWatch({ control, name: "encryptedMessage" });
  const decryptedMessage = useWatch({ control, name: "decryptedMessage" });

  const handleDecryptMessage = useCallback(
    async (data?: IDecryptMessageForm) => {
      setErrorDecrypting(false);

      const dataToUse = data || getValues();

      if (!dataToUse.encryptedMessage) return;
      if (!keystore) return;

      let decryptedPart = "";
      let encryptedPart = "";
      // let isDecryptedPartEncryptedByHats = false;

      // TODO: private audits V2 (We need to check if the message is encrypted by HATS, if so, decrypt it with backend)
      try {
        const messageObject = JSON.parse(dataToUse.encryptedMessage) as ISubmissionMessageObject;
        decryptedPart = messageObject.decrypted ?? "";
        encryptedPart = messageObject.encrypted ?? "";
        // isDecryptedPartEncryptedByHats = messageObject.isEncryptedByHats ?? false;
      } catch (error) {
        encryptedPart = dataToUse.encryptedMessage;
      }

      // Iterate over all stored keys and try to decrypt the message
      for (const keypair of keystore.storedKeys) {
        try {
          const privateKey = await readPrivateKeyFromStoredKey(keypair.privateKey, keypair.passphrase);
          const message = await readMessage({ armoredMessage: encryptedPart });

          const { data: decrypted } = await decrypt({
            message,
            decryptionKeys: privateKey,
          });

          // TODO: private audits V2
          // // If user could decrypt encrypted part (with committee key), lets decrypt the encryptedByHats part
          // if (isDecryptedPartEncryptedByHats) {
          //   const decryptedPartByHats = await decryptUsingHatsKey(decryptedPart);
          //   decryptedPart = decryptedPartByHats;
          // }

          const decryptedMessage = (decrypted as string) + (decryptedPart ? `\n\n${decryptedPart}` : "");

          setValue("decryptedMessage", decryptedMessage);
          setDecryptedWith(keypair);
          return;
        } catch (error) {
          continue;
        }
      }

      // If we get here, it means that we couldn't decrypt the message
      setErrorDecrypting(true);
      setDecryptedWith(undefined);
      setValue("decryptedMessage", "");
    },
    [getValues, setValue, keystore]
  );

  // If the encrypted message changes, clear the decrypted message
  useEffect(() => {
    setValue("decryptedMessage", "");
    setErrorDecrypting(false);
    setDecryptedWith(undefined);
  }, [encryptedMessage, setValue]);

  // Get encrypted message from IPFS Url
  useEffect(() => {
    const encryptedMessageIpfs = searchParams.get("ipfs");

    if (encryptedMessageIpfs) {
      const getEncryptedMessage = async () => {
        setIsLoadingMessage(true);
        const response = await fetch(encryptedMessageIpfs);
        const message = await response.text();

        setValue("encryptedMessage", message, { shouldValidate: true });
        setIsLoadingMessage(false);
        handleDecryptMessage();
      };
      getEncryptedMessage();
    }
  }, [searchParams, setValue, handleDecryptMessage]);

  return (
    <StyledDecryptionPage className="content-wrapper-md">
      <h2 className="title">{t("DecryptionTool.decryptTitle")}</h2>
      <p className="mb-5">{t("DecryptionTool.decryptDescription")}</p>

      <Button styleType="outlined" className="mb-5" onClick={() => openKeystore()}>
        <KeyIcon className="mr-3" />
        {t("PGPTool.openKeystore")}
      </Button>

      <hr />

      <div className="textbox-container mt-5">
        <FormInput
          {...register("encryptedMessage")}
          colorable
          type="textarea"
          label={t("encryptedMessage")}
          placeholder={t("enterMessageToDecrypt")}
          rows={14}
        />

        <Button type="submit" disabled={!isValid} onClick={handleSubmit(handleDecryptMessage)}>
          <EyeIcon className="mr-3" />
          {t("DecryptionTool.decryptMessage")}
        </Button>

        {errorDecrypting && (
          <Alert className="mt-5" type="error">
            <>
              We couldn't decrypt the message with any of your keys. Please make sure you have the correct key on your
              <Button onClick={() => openKeystore()} styleType="text">
                keystore.
              </Button>
            </>
          </Alert>
        )}
      </div>

      {decryptedMessage && !getPath(errors, "encryptedMessage") && (
        <div className="textbox-container mt-2">
          {decryptedWith && (
            <div className="mb-4">
              <p className="mb-2">Decrypted with:</p>
              <PgpKeyCard smallPadding viewOnly pgpKey={decryptedWith} />
            </div>
          )}

          <FormInput
            {...register("decryptedMessage")}
            readOnly
            type="textarea"
            label={t("decryptedMessage")}
            placeholder={t("hereYouWillSeeDecryptedMessage")}
            rows={14}
          />
        </div>
      )}

      {isLoadingMessage && <Loading fixed extraText={`${t("loading")}...`} />}
    </StyledDecryptionPage>
  );
};
