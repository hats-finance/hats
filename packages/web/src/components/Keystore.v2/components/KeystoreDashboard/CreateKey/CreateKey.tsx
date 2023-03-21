import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { generateKey } from "openpgp";
import { v4 as uuid } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { getPath, removeEmpty } from "utils/objects.utils";
import { Button, FormInput, Modal } from "components";
import { AdvancedModeContainer } from "./styles";
import { getCreateKeySchema } from "./formSchema";
import { useKeystore } from "../../../KeystoreProvider";
import { IStoredKey } from "../../../types";
import { StyledBaseKeystoreContainer } from "../../../styles";
import AddIcon from "@mui/icons-material/Add";

type CreateKeyProps = {
  onClose: () => void;
};

type ICreateKeyForm = {
  alias: string;
  passphrase?: string;
  name?: string;
  email?: string;
};

export const CreateKey = ({ onClose }: CreateKeyProps) => {
  const { t } = useTranslation();
  const { keystore, setKeystore } = useKeystore();

  const [advancedMode, setAdvancedMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = useForm<ICreateKeyForm>({
    resolver: yupResolver(getCreateKeySchema(t)),
    mode: "onChange",
  });

  useEffect(() => setFocus("alias"), [setFocus]);

  const formChanged = useWatch({ control });
  useEffect(() => setError(undefined), [formChanged]);

  const onSubmit = async (data: ICreateKeyForm) => {
    const cleanData = removeEmpty(data);

    try {
      setLoading(true);
      const { privateKey, publicKey } = await generatePgpKeyPair(cleanData);

      if (!data.alias || data.alias === "") throw new Error(t("PGPTool.aliasCannotBeEmpty"));

      const aliasExists = keystore?.storedKeys.find((key) => key.alias.toLowerCase() === data.alias.toLowerCase());
      if (aliasExists) throw new Error(t("PGPTool.keyWithAliasAlreadyExists", { alias: data.alias.toLowerCase() }));

      const keyExists = keystore?.storedKeys.find((key) => key.privateKey === privateKey);
      if (keyExists) throw new Error(t("PGPTool.keyAlreadyExists"));

      const newKeyToAdd: IStoredKey = {
        id: uuid(),
        alias: data.alias,
        passphrase: data.passphrase,
        privateKey,
        publicKey,
        createdAt: new Date(),
      };
      setKeystore((prev) => ({ ...prev, storedKeys: [newKeyToAdd, ...prev!.storedKeys] }));

      onClose();
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePgpKeyPair = async (data: ICreateKeyForm) => {
    const keyResult = await generateKey({
      type: "rsa",
      rsaBits: 2048,
      userIDs: { name: data.name, email: data.email },
      passphrase: data.passphrase,
      format: "armored",
    });

    return keyResult;
  };

  return (
    <Modal
      titleIcon={<AddIcon className="mr-2" fontSize="large" />}
      title={t("PGPTool.createNewKeyPair")}
      pgpKeystoreStyles
      capitalizeTitle
      isShowing={true}
      onHide={onClose}
    >
      <StyledBaseKeystoreContainer>
        <AdvancedModeContainer>
          <FormInput
            name="advancedMode"
            value={`${advancedMode}`}
            onChange={(e) => setAdvancedMode(e.target.checked)}
            type="checkbox"
            label={t("advanced")}
            noMargin
          />
        </AdvancedModeContainer>

        <p className="mb-4">{t("PGPTool.createNewKeyPairDescription")}</p>
        {!advancedMode && <p className="mb-4">{t("PGPTool.createNewKeyPairDescription2")}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            {...register("alias")}
            label={`${t("PGPTool.keyNameAlias")}*`}
            placeholder={t("PGPTool.keyNameAliasPlaceholder")}
            colorable
            error={getPath(errors, "alias")}
          />

          {advancedMode && (
            <>
              <FormInput
                {...register("passphrase")}
                label={t("PGPTool.passphrase")}
                placeholder={`${t("PGPTool.passphrasePlaceholder")} (${t("optional").toLowerCase()})`}
                colorable
                error={getPath(errors, "passphrase")}
              />
              <FormInput
                {...register("name")}
                label={t("PGPTool.name")}
                placeholder={`${t("PGPTool.namePlaceholder")} (${t("optional").toLowerCase()})`}
                colorable
                error={getPath(errors, "name")}
              />
              <FormInput
                {...register("email")}
                label={t("PGPTool.email")}
                placeholder={`${t("PGPTool.emailPlaceholder")} (${t("optional").toLowerCase()})`}
                colorable
                error={getPath(errors, "email")}
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
