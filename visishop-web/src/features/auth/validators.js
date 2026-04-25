export function validateLogin(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Ingresa tu usuario.";
  } else if (values.name.trim().length < 3) {
    errors.name = "Minimo 3 caracteres.";
  }

  if (!values.password.trim()) {
    errors.password = "Ingresa tu clave.";
  } else if (values.password.trim().length < 4) {
    errors.password = "Debe tener al menos 4 caracteres.";
  }

  return errors;
}

export function validateRegister(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Ingresa tu usuario.";
  } else if (values.name.trim().length < 3) {
    errors.name = "Debe tener al menos 3 caracteres.";
  }

  if (!values.password.trim()) {
    errors.password = "Ingresa una clave.";
  } else if (values.password.trim().length < 4) {
    errors.password = "Minimo 4 caracteres.";
  }

  return errors;
}
