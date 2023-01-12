import { forwardRef } from "react";
import { StyledFormPgpPublicKeyInput } from "./styles";
import { useTranslation } from "react-i18next";
import { parseIsDirty } from "../utils";
import useModal from "hooks/useModal";
import { PgpPublicKeyInputModal } from "./PgpPublicKeyInputModal";

interface FormPgpPublicKeyInputProps {
  label?: string;
  placeholder?: string;
  colorable?: boolean;
  isDirty?: boolean;
  value: string;
  onChange: (data: string) => void;
  error?: { message: string; type: string };
}

export function FormPgpPublicKeyInputComponent(
  { value, onChange, colorable = false, isDirty = false, error, placeholder, label }: FormPgpPublicKeyInputProps,
  ref
) {
  const { t } = useTranslation();
  const { isShowing: isShowingPgpKeyInput, show: showPgpKeyInput, hide: hidePgpKeyInput } = useModal();

  const getPgpKeyResumed = (pgpKey: string) => `${pgpKey.split("\n\n")[0]} \n ${pgpKey.split("\n\n")[1].slice(0, 50)}...`;

  return (
    <StyledFormPgpPublicKeyInput hasError={!!error && colorable} isDirty={parseIsDirty(isDirty) && colorable}>
      <div className="select-button" onClick={showPgpKeyInput}>
        <label>{label ?? t("pgpPublicKey")}</label>
        {value ? (
          <p className="value">{getPgpKeyResumed(value)}</p>
        ) : (
          <p className="placeholder">{placeholder ?? t("addPgpPublicKey")}</p>
        )}
      </div>

      {error && <span className="error">{error.message}</span>}

      <PgpPublicKeyInputModal isShowing={isShowingPgpKeyInput} onHide={hidePgpKeyInput} onPgpKeySelected={onChange} ref={ref} />
    </StyledFormPgpPublicKeyInput>
  );
}

export const FormPgpPublicKeyInput = forwardRef(FormPgpPublicKeyInputComponent);
