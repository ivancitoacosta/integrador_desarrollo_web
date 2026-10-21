// ===== mascotas.js =====
// BREAD de mascotas con LocalStorage (clave: "mascotas")
import { generarId } from "./helpers.js";
import { getLocalStorage, setLocalStorage } from "./storage.js";

const CLAVE = "mascotas";

// --- Elementos del HTML (IDs de mascotas.html) ---
const form = document.getElementById("formMascota");
const formTitulo = document.getElementById("formTitulo");
const idMascota = document.getElementById("idMascota");
const nombreMascota = document.getElementById("nombreMascota");
const nombreDuenio = document.getElementById("nombreDuenio");
const color = document.getElementById("colorMascota");
const edad = document.getElementById("edadMascota");
const peso = document.getElementById("pesoMascota");
const btnGuardar = document.getElementById("btnGuardarMascota");
const btnCancelar = document.getElementById("btnCancelarEdicion");
const tbody = document.getElementById("tablaMascotasBody");
const contador = document.getElementById("contadorMascotas");
const alertas = document.getElementById("alertaMascotas");

// --- Datos ---
let mascotas = leerMascotas();

function leerMascotas() {
  try {
    // const datos = JSON.parse(localStorage.getItem(CLAVE));
    const datos = getLocalStorage(CLAVE);
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
}

function guardarMascotas() {
  setLocalStorage(CLAVE, mascotas);
}

// --- Mensajes (alertas de Bootstrap) ---
let temporizadorAlerta;

function mostrarAlerta(mensaje, tipo) {
  alertas.innerHTML = "";

  const alerta = document.createElement("div");
  alerta.className = "alert alert-" + tipo + " mb-0";
  alerta.setAttribute("role", "alert");
  alerta.textContent = mensaje;
  alertas.appendChild(alerta);

  clearTimeout(temporizadorAlerta);
  temporizadorAlerta = setTimeout(() => {
    alertas.innerHTML = "";
  }, 3000);
}

// --- Listar: dibuja la tabla y actualiza el total ---
function renderizar() {
  tbody.innerHTML = "";

  if (mascotas.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 6;
    celda.className = "py-4 text-muted";
    celda.textContent = "No hay mascotas registradas actualmente.";
    fila.appendChild(celda);
    tbody.appendChild(fila);
  }

  mascotas.forEach((m) => {
    const fila = document.createElement("tr");

    [m.nombre, m.duenio, m.color, m.edad, m.peso + " kg"].forEach((valor) => {
      const celda = document.createElement("td");
      celda.textContent = valor;
      fila.appendChild(celda);
    });

    const celdaAcciones = document.createElement("td");

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.textContent = "Editar";
    btnEditar.className = "btn btn-sm btn-outline-primary me-2";
    btnEditar.addEventListener("click", () => editarMascota(m.id));

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn btn-sm btn-outline-danger";
    btnEliminar.addEventListener("click", () => eliminarMascota(m.id));

    celdaAcciones.appendChild(btnEditar);
    celdaAcciones.appendChild(btnEliminar);
    fila.appendChild(celdaAcciones);

    tbody.appendChild(fila);
  });

  contador.textContent = "Total de mascotas: " + mascotas.length;
}

// --- Agregar / Guardar edición ---
form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const datos = {
    nombre: nombreMascota.value.trim(),
    duenio: nombreDuenio.value.trim(),
    color: color.value.trim(),
    edad: Number(edad.value),
    peso: Number(peso.value),
  };

  if (
    !datos.nombre ||
    !datos.duenio ||
    !datos.color ||
    edad.value === "" ||
    peso.value === ""
  ) {
    mostrarAlerta("Completá todos los campos.", "warning");
    return;
  }

  if (idMascota.value) {
    // Editar: reemplaza los datos de la mascota con ese id
    const id = Number(idMascota.value);
    mascotas = mascotas.map((m) => (m.id === id ? { ...m, ...datos } : m));
    mostrarAlerta("Mascota actualizada correctamente.", "success");
  } else {
    // Agregar: id único usando la fecha/hora actual
    mascotas.push({ id: generarId(), ...datos });
    mostrarAlerta("Mascota agregada correctamente.", "success");
  }

  guardarMascotas();
  renderizar();
  limpiarFormulario();
});

// --- Editar: carga la mascota en el formulario ---
function editarMascota(id) {
  const m = mascotas.find((mascota) => mascota.id === id);
  if (!m) return;

  idMascota.value = m.id;
  nombreMascota.value = m.nombre;
  nombreDuenio.value = m.duenio;
  color.value = m.color;
  edad.value = m.edad;
  peso.value = m.peso;

  formTitulo.textContent = "Editar Mascota";
  btnGuardar.textContent = "Guardar cambios";
  btnCancelar.classList.remove("d-none");
  nombreMascota.focus();
}

// --- Eliminar (con confirmación) ---
function eliminarMascota(id) {
  const m = mascotas.find((mascota) => mascota.id === id);
  if (!m) return;

  if (confirm("¿Seguro que querés eliminar a " + m.nombre + "?")) {
    mascotas = mascotas.filter((mascota) => mascota.id !== id);
    guardarMascotas();
    renderizar();
    mostrarAlerta("Mascota eliminada.", "info");

    // Si justo estaba editando esa mascota, limpiar el formulario
    if (Number(idMascota.value) === id) {
      limpiarFormulario();
    }
  }
}

// --- Utilidades del formulario ---
function limpiarFormulario() {
  form.reset();
  idMascota.value = "";
  formTitulo.textContent = "Registrar Mascota";
  btnGuardar.textContent = "Guardar Mascota";
  btnCancelar.classList.add("d-none");
}

btnCancelar.addEventListener("click", limpiarFormulario);

// --- Al cargar la página ---
renderizar();
