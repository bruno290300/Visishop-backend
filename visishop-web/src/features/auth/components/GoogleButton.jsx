import { useEffect, useRef, useState } from "react";
import {
  getGoogleClientId,
  loadGoogleIdentityScript,
} from "../services/googleIdentity";

function GoogleButton({ disabled, onCredential }) {
  const buttonRef = useRef(null);
  const callbackRef = useRef(onCredential);
  const [error, setError] = useState("");

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    let cancelled = false;
 
    async function renderGoogleButton() {
      try {
        const clientId = await getGoogleClientId();
        if (!clientId) {
          throw new Error("Google Sign-In no esta configurado en el servidor.");
        }

        const googleId = await loadGoogleIdentityScript();
        if (cancelled || !buttonRef.current || !googleId) return;

        const currentClientId = window.__visishopGoogleClientId;
        if (!window.__visishopGoogleInitialized || currentClientId !== clientId) {
          googleId.initialize({
            client_id: clientId,
            callback: (response) => {
              callbackRef.current?.(response?.credential || "");
            },
            ux_mode: "popup",
          });
          window.__visishopGoogleInitialized = true;
          window.__visishopGoogleClientId = clientId;
        }

        buttonRef.current.innerHTML = "";
        googleId.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          width: 240,
          logo_alignment: "left",
        });
        setError("");
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message || "No se pudo cargar Google Sign-In.");
        }
      }
    }

    renderGoogleButton();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-2">
      <div
        className={[
          "flex justify-center rounded-full border border-white/15 bg-white/5 px-3 py-2",
          disabled ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
      >
        <div ref={buttonRef} />
      </div>
      {error && <p className="text-center text-xs text-red-200">{error}</p>}
    </div>
  );
}

export default GoogleButton;
