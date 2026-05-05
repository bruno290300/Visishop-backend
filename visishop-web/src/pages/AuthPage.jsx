import { useMemo, useState } from "react";
import { AUTH_MODES } from "../features/auth/constants";
import LoginCard from "../features/auth/components/LoginCard";
import RegisterCard from "../features/auth/components/RegisterCard";
import useAuthForms from "../features/auth/hooks/useAuthForms";
import { useAuth } from "../store/AuthContext";

function AuthPage() {
  const [mode, setMode] = useState(AUTH_MODES.LOGIN);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { login, register, loginWithGoogle } = useAuth();

  const authForms = useAuthForms();

  const loginState = useMemo(
    () => ({
      values: authForms.login.values,
      errors: authForms.login.errors,
      touched: authForms.login.touched,
    }),
    [authForms.login]
  );

  const registerState = useMemo(
    () => ({
      values: authForms.register.values,
      errors: authForms.register.errors,
      touched: authForms.register.touched,
    }),
    [authForms.register]
  );

  function clearFeedback() {
    setErrorMessage("");
    setSuccessMessage("");
  }

  function handleModeChange(nextMode) {
    if (loading || nextMode === mode) return;
    clearFeedback();
    setMode(nextMode);
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    clearFeedback();
    authForms.login.touchForm();

    if (!authForms.login.isValid) {
      setErrorMessage("Corregí los campos marcados para continuar.");
      return;
    }

    try {
      setLoading(true);
      const response = await login(authForms.login.values);
      setSuccessMessage(`Hola ${response.name}, ingreso exitoso.`);
    } catch (error) {
      setErrorMessage(error.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    clearFeedback();
    authForms.register.touchForm();

    if (!authForms.register.isValid) {
      setErrorMessage("Revisá los datos para completar el registro.");
      return;
    }

    try {
      setLoading(true);
      const response = await register(authForms.register.values);
      setSuccessMessage(`Cuenta creada para ${response.name}.`);
    } catch (error) {
      setErrorMessage(error.message || "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    clearFeedback();

    const identifier =
      mode === AUTH_MODES.LOGIN
        ? authForms.login.values.name
        : authForms.register.values.name;

    try {
      setLoading(true);
      const response = await loginWithGoogle({ name: identifier });
      setSuccessMessage(`Hola ${response.name}, ingreso exitoso.`);
    } catch (error) {
      setErrorMessage(error.message || "No se pudo completar el ingreso con Google.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      {mode === AUTH_MODES.LOGIN ? (
        <LoginCard
          loading={loading}
          errorMessage={errorMessage}
          successMessage={successMessage}
          loginState={loginState}
          onLoginSubmit={handleLoginSubmit}
          onLoginChange={authForms.login.onChange}
          onLoginBlur={authForms.login.onBlur}
          onSwitchToRegister={() => handleModeChange(AUTH_MODES.REGISTER)}
          onGoogleSignIn={handleGoogleSignIn}
        />
      ) : (
        <RegisterCard
          loading={loading}
          errorMessage={errorMessage}
          successMessage={successMessage}
          registerState={registerState}
          onRegisterSubmit={handleRegisterSubmit}
          onRegisterChange={authForms.register.onChange}
          onRegisterBlur={authForms.register.onBlur}
          onSwitchToLogin={() => handleModeChange(AUTH_MODES.LOGIN)}
          onGoogleSignIn={handleGoogleSignIn}
        />
      )}
    </div>
  );
}

export default AuthPage;
