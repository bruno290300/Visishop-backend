import { AUTH_MODES } from "../constants";

function AuthToggle({ mode, onChange, disabled }) {
  return (
    <div className="relative grid grid-cols-2 rounded-2xl border border-white/20 bg-white/10 p-1 backdrop-blur-md">
      <span
        className={[
          "absolute top-1 bottom-1 z-0 w-[calc(50%-0.25rem)] rounded-xl bg-white text-slate-900",
          "transition-transform duration-300 ease-out",
          mode === AUTH_MODES.LOGIN ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(AUTH_MODES.LOGIN)}
        className={[
          "relative z-10 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-300",
          mode === AUTH_MODES.LOGIN ? "text-slate-900" : "text-slate-100",
        ].join(" ")}
      >
        Login
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(AUTH_MODES.REGISTER)}
        className={[
          "relative z-10 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-300",
          mode === AUTH_MODES.REGISTER ? "text-slate-900" : "text-slate-100",
        ].join(" ")}
      >
        Register
      </button>
    </div>
  );
}

export default AuthToggle;
