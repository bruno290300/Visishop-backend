import { useMemo, useState } from "react";
import {
  INITIAL_LOGIN_VALUES,
  INITIAL_REGISTER_VALUES,
} from "../constants";
import { validateLogin, validateRegister } from "../validators";

function useAuthForms() {
  const [loginValues, setLoginValues] = useState(INITIAL_LOGIN_VALUES);
  const [registerValues, setRegisterValues] = useState(INITIAL_REGISTER_VALUES);
  const [loginTouched, setLoginTouched] = useState({});
  const [registerTouched, setRegisterTouched] = useState({});

  const loginErrors = useMemo(() => validateLogin(loginValues), [loginValues]);
  const registerErrors = useMemo(
    () => validateRegister(registerValues),
    [registerValues]
  );

  function onLoginChange(event) {
    const { name, value } = event.target;
    setLoginValues((prev) => ({ ...prev, [name]: value }));
  }

  function onRegisterChange(event) {
    const { name, value } = event.target;
    setRegisterValues((prev) => ({ ...prev, [name]: value }));
  }

  function onLoginBlur(event) {
    const { name } = event.target;
    setLoginTouched((prev) => ({ ...prev, [name]: true }));
  }

  function onRegisterBlur(event) {
    const { name } = event.target;
    setRegisterTouched((prev) => ({ ...prev, [name]: true }));
  }

  function touchLoginForm() {
    setLoginTouched({
      name: true,
      password: true,
    });
  }

  function touchRegisterForm() {
    setRegisterTouched({
      name: true,
      password: true,
    });
  }

  return {
    login: {
      values: loginValues,
      errors: loginErrors,
      touched: loginTouched,
      onChange: onLoginChange,
      onBlur: onLoginBlur,
      touchForm: touchLoginForm,
      isValid: Object.keys(loginErrors).length === 0,
    },
    register: {
      values: registerValues,
      errors: registerErrors,
      touched: registerTouched,
      onChange: onRegisterChange,
      onBlur: onRegisterBlur,
      touchForm: touchRegisterForm,
      isValid: Object.keys(registerErrors).length === 0,
    },
  };
}

export default useAuthForms;
