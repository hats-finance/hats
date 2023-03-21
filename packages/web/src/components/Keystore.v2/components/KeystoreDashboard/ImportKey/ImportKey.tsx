import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { generateKey } from "openpgp";
import { v4 as uuid } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { getPath, removeEmpty } from "utils/objects.utils";
import { Button, FormInput, Modal } from "components";
import { getImportKeySchema } from "../ImportKey/formSchema";
import { useKeystore } from "../../../KeystoreProvider";
import { IStoredKey } from "../../../types";
import { StyledBaseKeystoreContainer } from "../../../styles";
import UploadIcon from "@mui/icons-material/FileUploadOutlined";

type ImportKeyProps = {
  onClose: () => void;
};

type IImportKeyForm = {
  alias: string;
  privateKey: string;
  passphrase?: string;
};

export const ImportKey = ({ onClose }: ImportKeyProps) => {
  const { t } = useTranslation();
  const { keystore, setKeystore } = useKeystore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = useForm<IImportKeyForm>({
    resolver: yupResolver(getImportKeySchema(t)),
    mode: "onChange",
  });

  useEffect(() => setFocus("alias"), [setFocus]);

  const formChanged = useWatch({ control });
  useEffect(() => setError(undefined), [formChanged]);

  const onSubmit = async (data: IImportKeyForm) => {
    const cleanData = removeEmpty(data);
    console.log(cleanData);

    // try {
    //   setLoading(true);
    //   const { privateKey, publicKey } = await generatePgpKeyPair(cleanData);

    //   if (!data.alias || data.alias === "") throw new Error(t("PGPTool.aliasCannotBeEmpty"));

    //   const aliasExists = keystore?.storedKeys.find((key) => key.alias.toLowerCase() === data.alias.toLowerCase());
    //   if (aliasExists) throw new Error(t("PGPTool.keyWithAliasAlreadyExists", { alias: data.alias.toLowerCase() }));

    //   const keyExists = keystore?.storedKeys.find((key) => key.privateKey === privateKey);
    //   if (keyExists) throw new Error(t("PGPTool.keyAlreadyExists"));

    //   const newKeyToAdd: IStoredKey = {
    //     id: uuid(),
    //     alias: data.alias,
    //     passphrase: data.passphrase,
    //     privateKey,
    //     publicKey,
    //     createdAt: new Date(),
    //   };
    //   setKeystore((prev) => ({ ...prev, storedKeys: [newKeyToAdd, ...prev!.storedKeys] }));

    //   onClose();
    // } catch (error) {
    //   if (error instanceof Error) setError(error.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  const generatePgpKeyPair = async (data: IImportKeyForm) => {
    // const keyResult = await generateKey({
    //   type: "rsa",
    //   rsaBits: 2048,
    //   userIDs: { name: data.name, email: data.email },
    //   passphrase: data.passphrase,
    //   format: "armored",
    // });
    // return keyResult;
  };

  return (
    <Modal
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
            error={getPath(errors, "alias")}
          />

          <FormInput
            {...register("privateKey")}
            label={t("PGPTool.privateKey")}
            placeholder={t("PGPTool.privateKeyPlaceholder")}
            colorable
            type="textarea"
            error={getPath(errors, "privateKey")}
          />

          <p className="error mb-2">{error}</p>
          <Button disabled={!isValid || loading} type="submit" expanded>
            {loading ? `${t("loading")}...` : t("PGPTool.createNewKeyPair")}
          </Button>
        </form>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
