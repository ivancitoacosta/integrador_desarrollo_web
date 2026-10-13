// ==== CODIGO ====

/**
 *
 * @param {*} key  - key del localStorage
 * @param {*} arr  - arreglo con los datos
 */
function setLocalStorage(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

/**
 *
 * @param {*} key  - key del localStorage
 */
function getLocalStorage(key) {
  const data = JSON.parse(localStorage.getItem(key));
  return data;
}
// ==== CODIGO ====

// TEST
const mascotaNueva = {
  id: crypto.randomUUID(),
  duenio: "Messi",
  nombre: "Perro1",
  color: "Negro",
  edad: 2,
  peso: 30,
};
const mascotaNueva2 = {
  id: crypto.randomUUID(),
  duenio: "Scaloni",
  nombre: "Perro2",
  color: "Blanco",
  edad: 2,
  peso: 30,
};

const veterinarioNueva = {
  id: crypto.randomUUID(),
  duenio: "Aimar",
  nombre: "Veterinario1",
  color: "Negro",
  edad: 2,
  peso: 30,
};
const veterinarioNueva2 = {
  id: crypto.randomUUID(),
  duenio: "Samuel",
  nombre: "Veterinario2",
  color: "Blanco",
  edad: 2,
  peso: 30,
};
// CASO DE USO

// mascotas.js
const arrMascotas = [];
arrMascotas.push(mascotaNueva);
arrMascotas.push(mascotaNueva2);

const dataMascotas = getLocalStorage("mascotas");

setLocalStorage("mascotas", arrMascotas);

console.log(dataMascotas);
dataMascotas.forEach((e) => {
  console.log({ data: e });
});

// Veterinarios.js

const arrVeterinarios = [];
arrVeterinarios.push(veterinarioNueva);
arrVeterinarios.push(veterinarioNueva2);

const dataVeterinarios = getLocalStorage("veterinarios");
setLocalStorage("veterinarios", arrVeterinarios);

console.log(dataVeterinarios);
dataVeterinarios.forEach((e) => {
  console.log({ data: e });
});
//TEST
