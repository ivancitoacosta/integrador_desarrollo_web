// Función para buscar un veterinario por su ID y actualizar sus datos
function mostrarVeterinarios(veterinarios) {

    // forreach para mostrar y find para buscar y editar
   getVeterinarios().forEach((veterinario) => {
    if (veterinario.id === veterinarios.id) {
        veterinario.nombre = veterinarios.nombre;
        veterinario.duenio = veterinarios.duenio;
        veterinario.color = veterinarios.color;
        veterinario.edad = veterinarios.edad;
        veterinario.peso = veterinarios.peso;
    }
setLocalStorage('veterinarios', getVeterinarios());
});

// obtengo la lista de veterinarios del localStorage ya comprobada
function getVeterinarios() {
     const listaVeterinarios = getLocalStorage('veterinarios')
     return Array.isArray(listaVeterinarios) ? listaVeterinarios : [];
        };

function agregarVeterinario(veterinario){
    const listaVeterinarios = getLocalStorage('veterinarios');
    listaVeterinarios.push(veterinario);
    setLocalStorage('veterinarios', listaVeterinarios);
}
}

