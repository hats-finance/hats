import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormInput, Modal } from "components";
import { useEnhancedForm } from "hooks/form";
import { getCreateKeystoreSchema } from "./formSchema";
import { StyledBaseKeystoreContainer } from "../../styles";

type CreateKeystoreProps = {
  onClose?: () => void;
  onKeystoreCreated?: (pass: string) => Promise<void> | undefined;
};

type ICreateKeystoreForm = {
  password: string;
  confirmPassword: string;
};

export const CreateKeystore = ({ onClose, onKeystoreCreated }: CreateKeystoreProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { isValid },
  } = useEnhancedForm<ICreateKeystoreForm>({
    resolver: yupResolver(getCreateKeystoreSchema(t)),
    mode: "onChange",
  });

  useEffect(() => setFocus("password"), [setFocus]);

  const onSubmit = async (data: ICreateKeystoreForm) => {
    if (onKeystoreCreated) await onKeystoreCreated(data.password);
  };

  return (
    <Modal removeAnimation title={t("PGPTool.title")} newStyles capitalizeTitle isShowing={true} onHide={onClose}>
      <StyledBaseKeystoreContainer>
        <div className="mb-4">{t("PGPTool.createStrongPasswordForKeystore")}</div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            {...register("password")}
            type="password"
            placeholder={t("PGPTool.createStrongPassword")}
            label={t("PGPTool.pgpToolPassword")}
            colorable
          />
          <FormInput
            {...register("confirmPassword")}
            type="password"
            placeholder={t("PGPTool.confirmPassword")}
            label={t("PGPTool.pgpToolPassword")}
            colorable
          />

          <Button disabled={!isValid} type="submit" expanded>
            {t("PGPTool.createKeystore")}
          </Button>
        </form>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
