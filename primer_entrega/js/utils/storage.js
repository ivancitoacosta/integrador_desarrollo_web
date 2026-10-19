/**
 * @param {*} key  - key del localStorage
 * @param {*} arr  - arreglo con los datos
 */
export function setLocalStorage(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

/**
 * @param {*} key  - key del localStorage
 */
export function getLocalStorage(key) {
  const data = JSON.parse(localStorage.getItem(key));
  return data;
}
