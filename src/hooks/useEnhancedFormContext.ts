import { parseIsDirty } from "./../components/FormControls/utils";
import { FieldValues, useFormContext, UseFormRegister, UseFormReturn, useFormState } from "react-hook-form";
import { getPath } from "utils/objects.utils";

function useEnhancedFormContext<T extends FieldValues>(): UseFormReturn<T> {
  const context = useFormContext<T>();
  const { dirtyFields, errors } = useFormState<T>({ control: context.control });

  const overriddenRegister: UseFormRegister<T> = (name) => {
    return {
      ...context.register(name),
      isDirty: parseIsDirty(getPath(dirtyFields, name)),
      error: getPath(errors, name),
    };
  };

  return { ...context, register: overriddenRegister };
}

export { useEnhancedFormContext };
