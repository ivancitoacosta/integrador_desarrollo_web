import { getTokenSessionStorage } from "./storage.js";

// Comprueba si el usuario tiene una sesion iniciada
export function haySesion() {
  const { accessToken } = getTokenSessionStorage();
  return Boolean(accessToken);
}

// Cierra la sesion, eliminando el token  y redirige al home
export function cerrarSesion(rutaHome = "./index.html") {
  sessionStorage.removeItem("accessToken");
  window.location.href = rutaHome;
}

// Protege una página de administración
export function protegerPagina(rutaLogin = "./login.html") {
  if (!haySesion()) {
    window.location.href = rutaLogin;
  }
}

