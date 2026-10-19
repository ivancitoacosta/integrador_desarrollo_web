// import { generarId } from "./helpers.js";

// ==== CODIGO ====

/**
 *
 * @param {*} key  - key del localStorage
 * @param {*} arr  - arreglo con los datos
 */
export function setLocalStorage(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

/**
 *
 * @param {*} key  - key del localStorage
 */
export function getLocalStorage(key) {
  const data = JSON.parse(localStorage.getItem(key));
  return data;
}
// ==== CODIGO ====


/* TEST
const mascotaNueva = {
  id: generarId(),
  duenio: "Messi",
  nombre: "Perro1",
  color: "Negro",
  edad: 2,
  peso: 30,
};
const mascotaNueva2 = {
  id: generarId(),
  duenio: "Scaloni",
  nombre: "Perro2",
  color: "Blanco",
  edad: 2,
  peso: 30,
};

const veterinarioNueva = {
  id: generarId(),
  matricula: 12345,
  nombre: "Veterinaria de prueba",
  especializacion: "Clínica",
  valorConsulta: 15000,
};
const veterinarioNueva2 = {
  id: generarId(),
  matricula: 67890,
  nombre: "Veterinario de prueba",
  especializacion: "Cirugía",
  valorConsulta: 20000,
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
TEST */
