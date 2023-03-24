import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { readPrivateKey } from "openpgp";
import { v4 as uuid } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useEnhancedForm } from "hooks/form";
import { removeEmpty } from "utils/objects.utils";
import { Button, FormInput, Modal } from "components";
import { getImportKeySchema } from "./formSchema";
import { useKeystore } from "../../../KeystoreProvider";
import { IStoredKey } from "../../../types";
import { readPrivateKeyFromStoredKey } from "../../../utils";
import { StyledBaseKeystoreContainer } from "../../../styles";
import UploadIcon from "@mui/icons-material/FileUploadOutlined";

type ImportKeyProps = {
  onClose: () => void;
  onImportedSuccess: () => void;
};

type IImportKeyForm = {
  alias: string;
  privateKey: string;
  needPassphrase?: boolean;
  passphrase?: string;
};

export const ImportKey = ({ onClose, onImportedSuccess }: ImportKeyProps) => {
  const { t } = useTranslation();
  const { keystore, setKeystore } = useKeystore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    setValue,
    formState: { isValid },
  } = useEnhancedForm<IImportKeyForm>({
    resolver: yupResolver(getImportKeySchema(t)),
    mode: "onChange",
  });

  useEffect(() => setFocus("alias"), [setFocus]);

  const formChanged = useWatch({ control });
  useEffect(() => setError(undefined), [formChanged]);

  const needPassphrase = useWatch({ control, name: "needPassphrase" });
  const privateKeyForm = useWatch({ control, name: "privateKey" });
  useEffect(() => {
    const testPrivateKey = async () => {
      try {
        const timeout = (cb, interval) => () => new Promise<undefined>((resolve) => setTimeout(() => cb(resolve), interval));
        const onTimeout = timeout((resolve) => resolve(undefined), 200);

        const privateKeyData = await Promise.race([readPrivateKey({ armoredKey: privateKeyForm }), onTimeout()]);
        const needPassphrase = privateKeyData === undefined ? false : !privateKeyData.isDecrypted();
        setValue("needPassphrase", needPassphrase);
      } catch (error) {
        if (error instanceof Error) setValue("needPassphrase", false);
      }
    };

    testPrivateKey();
  }, [privateKeyForm, setValue]);

  const onSubmit = async (data: IImportKeyForm) => {
    const cleanData: IImportKeyForm = removeEmpty(data);

    try {
      setLoading(true);

      if (!data.alias || data.alias === "") throw new Error(t("PGPTool.aliasCannotBeEmpty"));

      const aliasExists = keystore?.storedKeys.find((key) => key.alias.toLowerCase() === data.alias.toLowerCase());
      if (aliasExists) throw new Error(t("PGPTool.keyWithAliasAlreadyExists", { alias: data.alias.toLowerCase() }));

      const readKey = await readPrivateKeyFromStoredKey(cleanData.privateKey, cleanData.passphrase);
      if (!readKey.isDecrypted()) throw new Error(t("PGPTool.keyNeedPassphrase"));

      const keyExists = keystore?.storedKeys.find((key) => key.privateKey === cleanData.privateKey);
      if (keyExists) throw new Error(t("PGPTool.keyAlreadyExists"));

      const newKeyToAdd: IStoredKey = {
        id: uuid(),
        alias: data.alias,
        passphrase: data.passphrase,
        privateKey: cleanData.privateKey,
        publicKey: readKey.toPublic().armor(),
        createdAt: new Date(),
      };

      setKeystore((prev) => ({ ...prev, storedKeys: [newKeyToAdd, ...prev!.storedKeys] }));
      onClose();
      onImportedSuccess();
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      removeAnimation
      titleIcon={<UploadIcon className="mr-2" fontSize="large" />}
      title={t("PGPTool.importKey")}
      pgpKeystoreStyles
      capitalizeTitle
      isShowing={true}
      onHide={onClose}
    >
      <StyledBaseKeystoreContainer size="big">
        <p className="mb-4">{t("PGPTool.importKeyDescription")}</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            {...register("alias")}
            label={t("PGPTool.keyNameAlias")}
            placeholder={t("PGPTool.keyNameAliasPlaceholder")}
            colorable
          />

          <FormInput
            {...register("privateKey")}
            label={t("PGPTool.privateKey")}
            placeholder={t("PGPTool.privateKeyPlaceholder")}
            colorable
            type="textarea"
          />

          {needPassphrase && (
            <>
              <p className="mb-4">{t("PGPTool.privateKeyHasPassphrase")}</p>
              <FormInput
                {...register("passphrase")}
                type="password"
                label={t("PGPTool.passphrase")}
                placeholder={t("PGPTool.passphrasePlaceholder")}
                colorable
              />
            </>
          )}

          <p className="error mb-2">{error}</p>
          <Button disabled={!isValid || loading} type="submit" expanded>
            {loading ? `${t("loading")}...` : t("PGPTool.createNewKeyPair")}
          </Button>
        </form>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
