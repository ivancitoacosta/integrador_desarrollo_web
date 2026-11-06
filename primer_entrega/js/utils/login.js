import { setTokenSessionStorage } from "./storage.js";
import { fetchLogin } from "./api.js";
import { haySesion } from "./auth.js";

// Si el usuario ya está autenticado no necesita volver a loguearse
if (haySesion()) {
  window.location.href = "./mascotas.html";
}

const form = document.getElementById("formLogin");
const errorMessage = document.getElementById("errorMessage");


form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Traemos los datos del formulario
  const formData = new FormData(form);

  // Los pasamos a objeto
  const data = Object.fromEntries(formData);

  login(data)
});


/**
 *  @param {Object} data - Los datos del formulario de login.
 *  @param {string} data.username - El nombre de usuario.
 *  @param {string} data.password - La contraseña.
 */
async function login(data) {

  // Desestructuramos el token de la respuesta
  const { accessToken } = await fetchLogin(data)

  // Si no hay accessToken, mostramos un mensaje de error
  if (!accessToken) {
    errorMessage.textContent = "Credenciales inválidas";
    return;
  }

  // Guardamos credenciales en sessionStorage
  setTokenSessionStorage(accessToken)

  // Redirigimos al usuario a la página principal
  window.location.href = "./mascotas.html";

  // Limpiamos el mensaje de error
  errorMessage.textContent = "";

  return
}

// Función para cerrar sesión
function logOut() {
  sessionStorage.clear();

  window.location.href = './login.html';

  return
}
