import { createContext, useCallback, useContext, useRef, useState } from "react";
import { ConfirmDialog, ConfirmDialogProps } from "components";

const ConfirmDialogContext = createContext<(data: Omit<ConfirmDialogProps, "isShowing">) => Promise<boolean>>(null as any);

export function ConfirmDialogProvider({ children }) {
  const [state, setState] = useState<ConfirmDialogProps>({ isShowing: false });
  const fn = useRef<(choice: boolean) => void>();

  const confirm = useCallback(
    (data: Omit<ConfirmDialogProps, "isShowing">) => {
      return new Promise<boolean>((resolve) => {
        setState({ ...data, isShowing: true });
        fn.current = (choice: boolean) => {
          resolve(choice);
          setState({ isShowing: false });
        };
      });
    },
    [setState]
  );

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      <ConfirmDialog {...state} onCancel={() => fn.current?.(false)} onSuccess={() => fn.current?.(true)} />
    </ConfirmDialogContext.Provider>
  );
}

export default function useConfirm() {
  return useContext(ConfirmDialogContext);
}
