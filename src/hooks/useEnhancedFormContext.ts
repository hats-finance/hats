import { FieldValues, useFormContext, UseFormReturn } from "react-hook-form";

function useEnhancedFormContext<T extends FieldValues>(): UseFormReturn<T> {
  const context = useFormContext<T>();

  const overriddenRegister = (name) => {
    const isDirty = context.getFieldState(name, context.formState).isDirty;

    return { ...context.register(name), isDirty };
  };

  return { ...context, register: overriddenRegister };
}

export default useEnhancedFormContext;
