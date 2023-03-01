import { FieldValues, useFormContext, UseFormRegister, UseFormReturn, useFormState, UseFormStateReturn } from "react-hook-form";
import { getPath } from "utils/objects.utils";
import { parseIsDirty } from "../components/FormControls/utils";

function getCustomIsDirty<T extends FieldValues>(
  name: string,
  dirtyFields: UseFormStateReturn<T>["dirtyFields"],
  defaultValues: UseFormStateReturn<T>["defaultValues"]
): boolean {
  const defaultValue = getPath(defaultValues, name);
  const nonEmptyDefaultValue = defaultValue !== undefined && defaultValue !== null && defaultValue !== "";

  return nonEmptyDefaultValue && parseIsDirty(getPath(dirtyFields, name));
}

function useEnhancedFormContext<T extends FieldValues>(): UseFormReturn<T> {
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

export { useEnhancedFormContext, getCustomIsDirty };
