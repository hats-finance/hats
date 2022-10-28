import { parseIsDirty } from "./../components/FormControls/utils";
import { FieldValues, useFormContext, UseFormRegister, UseFormReturn } from "react-hook-form";
import { getPath } from "utils/objects.utils";

function useEnhancedFormContext<T extends FieldValues>(): UseFormReturn<T> {
  const context = useFormContext<T>();

  const overriddenRegister: UseFormRegister<T> = (name) => {
    return {
      ...context.register(name),
      isDirty: parseIsDirty(getPath(context.formState.dirtyFields, name)),
      error: getPath(context.formState.errors, name),
    };
  };

  return { ...context, register: overriddenRegister };
}

export { useEnhancedFormContext };
