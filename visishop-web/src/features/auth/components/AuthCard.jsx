import { AUTH_MODES } from "../constants";
import AppLogo from "../../../components/common/AppLogo";
import AuthToggle from "./AuthToggle";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function AuthCard({
  mode,
  onModeChange,
  loading,
  errorMessage,
  successMessage,
  loginState,
  registerState,
  onLoginSubmit,
  onRegisterSubmit,
  onLoginChange,
  onRegisterChange,
  onLoginBlur,
  onRegisterBlur,
}) {
  return (
    <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-slate-950/60 p-5 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-7">
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-400/25 blur-2xl" />
      <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-teal-300/20 blur-2xl" />

      <div className="relative z-10">
        <AppLogo size="md" className="mb-2 mx-auto" />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          {mode === AUTH_MODES.LOGIN ? "Bienvenido otra vez" : "Crea tu cuenta"}
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          {mode === AUTH_MODES.LOGIN
            ? "Inicia sesión con tu usuario y contraseña."
            : "Registra un usuario y contraseña para empezar."}
        </p>

        <div className="mt-5">
          <AuthToggle mode={mode} onChange={onModeChange} disabled={loading} />
        </div>

        <div className="mt-4 min-h-11">
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

        <div className="relative overflow-hidden">
          <div
            className={[
              "grid grid-cols-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              mode === AUTH_MODES.LOGIN ? "translate-x-0" : "-translate-x-1/2",
            ].join(" ")}
          >
            <div className="pr-2">
              <LoginForm
                values={loginState.values}
                errors={loginState.errors}
                touched={loginState.touched}
                loading={loading}
                onChange={onLoginChange}
                onBlur={onLoginBlur}
                onSubmit={onLoginSubmit}
              />
            </div>
            <div className="pl-2">
              <RegisterForm
                values={registerState.values}
                errors={registerState.errors}
                touched={registerState.touched}
                loading={loading}
                onChange={onRegisterChange}
                onBlur={onRegisterBlur}
                onSubmit={onRegisterSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthCard;
