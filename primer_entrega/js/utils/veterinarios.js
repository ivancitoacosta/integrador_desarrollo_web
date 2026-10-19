import { getLocalStorage, setLocalStorage } from "./storage.js";
import { generarId } from "./helpers.js";

const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
});

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

// Acciones para editar y eliminar veterinarios Revisar esto ->>>

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
        botonEditar.className = "btn btn-sm btn-primary me-2";
        botonEditar.textContent = "Editar";
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
        botonEliminar.className = "btn btn-sm btn-danger";
        botonEliminar.textContent = "Eliminar";
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
