import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormInput, Modal } from "components";
import { getPath } from "utils/objects.utils";
import { getCreateKeystoreSchema } from "./formSchema";
import { StyledBaseKeystoreContainer } from "../../styles";

type CreateKeystoreProps = {
  onClose?: () => void;
  onCreateKeystore?: (pass: string) => Promise<void> | undefined;
};

type ICreateKeystoreForm = {
  password: string;
  confirmPassword: string;
};

export const CreateKeystore = ({ onClose, onCreateKeystore }: CreateKeystoreProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = useForm<ICreateKeystoreForm>({
    resolver: yupResolver(getCreateKeystoreSchema(t)),
    mode: "onChange",
  });

  useEffect(() => setFocus("password"), [setFocus]);

  const onSubmit = async (data: ICreateKeystoreForm) => {
    if (onCreateKeystore) await onCreateKeystore(data.password);
  };

  return (
    <Modal title={t("PGPTool.title")} pgpKeystoreStyles capitalizeTitle isShowing={true} onHide={onClose}>
      <StyledBaseKeystoreContainer>
        <div className="mb-4">{t("PGPTool.createStrongPasswordForKeystore")}</div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            {...register("password")}
            placeholder={t("PGPTool.createStrongPassword")}
            label={t("PGPTool.pgpToolPassword")}
            colorable
            error={getPath(errors, "password")}
          />
          <FormInput
            {...register("confirmPassword")}
            placeholder={t("PGPTool.confirmPassword")}
            label={t("PGPTool.pgpToolPassword")}
            colorable
            error={getPath(errors, "confirmPassword")}
          />

          <Button disabled={!isValid} type="submit" expanded>
            {t("PGPTool.createKeystore")}
          </Button>
        </form>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
