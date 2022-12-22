import { useCallback, useState } from "react";

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = useCallback(() => setIsShowing(!isShowing), [isShowing]);
  const hide = useCallback(() => setIsShowing(false), []);
  const show = useCallback(() => setIsShowing(true), []);

  return { isShowing, toggle, hide, show };
};

export default useModal;
