import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormInput, Modal } from "components";
import { useEnhancedForm } from "hooks/form";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyledBaseKeystoreContainer } from "../../styles";
import { getUnlockKeystoreSchema } from "./formSchema";

type UnlockKeystoreProps = {
  onClose?: () => void;
  onKeystoreUnlocked?: (pass: string) => Promise<void> | undefined;
};

type IUnlockKeystoreForm = {
  password: string;
};

export const UnlockKeystore = ({ onClose, onKeystoreUnlocked }: UnlockKeystoreProps) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | undefined>();

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    formState: { isValid },
  } = useEnhancedForm<IUnlockKeystoreForm>({
    resolver: yupResolver(getUnlockKeystoreSchema(t)),
    mode: "onChange",
  });

  useEffect(() => setFocus("password"), [setFocus]);

  const password = useWatch({ control, name: "password" });
  useEffect(() => setError(undefined), [password]);

  const onSubmit = async (data: IUnlockKeystoreForm) => {
    if (onKeystoreUnlocked) {
      try {
        await onKeystoreUnlocked(data.password);
      } catch (error) {
        setError((error as any).message);
      }
    }
  };

  return (
    <Modal removeAnimation title={t("PGPTool.title")} capitalizeTitle isShowing={true} onHide={onClose}>
      <StyledBaseKeystoreContainer>
        <div className="mb-4">{t("PGPTool.unlockPgpTool")}</div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            {...register("password")}
            type="password"
            placeholder={t("PGPTool.enterYourPgpToolPassword")}
            label={t("PGPTool.pgpToolPassword")}
            colorable
          />

          <p className="error mb-2">{error}</p>
          <Button disabled={!isValid} type="submit" expanded>
            {t("PGPTool.unlockKeystore")}
          </Button>
        </form>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
