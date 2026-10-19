import { getLocalStorage, setLocalStorage } from "./storage.js";
import { generarId, formateoMoneda } from "./helpers.js";

const formatoMoneda = formateoMoneda();

    // forreach para mostrar y find para buscar y editar


// obtengo la lista de veterinarios del localStorage ya comprobada
function getVeterinarios() {
     const listaVeterinarios = getLocalStorage('veterinarios')
     return Array.isArray(listaVeterinarios) ? listaVeterinarios : [];
        };


function agregarVeterinario(veterinario){
    const listaVeterinarios = getVeterinarios();
    listaVeterinarios.push(veterinario);
    setLocalStorage('veterinarios', listaVeterinarios);
}

function listarVeterinarios() {
    const listaVeterinarios = getVeterinarios();
    const tablaVeterinarios = document.getElementById('tabla-veterinarios');
    tablaVeterinarios.innerHTML = '';
    listaVeterinarios.forEach((veterinario) => {
        const row = tablaVeterinarios.insertRow();
        row.insertCell(0).textContent = veterinario.matricula;
        row.insertCell(1).textContent = veterinario.nombre;
        row.insertCell(2).textContent = veterinario.especializacion;
        row.insertCell(3).textContent = formatoMoneda.format(veterinario.valorConsulta);
    });

    }
// eventos disparados por el formulario de veterinarios

const formVeterinario = document.getElementById('form-veterinario');
    formVeterinario.addEventListener("submit", (event) => {
        event.preventDefault();
        const veterinario = {
            id: generarId(),
            matricula: Number(document.getElementById("matricula").value),
            nombre: document.getElementById("nombre").value,
            especializacion: document.getElementById("especializacion").value,
            valorConsulta: Number(document.getElementById("valorConsulta").value),
            };
        agregarVeterinario(veterinario);
        listarVeterinarios()
        formVeterinario.reset();
        alert('Veterinario agregado correctamente');
    });

    // al cargar la pag dispare la lista
    listarVeterinarios()

// Acciones para editar y eliminar veterinarios junto a los botones adicionales de la tabla

const campoIdVeterinario = document.getElementById("idVeterinario");
const tituloFormularioVeterinario = document.getElementById("form-titulo");
const botonGuardarVeterinario = document.getElementById("btn-guardar");
const botonCancelarEdicion = document.getElementById("btn-cancelar");
const totalVeterinarios = document.getElementById("total-registros");

function actualizarAccionesYTotal() {
    const veterinarios = getVeterinarios();
    const filas = document.getElementById("tabla-veterinarios").rows;
    totalVeterinarios.textContent = `Total: ${veterinarios.length}`;

    veterinarios.forEach((veterinario, indice) => {
        const celdaAcciones = filas[indice].insertCell(4);
        celdaAcciones.classList.add("text-center");

        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.className = "btn btn-sm p-1 border-0 bg-transparent me-2";
        botonEditar.style.color = "var(--color-secondary)";
        botonEditar.setAttribute("aria-label", "Editar veterinario");
        botonEditar.title = "Editar veterinario";
        const iconoEditar = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        iconoEditar.setAttribute("width", "16");
        iconoEditar.setAttribute("height", "16");
        iconoEditar.setAttribute("fill", "currentColor");
        iconoEditar.setAttribute("viewBox", "0 0 16 16");
        iconoEditar.setAttribute("aria-hidden", "true");
        const rutaIconoEditar = document.createElementNS("http://www.w3.org/2000/svg", "path");
        rutaIconoEditar.setAttribute(
            "d",
            "M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
        );
        iconoEditar.append(rutaIconoEditar);
        const segundaRutaIconoEditar = document.createElementNS("http://www.w3.org/2000/svg", "path");
        segundaRutaIconoEditar.setAttribute("fill-rule", "evenodd");
        segundaRutaIconoEditar.setAttribute(
            "d",
            "M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
        );
        iconoEditar.append(segundaRutaIconoEditar);
        botonEditar.append(iconoEditar);
        botonEditar.addEventListener("click", () => {
            campoIdVeterinario.value = veterinario.id;
            document.getElementById("matricula").value = veterinario.matricula;
            document.getElementById("nombre").value = veterinario.nombre;
            document.getElementById("especializacion").value = veterinario.especializacion;
            document.getElementById("valorConsulta").value = veterinario.valorConsulta;
            tituloFormularioVeterinario.textContent = "Editar Veterinario";
            botonGuardarVeterinario.textContent = "Guardar cambios";
            botonCancelarEdicion.classList.remove("d-none");
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-sm p-1 border-0 bg-transparent text-danger";
        botonEliminar.setAttribute("aria-label", "Eliminar veterinario");
        botonEliminar.title = "Eliminar veterinario";
        const iconoEliminar = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        iconoEliminar.setAttribute("width", "16");
        iconoEliminar.setAttribute("height", "16");
        iconoEliminar.setAttribute("fill", "currentColor");
        iconoEliminar.setAttribute("viewBox", "0 0 16 16");
        iconoEliminar.setAttribute("aria-hidden", "true");
        const rutasIconoEliminar = [
            "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z",
            "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z",
        ];
        rutasIconoEliminar.forEach((ruta) => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", ruta);
            iconoEliminar.append(path);
        });
        botonEliminar.append(iconoEliminar);
        botonEliminar.addEventListener("click", () => {
            if (!window.confirm(`¿Querés eliminar al veterinario ${veterinario.nombre}?`)) {
                return;
            }

            const listaActualizada = getVeterinarios().filter(
                (item) => item.id !== veterinario.id
            );
            setLocalStorage("veterinarios", listaActualizada);

            if (campoIdVeterinario.value === veterinario.id) {
                cancelarEdicionDeVeterinario();
            }

            listarVeterinarios();
            actualizarAccionesYTotal();
        });

        celdaAcciones.append(botonEditar, botonEliminar);
    });
}

function cancelarEdicionDeVeterinario() {
    formVeterinario.reset();
    campoIdVeterinario.value = "";
    tituloFormularioVeterinario.textContent = "Registrar Veterinario";
    botonGuardarVeterinario.textContent = "Guardar";
    botonCancelarEdicion.classList.add("d-none");
}

formVeterinario.addEventListener("submit", (event) => {
    if (!campoIdVeterinario.value) {
        return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    const veterinarioActualizado = {
        id: campoIdVeterinario.value,
        matricula: Number(document.getElementById("matricula").value),
        nombre: document.getElementById("nombre").value.trim(),
        especializacion: document.getElementById("especializacion").value.trim(),
        valorConsulta: Number(document.getElementById("valorConsulta").value),
    };
    const listaActualizada = getVeterinarios().map((veterinario) =>
        veterinario.id === veterinarioActualizado.id
            ? veterinarioActualizado
            : veterinario
    );

    setLocalStorage("veterinarios", listaActualizada);
    cancelarEdicionDeVeterinario();
    listarVeterinarios();
    actualizarAccionesYTotal();
}, true);

botonCancelarEdicion.addEventListener("click", cancelarEdicionDeVeterinario);
formVeterinario.addEventListener("submit", actualizarAccionesYTotal);
actualizarAccionesYTotal();
