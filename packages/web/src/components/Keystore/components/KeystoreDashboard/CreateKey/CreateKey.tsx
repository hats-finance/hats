import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { generateKey } from "openpgp";
import { v4 as uuid } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useEnhancedForm } from "hooks/form";
import { removeEmpty } from "utils/objects.utils";
import { Button, FormInput, Modal } from "components";
import { AdvancedModeContainer } from "./styles";
import { getCreateKeySchema } from "./formSchema";
import { useKeystore } from "../../../KeystoreProvider";
import { IStoredKey } from "../../../types";
import { StyledBaseKeystoreContainer } from "../../../styles";
import AddIcon from "@mui/icons-material/Add";

type CreateKeyProps = {
  onClose: () => void;
  onCreatedSuccess: () => void;
};

type ICreateKeyForm = {
  advancedMode: boolean;
  alias: string;
  passphrase?: string;
  name?: string;
  email?: string;
};

export const CreateKey = ({ onClose, onCreatedSuccess }: CreateKeyProps) => {
  const { t } = useTranslation();
  const { keystore, setKeystore } = useKeystore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    formState: { isValid },
  } = useEnhancedForm<ICreateKeyForm>({
    resolver: yupResolver(getCreateKeySchema(t)),
    mode: "onChange",
  });

  useEffect(() => setFocus("alias"), [setFocus]);
  const advancedMode = useWatch({ control, name: "advancedMode" });

  const formChanged = useWatch({ control });
  useEffect(() => setError(undefined), [formChanged]);

  const onSubmit = async (data: ICreateKeyForm) => {
    const cleanData: ICreateKeyForm = removeEmpty(data);

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
        alias: cleanData.alias,
        passphrase: cleanData.advancedMode ? cleanData.passphrase : undefined,
        privateKey,
        publicKey,
        createdAt: new Date(),
      };

      setKeystore((prev) => ({ ...prev, storedKeys: [newKeyToAdd, ...prev!.storedKeys], isBackedUp: false }));
      onClose();
      onCreatedSuccess();
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
      passphrase: data.advancedMode ? data.passphrase : undefined,
      format: "armored",
    });

    return keyResult;
  };

  return (
    <Modal
      removeAnimation
      titleIcon={<AddIcon className="mr-2" fontSize="large" />}
      title={t("PGPTool.createNewKeyPair")}
      newStyles
      capitalizeTitle
      isShowing={true}
      onHide={onClose}
    >
      <StyledBaseKeystoreContainer>
        <AdvancedModeContainer>
          <FormInput {...register("advancedMode")} type="checkbox" label={t("advanced")} noMargin />
        </AdvancedModeContainer>

        <p className="mb-4">{t("PGPTool.createNewKeyPairDescription")}</p>
        {!advancedMode && <p className="mb-4">{t("PGPTool.createNewKeyPairDescription2")}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            {...register("alias")}
            label={`${t("PGPTool.keyNameAlias")}*`}
            placeholder={t("PGPTool.keyNameAliasPlaceholder")}
            colorable
          />

          {advancedMode && (
            <>
              <FormInput
                {...register("passphrase")}
                type="password"
                label={t("PGPTool.passphrase")}
                placeholder={`${t("PGPTool.passphrasePlaceholder")} (${t("optional").toLowerCase()})`}
                colorable
              />
              <FormInput
                {...register("name")}
                label={t("PGPTool.name")}
                placeholder={`${t("PGPTool.namePlaceholder")} (${t("optional").toLowerCase()})`}
                colorable
              />
              <FormInput
                {...register("email")}
                label={t("PGPTool.email")}
                placeholder={`${t("PGPTool.emailPlaceholder")} (${t("optional").toLowerCase()})`}
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
