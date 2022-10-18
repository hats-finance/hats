import { useState } from "react";

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => setIsShowing(!isShowing);
  const hide = () => setIsShowing(false);
  const show = () => setIsShowing(true);

  return { isShowing, toggle, hide, show };
};

export default useModal;
