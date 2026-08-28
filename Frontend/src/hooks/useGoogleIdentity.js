import { useState, useEffect } from "react";

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export function useGoogleIdentity() {
  const [ready, setReady] = useState(!!window.google?.accounts?.id);

  useEffect(() => {
    if (ready) return;

    let script = document.querySelector(`script[src="${SCRIPT_SRC}"]`);

    const handleLoad = () => {
      if (window.google?.accounts?.id) setReady(true);
    };

    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }

    script.addEventListener("load", handleLoad);

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        setReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      script.removeEventListener("load", handleLoad);
      clearInterval(interval);
    };
  }, [ready]);

  return ready;
}
