import { useCallback } from 'react';
import { FieldPath, UseFormSetValue } from 'react-hook-form';
import { ISubmissionsDescriptionsData } from '../types';

export interface ISubmissionDebounceHook {
  debouncedSetValue: (name: FieldPath<ISubmissionsDescriptionsData>, value: any) => void;
  debouncedUpdateDescription: (index: number, value: string) => void;
  debouncedUpdateTitle: (index: number, value: string) => void;
  debouncedHandleFixFiles: (index: number, files: File[]) => Promise<void>;
  debouncedHandleTestFiles: (index: number, files: File[]) => Promise<void>;
}

export function useSubmissionDebounce(setValue: UseFormSetValue<ISubmissionsDescriptionsData>): ISubmissionDebounceHook {
  // Debounced form updates with type safety
  const debouncedSetValue = useCallback((name: FieldPath<ISubmissionsDescriptionsData>, value: any) => {
    const timeoutId = setTimeout(() => {
      setValue(name, value, { shouldValidate: true });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [setValue]);

  // Debounced description update
  const debouncedUpdateDescription = useCallback((index: number, value: string) => {
    debouncedSetValue(`descriptions.${index}.description`, value);
  }, [debouncedSetValue]);

  // Debounced title update
  const debouncedUpdateTitle = useCallback((index: number, value: string) => {
    debouncedSetValue(`descriptions.${index}.title`, value);
  }, [debouncedSetValue]);

  // Debounced file handler for fix files
  const debouncedHandleFixFiles = useCallback(async (index: number, files: File[]) => {
    if (!files?.length) return;
    debouncedSetValue(`descriptions.${index}.complementFixFiles`, files);
  }, [debouncedSetValue]);

  // Debounced file handler for test files
  const debouncedHandleTestFiles = useCallback(async (index: number, files: File[]) => {
    if (!files?.length) return;
    debouncedSetValue(`descriptions.${index}.complementTestFiles`, files);
  }, [debouncedSetValue]);

  return {
    debouncedSetValue,
    debouncedUpdateDescription,
    debouncedUpdateTitle,
    debouncedHandleFixFiles,
    debouncedHandleTestFiles
  };
} 