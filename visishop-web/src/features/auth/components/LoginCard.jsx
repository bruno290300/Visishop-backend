import AppLogo from "../../../components/common/AppLogo";
import GoogleButton from "./GoogleButton";
import LoginForm from "./LoginForm";

function LoginCard({
  loading,
  errorMessage,
  successMessage,
  loginState,
  onLoginSubmit,
  onLoginChange,
  onLoginBlur,
  onSwitchToRegister,
  onGoogleSignIn,
}) {
  return (
    <section className="card-enter relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-400/25 blur-2xl" />
      <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-teal-300/20 blur-2xl" />

      <div className="relative z-10">
        <div className="flex flex-col items-center gap-3">
          <AppLogo size="md" className="mx-auto" />
          <h1 className="text-center text-3xl font-extrabold tracking-tight text-white">
            Bienvenido otra vez
          </h1>
          <p className="text-center text-sm font-medium text-slate-300/90">
            Iniciá sesión con tu usuario y contraseña.
          </p>
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

        <LoginForm
          values={loginState.values}
          errors={loginState.errors}
          touched={loginState.touched}
          loading={loading}
          onChange={onLoginChange}
          onBlur={onLoginBlur}
          onSubmit={onLoginSubmit}
        />

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold text-slate-300/80">o</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-4 flex justify-center">
            <GoogleButton loading={loading} onClick={onGoogleSignIn} label="Google" />
          </div>
        </div>

        <p className="mt-5 text-center text-sm font-semibold text-slate-300/90">
          ¿No tenés cuenta?{" "}
          <button
            type="button"
            disabled={loading}
            onClick={onSwitchToRegister}
            className="font-extrabold text-cyan-200 transition-colors hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </section>
  );
}

export default LoginCard;
