/**
 * @param {*} key key del localStorage
 * @param {*} arr arreglo con los datos
 */
export function setLocalStorage(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

/**
 * Obtiene los datos del localStorage
 * @param {*} key key del localStorage
 */
export function getLocalStorage(key) {
  const data = JSON.parse(localStorage.getItem(key));
  return data;
}

/**
 * Almacena el token de acceso en la sesión
 * @param {*} accessToken token de acceso
 */
export function setTokenSessionStorage(accessToken) {
  sessionStorage.setItem('accessToken', accessToken);
}

/**
 * Obtiene el token de la sesión
 * @returns {*} token de acceso
 */
export function getTokenSessionStorage() {
  const accessToken = sessionStorage.getItem('accessToken');
  return { accessToken };
}
