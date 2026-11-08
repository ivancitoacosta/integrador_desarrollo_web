import { generarId } from "./helpers.js";
import { getLocalStorage, setLocalStorage } from "./storage.js";
import { protegerPagina } from "./auth.js";

// Protección de Ruta de Administración
protegerPagina("./login.html");

const CLAVE_HISTORIAS = "historiasClinicas";
const CLAVE_MASCOTAS = "mascotas";

// --- Elementos del DOM ---
const form = document.getElementById("formHistoria");
const selectMascota = document.getElementById("selectMascota");
const fechaConsulta = document.getElementById("fechaConsulta");
const diagnostico = document.getElementById("diagnostico");
const tratamiento = document.getElementById("tratamiento");
const pesoControl = document.getElementById("pesoControl");
const tempControl = document.getElementById("tempControl");
const proximoControl = document.getElementById("proximoControl");

const filtroMascota = document.getElementById("filtroMascota");
const tbody = document.getElementById("tablaHistoriasBody");
const contador = document.getElementById("contadorHistorias");
const alertas = document.getElementById("alertaHistoria");

// --- Carga Inicial de Datos ---
let historias = leerHistorias();
let mascotas = leerMascotas();

function leerHistorias() {
try {
    const datos = getLocalStorage(CLAVE_HISTORIAS);
    return Array.isArray(datos) ? datos : [];
} catch (error) {
    return [];
}
}

function leerMascotas() {
try {
    const datos = getLocalStorage(CLAVE_MASCOTAS);
    return Array.isArray(datos) ? datos : [];
} catch (error) {
    return [];
}
}

function guardarHistorias() {
setLocalStorage(CLAVE_HISTORIAS, historias);
}

// --- Manejo de Alertas Bootstrap ---
let temporizadorAlerta;
function mostrarAlerta(mensaje, tipo) {
alertas.innerHTML = "";
const alerta = document.createElement("div");
alerta.className = `alert alert-${tipo} mb-0`;
alerta.setAttribute("role", "alert");
alerta.textContent = mensaje;
alertas.appendChild(alerta);

clearTimeout(temporizadorAlerta);
temporizadorAlerta = setTimeout(() => {
    alertas.innerHTML = "";
}, 3000);
}

// --- Llenar Selects de Mascotas (Vínculo por ID) ---
function cargarSelectsMascotas() {
  // Limpiar y resetear opciones base
selectMascota.innerHTML = '<option value="">Seleccionar mascota...</option>';
filtroMascota.innerHTML = '<option value="">-- Ver todas las mascotas --</option>';

if (mascotas.length === 0) {
    const op = document.createElement("option");
    op.disabled = true;
    op.textContent = "No hay mascotas registradas";
    selectMascota.appendChild(op);
    return;
}

mascotas.forEach((m) => {
    // Para el formulario de registro
    const opForm = document.createElement("option");
    opForm.value = m.id;
    opForm.textContent = `${m.nombre} (Dueño: ${m.duenio})`;
    selectMascota.appendChild(opForm);

    // Para el filtro de búsqueda
    const opFiltro = document.createElement("option");
    opFiltro.value = m.id;
    opFiltro.textContent = `${m.nombre} (Dueño: ${m.duenio})`;
    filtroMascota.appendChild(opFiltro);
});
}

// --- Renderizar Tabla con Manipulación DOM ---
function renderizar(filtroId = "") {
tbody.innerHTML = "";

const historiasFiltradas = filtroId
    ? historias.filter((h) => String(h.mascotaId) === String(filtroId))
    : historias;

if (historiasFiltradas.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 6;
    celda.className = "py-4 text-muted";
    celda.textContent = filtroId
    ? "Esta mascota no posee registros en su historia clínica."
    : "No hay registros médicos cargados.";
    fila.appendChild(celda);
    tbody.appendChild(fila);
    contador.textContent = "Total registros: 0";
    return;
}

historiasFiltradas.forEach((h) => {
    const mascota = mascotas.find((m) => String(m.id) === String(h.mascotaId));
    const nombreMascota = mascota ? mascota.nombre : "Mascota desconocida";

    const fila = document.createElement("tr");

    // Formateo de datos opcionales
    const pesoTempStr = `${h.peso ? h.peso + " kg" : "-"} / ${h.temperatura ? h.temperatura + " °C" : "-"}`;
    const proxControlStr = h.proximoControl || "-";

    [
    nombreMascota,
    h.fecha,
    h.diagnostico,
    h.tratamiento,
    pesoTempStr,
    proxControlStr,
    ].forEach((valor) => {
    const celda = document.createElement("td");
    celda.textContent = valor;
    fila.appendChild(celda);
    });

    tbody.appendChild(fila);
});

contador.textContent = "Total registros: " + historiasFiltradas.length;
}

// --- Guardar Nueva Historia Clínica ---
form.addEventListener("submit", (evento) => {
evento.preventDefault();

const nuevaEntrada = {
    id: generarId(),
    mascotaId: selectMascota.value,
    fecha: fechaConsulta.value,
    diagnostico: diagnostico.value.trim(),
    tratamiento: tratamiento.value.trim(),
    peso: pesoControl.value ? Number(pesoControl.value) : null,
    temperatura: tempControl.value ? Number(tempControl.value) : null,
    proximoControl: proximoControl.value || null,
};

if (!nuevaEntrada.mascotaId || !nuevaEntrada.fecha || !nuevaEntrada.diagnostico || !nuevaEntrada.tratamiento) {
    mostrarAlerta("Completá todos los campos obligatorios (*).", "warning");
    return;
}

historias.push(nuevaEntrada);
guardarHistorias();

mostrarAlerta("Registro de historia clínica guardado correctamente.", "success");
renderizar(filtroMascota.value);
limpiarFormulario();
});

// --- Evento de Filtrado ---
filtroMascota.addEventListener("change", (e) => {
renderizar(e.target.value);
});

function limpiarFormulario() {
form.reset();
  // Setear la fecha actual por defecto en el input de fecha
fechaConsulta.value = new Date().toISOString().split("T")[0];
}

// --- Inicialización ---
cargarSelectsMascotas();
limpiarFormulario();
renderizar();
