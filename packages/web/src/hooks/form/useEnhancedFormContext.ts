import { FieldValues, useFormContext, UseFormRegister, UseFormReturn, useFormState } from "react-hook-form";
import { getPath } from "utils/objects.utils";
import { getCustomIsDirty } from "./utils";

// Warning: If you are using this method be sure to wrap your form with a normal `useForm` and not `useEnhancedForm`.
export function useEnhancedFormContext<T extends FieldValues>(): UseFormReturn<T> {
  const context = useFormContext<T>();
  const { dirtyFields, defaultValues, errors } = useFormState<T>({ control: context.control });

  const overriddenRegister: UseFormRegister<T> = (name) => {
    return {
      ...context.register(name),
      isDirty: getCustomIsDirty(name, dirtyFields, defaultValues),
      error: getPath(errors, name),
    };
  };

  return { ...context, register: overriddenRegister };
}
