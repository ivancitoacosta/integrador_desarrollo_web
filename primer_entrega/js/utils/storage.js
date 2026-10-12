function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
  console.log(JSON.parse(localStorage.getItem(key)));
}

// TEST
// setLocalStorage(1, { escuela: "UNNER" });
// setLocalStorage(2, { edad: 22, nombre: "Marcelo", trabajo: "Programador" });

// getLocalStorage(2);
// getLocalStorage(1);
