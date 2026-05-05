import FormField from "./FormField";

function RegisterForm({
  values,
  errors,
  touched,
  loading,
  onChange,
  onBlur,
  onSubmit,
}) {
  return (
    <form className="mt-6 space-y-1" onSubmit={onSubmit} noValidate>
      <FormField
        label="Usuario"
        name="name"
        placeholder="Ej: lucia"
        value={values.name}
        error={touched.name ? errors.name : ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={loading}
        autoComplete="username"
      />

      <FormField
        label="Clave"
        name="password"
        type="password"
        placeholder="Mínimo 4 caracteres"
        value={values.password}
        error={touched.password ? errors.password : ""}
        helperText="Usá letras, números y un símbolo."
        onChange={onChange}
        onBlur={onBlur}
        disabled={loading}
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={loading}
        className={[
          "mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold",
          "transition-all duration-300",
          loading
            ? "cursor-not-allowed bg-cyan-300/50 text-slate-900"
            : "bg-gradient-to-r from-cyan-300 to-teal-300 text-slate-900 hover:brightness-110 active:scale-[0.99]",
        ].join(" ")}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
        )}
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}

export default RegisterForm;
