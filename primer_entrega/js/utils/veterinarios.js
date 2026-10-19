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
