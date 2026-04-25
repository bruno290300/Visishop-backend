function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginMock(payload) {
  await wait(1200);

  const email = payload.email.trim().toLowerCase();
  const password = payload.password.trim();

  if (email === "error@visishop.com" || password === "fail1234") {
    throw new Error("No pudimos iniciar sesion. Verifica tus datos.");
  }

  return {
    user: {
      id: "usr_001",
      name: "Usuario Demo",
      email,
    },
    token: "mock-token-login",
  };
}

export async function registerMock(payload) {
  await wait(1400);

  const email = payload.email.trim().toLowerCase();

  if (email === "taken@visishop.com") {
    throw new Error("Ese correo ya esta registrado.");
  }

  return {
    user: {
      id: "usr_002",
      name: payload.fullName.trim(),
      email,
    },
    token: "mock-token-register",
  };
}
