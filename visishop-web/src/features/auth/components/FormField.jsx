import { useId, useState } from "react";

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  helperText,
  onChange,
  onBlur,
  disabled,
  autoComplete,
}) {
  const autoId = useId();
  const inputId = `${name}-${autoId}`;
  const helperId = `${inputId}-help`;
  const [revealPassword, setRevealPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && revealPassword ? "text" : type;

  const inputClassName = [
    "w-full rounded-xl border bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none",
    "transition-all duration-200 placeholder:text-slate-400",
    error
      ? "border-red-400/80 focus:border-red-300 focus:ring-2 focus:ring-red-400/30"
      : "border-slate-400/20 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30",
    disabled ? "cursor-not-allowed opacity-70" : "",
  ].join(" ");

  return (
    <label className="flex flex-col gap-1.5" htmlFor={inputId}>
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-300">
        {label}
      </span>
      <div className="relative">
        <input
          id={inputId}
          className={[inputClassName, isPassword ? "pr-12" : ""].join(" ")}
          name={name}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={helperText || error ? helperId : undefined}
          autoComplete={autoComplete}
        />
        {isPassword && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setRevealPassword((current) => !current)}
            className={[
              "absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold",
              "text-slate-200 transition-colors",
              disabled
                ? "cursor-not-allowed opacity-60"
                : "hover:bg-white/10 hover:text-white active:bg-white/15",
            ].join(" ")}
            aria-label={revealPassword ? "Ocultar clave" : "Mostrar clave"}
          >
            {revealPassword ? "Ocultar" : "Ver"}
          </button>
        )}
      </div>
      <span
        id={helperId}
        aria-live="polite"
        className={[
          "min-h-5 text-xs transition-opacity duration-200",
          error
            ? "opacity-100 text-red-300"
            : helperText
              ? "opacity-100 text-slate-300/80"
              : "opacity-0",
        ].join(" ")}
      >
        {error || helperText || "\u00A0"}
      </span>
    </label>
  );
}

export default FormField;
