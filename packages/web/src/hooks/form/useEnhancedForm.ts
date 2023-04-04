import { FieldValues, useForm, UseFormProps, UseFormRegister, UseFormReturn, useFormState } from "react-hook-form";
import { getPath } from "utils/objects.utils";
import { getCustomIsDirty } from "./utils";

// Warning: This should only be used for standalone forms, not for forms that will use the form context.
export function useEnhancedForm<T extends FieldValues>(props: UseFormProps<T, any>): UseFormReturn<T> {
  const methods = useForm<T>(props);
  const { dirtyFields, defaultValues, errors } = useFormState<T>({ control: methods.control });

  const overriddenRegister: UseFormRegister<T> = (name) => {
    return {
      ...methods.register(name),
      isDirty: getCustomIsDirty(name, dirtyFields, defaultValues),
      error: getPath(errors, name),
    };
  };

  return { ...methods, register: overriddenRegister };
}
