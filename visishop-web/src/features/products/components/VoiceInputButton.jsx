import { useEffect, useRef, useState } from "react";

function VoiceInputButton({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("Toca para dictar el nombre del producto.");
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // no-op
      }
    };
  }, []);

  function getSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    return new SpeechRecognition();
  }

  async function requestMicrophonePermission() {
    if (!navigator.mediaDevices?.getUserMedia) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
  }

  async function handleVoiceInput() {
    if (isListening) return;
    setIsListening(true);
    setMessage("Preparando microfono...");

    const recognition = getSpeechRecognition();

    if (!recognition) {
      setMessage("Tu navegador no soporta reconocimiento de voz.");
      setIsListening(false);
      return;
    }

    try {
      await requestMicrophonePermission();
    } catch {
      setMessage("Permiso de microfono denegado. Habilitalo en el navegador.");
      setIsListening(false);
      return;
    }

    recognition.lang = "es-AR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setMessage("Escuchando...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      const normalized = transcript.trim();
      if (normalized) {
        onTranscript(normalized);
        setMessage(`Nombre detectado: "${normalized}"`);
      } else {
        setMessage("No se detecto texto. Intenta nuevamente.");
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setMessage("Microfono bloqueado. Permiti acceso al microfono.");
      } else if (event.error === "no-speech") {
        setMessage("No se detecto voz. Intenta hablar mas cerca del microfono.");
      } else {
        setMessage("No se pudo capturar voz. Reintenta nuevamente.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleVoiceInput}
        disabled={isListening}
        className={[
          "flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition duration-300",
          isListening
            ? "cursor-not-allowed border-cyan-300/70 bg-cyan-300/20 text-cyan-100"
            : "border-white/20 bg-white/10 text-slate-100 hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-cyan-300/10 active:translate-y-0",
        ].join(" ")}
      >
        <span
          className={[
            "h-2.5 w-2.5 rounded-full",
            isListening ? "animate-pulse bg-cyan-300" : "bg-slate-300",
          ].join(" ")}
        />
        {isListening ? "Escuchando..." : "Agregar por voz"}
      </button>
      <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
        {message}
      </p>
    </div>
  );
}

export default VoiceInputButton;
