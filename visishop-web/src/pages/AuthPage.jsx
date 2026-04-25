import { useMemo, useState } from "react";
import AuthCard from "../features/auth/components/AuthCard";
import { AUTH_MODES } from "../features/auth/constants";
import useAuthForms from "../features/auth/hooks/useAuthForms";
import { useAuth } from "../store/AuthContext";

function AuthPage() {
  const [mode, setMode] = useState(AUTH_MODES.LOGIN);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { login, register } = useAuth();

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
      setErrorMessage("Corrige los campos marcados para continuar.");
      return;
    }

    try {
      setLoading(true);
      const response = await login(authForms.login.values);
      setSuccessMessage(`Hola ${response.name}, ingreso exitoso.`);
    } catch (error) {
      setErrorMessage(error.message || "Ocurrio un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    clearFeedback();
    authForms.register.touchForm();

    if (!authForms.register.isValid) {
      setErrorMessage("Revisa los datos para completar el registro.");
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

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <AuthCard
        mode={mode}
        onModeChange={handleModeChange}
        loading={loading}
        errorMessage={errorMessage}
        successMessage={successMessage}
        loginState={loginState}
        registerState={registerState}
        onLoginSubmit={handleLoginSubmit}
        onRegisterSubmit={handleRegisterSubmit}
        onLoginChange={authForms.login.onChange}
        onRegisterChange={authForms.register.onChange}
        onLoginBlur={authForms.login.onBlur}
        onRegisterBlur={authForms.register.onBlur}
      />
    </div>
  );
}

export default AuthPage;
