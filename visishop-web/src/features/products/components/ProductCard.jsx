function ProductCard({ product, onScan }) {
  const isVerified = product.status === "verified";
  const isError = product.scanFeedback?.type === "error";
  const isSuccess = product.scanFeedback?.type === "success";

  return (
    <article
      className={[
        "card-enter rounded-2xl border bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/35",
        isError
          ? "scan-error border-red-300/45"
          : isSuccess
            ? "border-emerald-300/40"
            : "border-white/20",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-slate-400">
            Producto
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-100">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-slate-400">
            Codigo esperado: {product.barcode}
          </p>
        </div>
        <span
          className={[
            "rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em]",
            isVerified
              ? "bg-emerald-300/20 text-emerald-200"
              : "bg-amber-300/20 text-amber-200",
          ].join(" ")}
        >
          {isVerified ? "Verificado" : "Pendiente"}
        </span>
      </div>

      <button
        type="button"
        disabled={product.isScanning}
        onClick={() => onScan(product.id)}
        className={[
          "mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-300",
          product.isScanning
            ? "cursor-not-allowed bg-cyan-300/20 text-cyan-100"
            : isVerified
              ? "bg-emerald-300/20 text-emerald-100 hover:bg-emerald-300/30"
              : "bg-white/10 text-slate-100 hover:bg-cyan-300/20 hover:text-cyan-100",
        ].join(" ")}
      >
        {product.isScanning && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-200 border-t-transparent" />
        )}
        {product.isScanning
          ? "Escaneando..."
          : isVerified
            ? "Reescanear"
            : "Escanear"}
      </button>

      {product.scanFeedback && (
        <div
          className={[
            "mt-3 rounded-xl border px-3 py-2 text-xs",
            isSuccess
              ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100"
              : "border-red-300/40 bg-red-400/10 text-red-100",
          ].join(" ")}
        >
          <p className="font-semibold">{product.scanFeedback.message}</p>
          <p className="mt-1 font-mono">
            Leido: {product.scanFeedback.scannedCode} | Esperado:{" "}
            {product.scanFeedback.expectedCode}
          </p>
        </div>
      )}
    </article>
  );
}

export default ProductCard;
