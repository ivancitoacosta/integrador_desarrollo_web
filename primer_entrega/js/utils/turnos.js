// ===== turnos.js =====
// Turnos: registrar, listar (con filtros) y eliminar, más comprobante imprimible.
// Además permite registrar una mascota o un veterinario nuevo sin salir de la página.
// Se guarda en LocalStorage con la clave "turnos".
// Cada turno: { id, fechaHora, mascota, veterinario }
//   - mascota y veterinario guardan el ID de la entidad relacionada.

import { getLocalStorage, setLocalStorage } from "./storage.js";
import { formateoMoneda, formateoFechaHora, generarId } from "./helpers.js";

const CLAVE_TURNOS = "turnos";

// Clave donde el login del administrador guarda la sesión.
// IMPORTANTE: tiene que coincidir con la que use quien haga el inicio de sesión.
const CLAVE_SESION = "accessToken";

// --- Formatos ---
const formatoMoneda = formateoMoneda()

const formatoFechaHora = formateoFechaHora()

// const formatoFechaHora = new Intl.DateTimeFormat("es-AR", {
//     dateStyle: "medium",
//     timeStyle: "short",
// });

// --- Elementos del HTML (IDs de turnos.html) ---
const avisoSesion = document.getElementById("avisoSesion");
const panelTurnos = document.getElementById("panelTurnos");
const avisoDatos = document.getElementById("avisoDatos");
const alertas = document.getElementById("alertaTurnos");

const form = document.getElementById("formTurno");
const selectMascota = document.getElementById("turnoMascota");
const selectVeterinario = document.getElementById("turnoVeterinario");
const inputFecha = document.getElementById("turnoFecha");
const inputHora = document.getElementById("turnoHora");
const inputValor = document.getElementById("turnoValor");

const filtroVeterinario = document.getElementById("filtroVeterinario");
const filtroFecha = document.getElementById("filtroFecha");
const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");

const tbody = document.getElementById("tablaTurnosBody");
const total = document.getElementById("totalTurnos");

const modalComprobante = document.getElementById("modalComprobante");
const comprobanteDatos = document.getElementById("comprobanteDatos");
const comprobanteEmision = document.getElementById("comprobanteEmision");
const btnImprimir = document.getElementById("btnImprimir");

// Registro rápido de mascota
const modalMascota = document.getElementById("modalMascota");
const formMascotaRapida = document.getElementById("formMascotaRapida");
const rapidaMascotaNombre = document.getElementById("rapidaMascotaNombre");
const rapidaMascotaDuenio = document.getElementById("rapidaMascotaDuenio");
const rapidaMascotaColor = document.getElementById("rapidaMascotaColor");
const rapidaMascotaEdad = document.getElementById("rapidaMascotaEdad");
const rapidaMascotaPeso = document.getElementById("rapidaMascotaPeso");

// Registro rápido de veterinario
const modalVeterinario = document.getElementById("modalVeterinario");
const formVeterinarioRapido = document.getElementById("formVeterinarioRapido");
const rapidaVetMatricula = document.getElementById("rapidaVetMatricula");
const rapidaVetNombre = document.getElementById("rapidaVetNombre");
const rapidaVetEspecializacion = document.getElementById("rapidaVetEspecializacion");
const rapidaVetValor = document.getElementById("rapidaVetValor");

// --- Datos ---
let turnos = leerLista(CLAVE_TURNOS);
let mascotas = leerLista("mascotas");
let veterinarios = leerLista("veterinarios");

function leerLista(clave) {
    try {
        const datos = getLocalStorage(clave);
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

function guardarTurnos() {
    setLocalStorage(CLAVE_TURNOS, turnos);
}

// Busca un registro por id (se compara como texto porque los ids
// de mascotas y veterinarios pueden venir como número o como string)
function buscarPorId(lista, id) {
    return lista.find((item) => String(item.id) === String(id));
}

// --- Sesión del administrador ---
function haySesion() {
    return (
        sessionStorage.getItem(CLAVE_SESION) !== null ||
        localStorage.getItem(CLAVE_SESION) !== null
    );
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

// --- Selects (mascotas y veterinarios existentes) ---
function crearOpcion(texto, valor) {
    const opcion = document.createElement("option");
    opcion.value = valor;
    opcion.textContent = texto;
    return opcion;
}

function cargarSelects() {
    // Se recuerda lo que estaba elegido para no perderlo al volver a dibujar las listas
    const mascotaElegida = selectMascota.value;
    const veterinarioElegido = selectVeterinario.value;
    const filtroElegido = filtroVeterinario.value;

    selectMascota.innerHTML = "";
    selectMascota.appendChild(crearOpcion("Seleccioná una mascota", ""));
    mascotas.forEach((m) => {
        selectMascota.appendChild(crearOpcion(m.nombre + " (" + m.duenio + ")", String(m.id)));
    });

    selectVeterinario.innerHTML = "";
    selectVeterinario.appendChild(crearOpcion("Seleccioná un veterinario", ""));
    filtroVeterinario.innerHTML = "";
    filtroVeterinario.appendChild(crearOpcion("Todos los veterinarios", ""));
    veterinarios.forEach((v) => {
        selectVeterinario.appendChild(
            crearOpcion(v.nombre + " - " + v.especializacion, String(v.id))
        );
        filtroVeterinario.appendChild(crearOpcion(v.nombre, String(v.id)));
    });

    selectMascota.value = mascotaElegida;
    selectVeterinario.value = veterinarioElegido;
    filtroVeterinario.value = filtroElegido;

    // Si todavía no hay mascotas o veterinarios, se muestra una pista
    const faltanDatos = mascotas.length === 0 || veterinarios.length === 0;
    avisoDatos.classList.toggle("d-none", !faltanDatos);
}

// El costo del turno es el valor de consulta del veterinario elegido
function actualizarValor() {
    const v = buscarPorId(veterinarios, selectVeterinario.value);
    inputValor.value = v ? formatoMoneda.format(v.valorConsulta) : "—";
}

// Fecha de hoy en formato AAAA-MM-DD (para no permitir fechas pasadas)
function fechaDeHoy() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return hoy.getFullYear() + "-" + mes + "-" + dia;
}

// --- Listar: dibuja la tabla (aplicando filtros) y actualiza el total ---
function renderizar() {
    const idVeterinario = filtroVeterinario.value;
    const dia = filtroFecha.value;
    const hayFiltro = Boolean(idVeterinario || dia);

    const visibles = turnos
        .filter((t) => !idVeterinario || String(t.veterinario) === idVeterinario)
        .filter((t) => !dia || t.fechaHora.startsWith(dia))
        .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora));

    tbody.innerHTML = "";

    if (visibles.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");
        celda.colSpan = 5;
        celda.className = "py-4 text-muted";
        celda.textContent = hayFiltro
            ? "No hay turnos que coincidan con los filtros."
            : "No hay turnos registrados actualmente.";
        fila.appendChild(celda);
        tbody.appendChild(fila);
    }

    visibles.forEach((t) => {
        const m = buscarPorId(mascotas, t.mascota);
        const v = buscarPorId(veterinarios, t.veterinario);

        const fila = document.createElement("tr");

        [
            formatoFechaHora.format(new Date(t.fechaHora)),
            m ? m.nombre + " (" + m.duenio + ")" : "Mascota eliminada",
            v ? v.nombre : "Veterinario eliminado",
            v ? formatoMoneda.format(v.valorConsulta) : "-",
        ].forEach((valor) => {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        const celdaAcciones = document.createElement("td");

        const btnComprobante = document.createElement("button");
        btnComprobante.type = "button";
        btnComprobante.textContent = "Comprobante";
        btnComprobante.className = "btn btn-sm btn-outline-primary me-2";
        btnComprobante.disabled = !m || !v;
        btnComprobante.addEventListener("click", () => mostrarComprobante(t));

        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn btn-sm btn-outline-danger";
        btnEliminar.addEventListener("click", () => eliminarTurno(t.id));

        celdaAcciones.appendChild(btnComprobante);
        celdaAcciones.appendChild(btnEliminar);
        fila.appendChild(celdaAcciones);

        tbody.appendChild(fila);
    });

    total.textContent = hayFiltro
        ? "Mostrando " + visibles.length + " de " + turnos.length
        : "Total: " + turnos.length;
}

// --- Registrar ---
function registrarTurno(evento) {
    evento.preventDefault();

    const idMascota = selectMascota.value;
    const idVeterinario = selectVeterinario.value;
    const fecha = inputFecha.value;
    const hora = inputHora.value;

    if (!idMascota || !idVeterinario || !fecha || !hora) {
        mostrarAlerta("Completá todos los campos.", "warning");
        return;
    }

    // fechaHora con formato AAAA-MM-DDTHH:MM
    const fechaHora = fecha + "T" + hora;

    if (new Date(fechaHora) <= new Date()) {
        mostrarAlerta("La fecha y hora del turno tienen que ser futuras.", "warning");
        return;
    }

    const ocupado = turnos.some(
        (t) => String(t.veterinario) === idVeterinario && t.fechaHora === fechaHora
    );
    if (ocupado) {
        mostrarAlerta("Ese veterinario ya tiene un turno en ese día y horario.", "danger");
        return;
    }

    turnos.push({
        id: generarId(),
        fechaHora: fechaHora,
        mascota: idMascota,
        veterinario: idVeterinario,
    });

    guardarTurnos();
    renderizar();
    form.reset();
    actualizarValor();
    mostrarAlerta("Turno agendado correctamente.", "success");
}

// --- Eliminar (con confirmación) ---
function eliminarTurno(id) {
    const t = turnos.find((turno) => turno.id === id);
    if (!t) return;

    const m = buscarPorId(mascotas, t.mascota);
    const v = buscarPorId(veterinarios, t.veterinario);
    const detalle =
        (m ? m.nombre : "la mascota") +
        " con " +
        (v ? v.nombre : "el veterinario") +
        " el " +
        formatoFechaHora.format(new Date(t.fechaHora));

    if (confirm("¿Seguro que querés eliminar el turno de " + detalle + "?")) {
        turnos = turnos.filter((turno) => turno.id !== id);
        guardarTurnos();
        renderizar();
        mostrarAlerta("Turno eliminado.", "info");
    }
}

// --- Registro rápido de mascota (se guarda en la lista "mascotas") ---
function registrarMascotaRapida(evento) {
    evento.preventDefault();

    // Se vuelve a leer por si la lista cambió desde otra pestaña
    mascotas = leerLista("mascotas");

    const nueva = {
        id: generarId(),
        nombre: rapidaMascotaNombre.value.trim(),
        duenio: rapidaMascotaDuenio.value.trim(),
        color: rapidaMascotaColor.value.trim(),
        edad: Number(rapidaMascotaEdad.value),
        peso: Number(rapidaMascotaPeso.value),
    };

    mascotas.push(nueva);
    setLocalStorage("mascotas", mascotas);

    cargarSelects();
    selectMascota.value = String(nueva.id);

    formMascotaRapida.reset();
    window.bootstrap.Modal.getOrCreateInstance(modalMascota).hide();
    mostrarAlerta("Mascota registrada y seleccionada.", "success");
}

// --- Registro rápido de veterinario (se guarda en la lista "veterinarios") ---
function registrarVeterinarioRapido(evento) {
    evento.preventDefault();

    veterinarios = leerLista("veterinarios");

    const nuevo = {
        id: generarId(),
        matricula: Number(rapidaVetMatricula.value),
        nombre: rapidaVetNombre.value.trim(),
        especializacion: rapidaVetEspecializacion.value.trim(),
        valorConsulta: Number(rapidaVetValor.value),
    };

    veterinarios.push(nuevo);
    setLocalStorage("veterinarios", veterinarios);

    cargarSelects();
    selectVeterinario.value = String(nuevo.id);
    actualizarValor();

    formVeterinarioRapido.reset();
    window.bootstrap.Modal.getOrCreateInstance(modalVeterinario).hide();
    mostrarAlerta("Veterinario registrado y seleccionado.", "success");
}

// --- Comprobante imprimible (también sirve para guardar como PDF) ---
function crearFilaDato(etiqueta, valor) {
    const fila = document.createElement("div");
    fila.className = "d-flex justify-content-between gap-3 border-bottom py-2";

    const spanEtiqueta = document.createElement("span");
    spanEtiqueta.className = "fw-semibold";
    spanEtiqueta.textContent = etiqueta;

    const spanValor = document.createElement("span");
    spanValor.className = "text-end";
    spanValor.textContent = valor;

    fila.appendChild(spanEtiqueta);
    fila.appendChild(spanValor);
    return fila;
}

function mostrarComprobante(turno) {
    const m = buscarPorId(mascotas, turno.mascota);
    const v = buscarPorId(veterinarios, turno.veterinario);
    if (!m || !v) return;

    comprobanteDatos.innerHTML = "";
    [
        ["N° de turno", String(turno.id).slice(0, 8).toUpperCase()],
        ["Fecha y hora", formatoFechaHora.format(new Date(turno.fechaHora))],
        ["Mascota", m.nombre],
        ["Dueño", m.duenio],
        ["Veterinario", v.nombre + " (Mat. " + v.matricula + ")"],
        ["Especialización", v.especializacion],
        ["Valor de la consulta", formatoMoneda.format(v.valorConsulta)],
    ].forEach(([etiqueta, valor]) => {
        comprobanteDatos.appendChild(crearFilaDato(etiqueta, valor));
    });

    comprobanteEmision.textContent = "Emitido el " + formatoFechaHora.format(new Date());

    window.bootstrap.Modal.getOrCreateInstance(modalComprobante).show();
}

// --- Arranque ---
function iniciar() {
    cargarSelects();
    inputFecha.min = fechaDeHoy();
    actualizarValor();
    renderizar();

    form.addEventListener("submit", registrarTurno);
    selectVeterinario.addEventListener("change", actualizarValor);
    filtroVeterinario.addEventListener("change", renderizar);
    filtroFecha.addEventListener("change", renderizar);
    btnLimpiarFiltros.addEventListener("click", () => {
        filtroVeterinario.value = "";
        filtroFecha.value = "";
        renderizar();
    });
    btnImprimir.addEventListener("click", () => window.print());
    formMascotaRapida.addEventListener("submit", registrarMascotaRapida);
    formVeterinarioRapido.addEventListener("submit", registrarVeterinarioRapido);
}

// Solo un administrador con sesión puede gestionar los turnos
if (haySesion()) {
    iniciar();
} else {
    avisoSesion.classList.remove("d-none");
    panelTurnos.classList.add("d-none");
}
