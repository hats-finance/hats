import { RefObject, useEffect, useState } from "react";

export const useElementOutsideScrreen = (ref: RefObject<HTMLElement>, isShowed: boolean) => {
  const [isOutsideScreen, setIsOutsideScreen] = useState(false);

  useEffect(() => {
    // This timeout is because the element is not rendered yet when the hook is called
    setTimeout(() => {
      const { x: xPosition } = ref.current?.getBoundingClientRect() || { x: 0 };
      if (xPosition < 0) setIsOutsideScreen(true);
      else setIsOutsideScreen(false);
    }, 1);
  }, [ref, isShowed]);

  return isOutsideScreen;
};
