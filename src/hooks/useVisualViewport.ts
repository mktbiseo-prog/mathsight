import { useState, useEffect } from "react";

export function useVisualViewport() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    function onResize() {
      const diff = window.innerHeight - (vv?.height ?? window.innerHeight);
      setKeyboardHeight(Math.max(0, diff));
    }

    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, []);

  return { keyboardHeight };
}
