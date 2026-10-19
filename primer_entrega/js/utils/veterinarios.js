import { getLocalStorage, setLocalStorage } from "./storage.js";
import { generarId } from "./helpers.js";

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
        formVeterinario.reset();
        alert('Veterinario agregado correctamente');
    });
