import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { decrypt, readMessage } from "openpgp";
import { getPath } from "utils/objects.utils";
import { Alert, Button, FormInput } from "components";
import { useKeystore, readPrivateKeyFromStoredKey, IStoredKey, PgpKeyCard } from "components/Keystore";
import { useEnhancedForm } from "hooks/form";
import { getDecryptMessageSchema } from "./formSchema";
import { StyledDecryptionPage } from "./styles";
import KeyIcon from "@mui/icons-material/KeyOutlined";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";

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

      // Iterate over all stored keys and try to decrypt the message
      for (const keypair of keystore.storedKeys) {
        try {
          const privateKey = await readPrivateKeyFromStoredKey(keypair.privateKey, keypair.passphrase);
          const message = await readMessage({ armoredMessage: dataToUse.encryptedMessage });

          const { data: decrypted } = await decrypt({
            message,
            decryptionKeys: privateKey,
          });

          setValue("decryptedMessage", decrypted as string);
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
        const response = await fetch(encryptedMessageIpfs);
        const message = await response.text();

        setValue("encryptedMessage", message, { shouldValidate: true });
        handleDecryptMessage();
      };
      getEncryptedMessage();
    }
  }, [searchParams, setValue, handleDecryptMessage]);

  return (
    <StyledDecryptionPage className="content-wrapper-md">
      <h2 className="title">{t("CommitteeTools.decryptTitle")}</h2>
      <p className="mb-5">{t("CommitteeTools.decryptDescription")}</p>

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
          {t("CommitteeTools.decryptMessage")}
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
    </StyledDecryptionPage>
  );
};
