import { haySesion, cerrarSesion } from "./auth.js";

// Ajusta la visibilidad de los elementos del menú según si el usuario inicio sesion o no
export function configurarNavbar() {
  const sesionIniciada = haySesion();

  // Detectamos si la página esta dentro de la carpeta /pages/ o en la raíz
  const estaEnPages = window.location.pathname.includes("/pages/");
  const rutaLogin = estaEnPages ? "./login.html" : "./pages/login.html";

  // Obtenemos los elementos del menu 
  const itemsAdmin = document.querySelectorAll(".nav-admin");
  const itemsVisitante = document.querySelectorAll(".nav-visitante");
  const itemsSesionActiva = document.querySelectorAll(".nav-sesion-activa");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  if (sesionIniciada) {
    // Administrador: mostramos gestion y boton de cerrar sesion
    itemsAdmin.forEach((item) => item.classList.remove("d-none"));
    itemsVisitante.forEach((item) => item.classList.add("d-none"));
    itemsSesionActiva.forEach((item) => item.classList.remove("d-none"));
  } else {
    // Visitante: ocultamos gestion y mostramos boton de ingresar
    itemsAdmin.forEach((item) => item.classList.add("d-none"));
    itemsVisitante.forEach((item) => item.classList.remove("d-none"));
    itemsSesionActiva.forEach((item) => item.classList.add("d-none"));
  }

  // Evento para el boton de cerrar sesion
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", (e) => {
      e.preventDefault();
      cerrarSesion(rutaLogin);
    });
  }
}

// Ejecutamos la configuración al cargar el script
configurarNavbar();

