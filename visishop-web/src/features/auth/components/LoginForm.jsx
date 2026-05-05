import FormField from "./FormField";

function LoginForm({
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
        label="Usuario o email"
        name="name"
        placeholder="tu@email.com"
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
        placeholder="Ingresa tu clave"
        value={values.password}
        error={touched.password ? errors.password : ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={loading}
        autoComplete="current-password"
      />

      <div className="flex justify-end pt-1">
        <button
          type="button"
          disabled
          className="text-xs font-semibold text-slate-300/80 underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          title="Próximamente"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

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
        {loading ? "Ingresando..." : "Entrar"}
      </button>
    </form>
  );
}

export default LoginForm;
