import { useEffect, useMemo, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

const SUPPORTED_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
];

function BarcodeScannerModal({
  open,
  productName,
  expectedCode,
  onClose,
  onScanSuccess,
}) {
  const [status, setStatus] = useState("Iniciando camara...");
  const [error, setError] = useState("");
  const scannerId = useMemo(
    () => `barcode-reader-${Math.random().toString(36).slice(2, 10)}`,
    []
  );

  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    const scanner = new Html5Qrcode(scannerId);
    const isSecure =
      window.isSecureContext ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    async function stopScanner() {
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
      } catch {
        // no-op
      }
      try {
        await scanner.clear();
      } catch {
        // no-op
      }
    }

    async function startScanner() {
      try {
        if (!isSecure) {
          setError(
            "Camara bloqueada: abre la app en HTTPS o localhost para habilitar permisos."
          );
          setStatus("Contexto no seguro.");
          return;
        }

        if (!navigator.mediaDevices?.getUserMedia) {
          setError("Este navegador no permite acceso a camara.");
          setStatus("Camara no soportada.");
          return;
        }

        setStatus("Solicitando permisos de camara...");
        setError("");

        const scannerConfig = {
          fps: 10,
          aspectRatio: 1.777,
          formatsToSupport: SUPPORTED_FORMATS,
        };

        const onSuccess = async (decodedText) => {
          if (!isMounted) return;
          setStatus("Codigo detectado. Verificando...");
          await stopScanner();
          onScanSuccess(decodedText);
        };

        const onFailure = () => {
          // lectura continua
        };

        try {
          await scanner.start({ facingMode: "environment" }, scannerConfig, onSuccess, onFailure);
        } catch {
          const cameras = await Html5Qrcode.getCameras();
          if (!cameras?.length) {
            throw new Error("No se detectaron camaras disponibles.");
          }
          await scanner.start(cameras[0].id, scannerConfig, onSuccess, onFailure);
        }

        if (isMounted) {
          setStatus("Enfoca el codigo de barras dentro del recuadro.");
        }
      } catch (err) {
        if (!isMounted) return;
        setError(
          err?.message ||
            "No se pudo iniciar la camara. Revisa permisos del navegador."
        );
        setStatus("Camara no disponible.");
      }
    }

    startScanner();

    return () => {
      isMounted = false;
      stopScanner();
    };
  }, [open, onScanSuccess, scannerId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="modal-enter w-full max-w-lg rounded-3xl border border-white/20 bg-slate-900/95 p-4 shadow-2xl shadow-slate-950/70 sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/75">
              Escaneo activo
            </p>
            <h2 className="text-lg font-semibold text-white">{productName}</h2>
            <p className="mt-1 text-xs font-mono text-slate-400">
              Esperado: {expectedCode}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/20 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
          >
            Cerrar
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/60 p-2">
          <div id={scannerId} className="min-h-[260px] w-full" />
        </div>

        <div className="mt-3 space-y-2">
          <p className="text-xs text-slate-300">{status}</p>
          {error && (
            <div className="rounded-xl border border-red-300/35 bg-red-400/10 px-3 py-2 text-xs text-red-100">
              {error}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default BarcodeScannerModal;
