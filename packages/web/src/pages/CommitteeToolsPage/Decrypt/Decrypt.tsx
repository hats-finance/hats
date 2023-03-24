import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { createMessage, decrypt, encrypt, readMessage } from "openpgp";
import { Button, FormInput } from "components";
import { useEnhancedForm } from "hooks/form";
import { getDecryptMessageSchema } from "./formSchema";
import { StyledDecrypt } from "./styles";

type IDecryptMessageForm = {
  encryptedMessage: string;
  decryptedMessage: string;
};

export default function Decrypt() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    formState: { isValid },
  } = useEnhancedForm<IDecryptMessageForm>({
    resolver: yupResolver(getDecryptMessageSchema(t)),
    mode: "onChange",
  });

  const [encryptedMessage, setEncryptedMessage] = useState<string | undefined>();
  const [decryptedMessage, setDecryptedMessage] = useState<string | undefined>();

  // const keystoreContext = useContext(KeystoreContext);
  const [error, setError] = useState<string>();

  // Get encrypted message from IPFS Url
  useEffect(() => {
    const encryptedMessageIpfs = searchParams.get("ipfs");

    if (encryptedMessageIpfs) {
      const getEncryptedMessage = async () => {
        const response = await fetch(encryptedMessageIpfs);
        const message = await response.text();

        setEncryptedMessage(message);
      };
      getEncryptedMessage();
    }
  }, [searchParams]);

  // useEffect(() => {
  //   if (keystoreContext.keystore?.storedKeys.length === 0 || !keystoreContext.selectedKey === undefined) {
  //     showSelectKey();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [keystoreContext.keystore, keystoreContext.selectedKey]);

  const _decrypt = useCallback(async () => {
    // try {
    //   setError(undefined);
    //   if (!keystoreContext.selectedKey) {
    //     showSelectKey();
    //     return;
    //   }
    //   const armoredMessage = encryptedMessageRef.current!.value;
    //   if (!armoredMessage || armoredMessage === "") {
    //     throw new Error(t("CommitteeTools.Decrypt.no-message-decrypt"));
    //   }
    //   const privateKey = await readPrivateKeyFromStoredKey(
    //     keystoreContext.selectedKey.privateKey,
    //     keystoreContext.selectedKey.passphrase
    //   );
    //   const message = await readMessage({ armoredMessage });
    //   const { data: decrypted } = await decrypt({
    //     message,
    //     decryptionKeys: privateKey,
    //   });
    //   decryptedMessageRef.current!.value = decrypted as string;
    // } catch (error) {
    //   console.log(error);
    //   if (error instanceof Error) {
    //     setError(error.message);
    //   }
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _encrypt = useCallback(async () => {
    // try {
    //   setError("");
    //   if (!keystoreContext.selectedKey) {
    //     showSelectKey();
    //     return;
    //   }
    //   const privateKey = await readPrivateKeyFromStoredKey(
    //     keystoreContext.selectedKey.privateKey,
    //     keystoreContext.selectedKey.passphrase
    //   );
    //   const message = await createMessage({
    //     text: decryptedMessageRef.current!.value!,
    //   });
    //   encryptedMessageRef.current!.value = (await encrypt({
    //     message,
    //     encryptionKeys: privateKey?.toPublic(),
    //   })) as string;
    // } catch (error) {
    //   if (error instanceof Error) {
    //     setError(error.message);
    //   }
    // }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const areActionsBlocked = !keystoreContext.isCreated || keystoreContext.isLocked || !keystoreContext.selectedKey;

  return (
    <StyledDecrypt className="content-wrapper-md">
      <h2 className="title">{t("CommitteeTools.Decrypt.decrypt-tool")}</h2>
      <p className="description">{t("CommitteeTools.Decrypt.decrypt-description")}</p>

      <div className="textbox-container mt-4">
        <FormInput
          {...register("encryptedMessage")}
          type="textarea"
          label={t("encryptedMessage")}
          placeholder={t("enterMessageToDecrypt")}
          rows={14}
          // error={error ? { message: error, type: "error" } : undefined}
        />
        {/* <Button disabled={areActionsBlocked} onClick={_decrypt}>
          {t("CommitteeTools.Decrypt.decrypt")}
        </Button> */}
      </div>

      <div className="textbox-container mt-4">
        <FormInput
          {...register("decryptedMessage")}
          type="textarea"
          label={t("decryptedMessage")}
          placeholder={t("hereYouWillSeeDecryptedMessage")}
          rows={14}
          // error={error ? { message: error, type: "error" } : undefined}
        />
        {/* <Button disabled={areActionsBlocked} onClick={_encrypt}>
          {t("CommitteeTools.Decrypt.encrypt")}
        </Button> */}
      </div>
    </StyledDecrypt>
  );
}
