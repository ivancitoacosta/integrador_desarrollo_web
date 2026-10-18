function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
  const data = JSON.parse(localStorage.getItem(key));
  console.log(data);
  return data;
}


// TEST
// setLocalStorage(1, { escuela: "UNNER" });
// setLocalStorage(2, { edad: 22, nombre: "Marcelo", trabajo: "Programador" });

// getLocalStorage(2);
// getLocalStorage(1);

// // TEST: Mascotas de prueba
// setLocalStorage("mascotas", [
//   {
//     id: "1",
//     nombreMascota: "Milo",
//     nombreDuenio: "Laura Gómez",
//     color: "Marrón",
//     edad: 3,
//     peso: 8.5
//   }
// ]);
// getLocalStorage("mascotas, 2");
