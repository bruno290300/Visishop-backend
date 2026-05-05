import AppLogo from "../../../components/common/AppLogo";
import GoogleButton from "./GoogleButton";
import RegisterForm from "./RegisterForm";

function RegisterCard({
  loading,
  errorMessage,
  successMessage,
  registerState,
  onRegisterSubmit,
  onRegisterChange,
  onRegisterBlur,
  onSwitchToLogin,
  onGoogleCredential,
}) {
  return (
    <section className="card-enter relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-400/25 blur-2xl" />
      <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-teal-300/20 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <AppLogo size="sm" className="shrink-0" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Crear cuenta
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-300/90">
              Unite para una experiencia mejor.
            </p>
          </div>
        </div>

        <div className="mt-6 min-h-11">
          {errorMessage && (
            <div className="rounded-xl border border-red-300/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              {errorMessage}
            </div>
          )}
          {!errorMessage && successMessage && (
            <div className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
              {successMessage}
            </div>
          )}
        </div>

        <RegisterForm
          values={registerState.values}
          errors={registerState.errors}
          touched={registerState.touched}
          loading={loading}
          onChange={onRegisterChange}
          onBlur={onRegisterBlur}
          onSubmit={onRegisterSubmit}
        />

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold text-slate-300/80">o</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-4 flex justify-center">
            <GoogleButton disabled={loading} onCredential={onGoogleCredential} />
          </div>
        </div>

        <p className="mt-5 text-center text-sm font-semibold text-slate-300/90">
          ¿Ya tenés cuenta?{" "}
          <button
            type="button"
            disabled={loading}
            onClick={onSwitchToLogin}
            className="font-extrabold text-cyan-200 transition-colors hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </section>
  );
}

export default RegisterCard;
