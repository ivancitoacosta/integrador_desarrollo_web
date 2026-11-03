import { setTokenSessionStorage } from "./storage";
import { fetchLogin } from "./api";

const form = document.getElementById("formLogin");

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
export async function login(data) {

  // Desestructuramos los tokens de la respuesta
  const { accessToken, refreshToken } = await fetchLogin(data)

  console.log(accessToken, refreshToken);


  // Guardamos credenciales en sessionStorage
  setTokenSessionStorage(accessToken, refreshToken)
}
