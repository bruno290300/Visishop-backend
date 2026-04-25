function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  disabled,
}) {
  const inputClassName = [
    "w-full rounded-xl border bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none",
    "transition-all duration-200 placeholder:text-slate-400",
    error
      ? "border-red-400/80 focus:border-red-300 focus:ring-2 focus:ring-red-400/30"
      : "border-slate-400/20 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30",
    disabled ? "cursor-not-allowed opacity-70" : "",
  ].join(" ");

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-300">
        {label}
      </span>
      <input
        className={inputClassName}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
      <span
        className={[
          "min-h-5 text-xs transition-opacity duration-200",
          error ? "opacity-100 text-red-300" : "opacity-0",
        ].join(" ")}
      >
        {error || "ok"}
      </span>
    </label>
  );
}

export default FormField;
