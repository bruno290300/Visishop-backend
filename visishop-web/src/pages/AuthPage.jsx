import { useMemo, useState } from "react";
import { AUTH_MODES } from "../features/auth/constants";
import LoginCard from "../features/auth/components/LoginCard";
import RegisterCard from "../features/auth/components/RegisterCard";
import useAuthForms from "../features/auth/hooks/useAuthForms";
import { validateLogin, validateRegister } from "../features/auth/validators";
import { useAuth } from "../store/AuthContext";

function AuthPage() {
  const [mode, setMode] = useState(AUTH_MODES.LOGIN);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { login, register, loginWithGoogleCredential } = useAuth();

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

  function readFormCredentials(formElement) {
    const formData = new FormData(formElement);
    return {
      name: String(formData.get("name") || ""),
      password: String(formData.get("password") || ""),
    };
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    clearFeedback();
    authForms.login.touchForm();

    const payload = readFormCredentials(event.currentTarget);
    const errors = validateLogin(payload);

    if (Object.keys(errors).length > 0) {
      setErrorMessage("Corregi los campos marcados para continuar.");
      return;
    }

    try {
      setLoading(true);
      const response = await login(payload);
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

    const payload = readFormCredentials(event.currentTarget);
    const errors = validateRegister(payload);

    if (Object.keys(errors).length > 0) {
      setErrorMessage("Revisa los datos para completar el registro.");
      return;
    }

    try {
      setLoading(true);
      const response = await register(payload);
      setSuccessMessage(`Cuenta creada para ${response.name}.`);
    } catch (error) {
      setErrorMessage(error.message || "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleCredential(credential) {
    clearFeedback();

    try {
      setLoading(true);
      const response = await loginWithGoogleCredential(credential);
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
          onGoogleCredential={handleGoogleCredential}
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
          onGoogleCredential={handleGoogleCredential}
        />
      )}
    </div>
  );
}

export default AuthPage;
