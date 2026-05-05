function GoogleIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.73 1.22 9.26 3.6l6.9-6.9C36.07 2.36 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.01 6.22C12.43 13.14 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.41 38.02 46.98 31.84 46.98 24.55z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-8.01-6.22C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.51 10.81l8.02-6.22z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-3.64-13.43-8.86l-8.01 6.22C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function GoogleButton({ loading, onClick, label = "Continuar con Google" }) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className={[
        "flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-extrabold text-white/90",
        "transition-colors hover:bg-white/10 active:bg-white/15",
        "disabled:cursor-not-allowed disabled:opacity-60",
      ].join(" ")}
    >
      <span className="grid place-items-center rounded-full bg-white p-1.5">
        <GoogleIcon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </button>
  );
}

export default GoogleButton;
