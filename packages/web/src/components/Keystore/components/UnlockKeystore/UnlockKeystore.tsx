import { yupResolver } from "@hookform/resolvers/yup";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Button, CollapsableTextContent, FormInput, Modal } from "components";
import { LocalStorage } from "constants/constants";
import { useEnhancedForm } from "hooks/form";
import useConfirm from "hooks/useConfirm";
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
  const confirm = useConfirm();
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

  const handleDeleteKeystore = async () => {
    const wantToDelete = await confirm({
      title: t("PGPTool.deleteKeystore"),
      titleIcon: <DeleteIcon className="mr-2" fontSize="large" />,
      description: t("PGPTool.deleteKeystoreDescription"),
      cancelText: t("no"),
      confirmText: t("delete"),
      confirmTextInput: {
        label: t("PGPTool.confirmDeleteKeystore"),
        placeholder: t("PGPTool.confirmDeleteKeystore"),
        textToConfirm: "yes",
      },
    });

    if (!wantToDelete) return;
    localStorage.removeItem(LocalStorage.Keystore);
    window.location.reload();
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
            noMargin
          />

          <p className="error mt-2">{error}</p>
          <Button className="mt-5" disabled={!isValid} type="submit" expanded>
            {t("PGPTool.unlockKeystore")}
          </Button>

          <div className="mt-5">
            <CollapsableTextContent noContentPadding title={t("PGPTool.dontHaveAccessToKeystore")}>
              <>
                <p className="mb-3">{t("PGPTool.dontHaveAccessToKeystoreExplanation")}</p>
                <Button onClick={handleDeleteKeystore} className="mt-2" styleType="invisible" noPadding>
                  {t("PGPTool.deleteKeystore")}
                </Button>
              </>
            </CollapsableTextContent>
          </div>
        </form>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
