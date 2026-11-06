import { getTokenSessionStorage } from "./storage.js";

// Comprueba si el usuario tiene una sesion iniciada
export function haySesion() {
  const { accessToken } = getTokenSessionStorage();
  return Boolean(accessToken);
}

// Cierra la sesion activa eliminando el token de acceso
export function cerrarSesion(rutaLogin = "./login.html") {
  sessionStorage.removeItem("accessToken");
  window.location.href = rutaLogin;
}

// Protege una página de administración
export function protegerPagina(rutaLogin = "./login.html") {
  if (!haySesion()) {
    window.location.href = rutaLogin;
  }
}

