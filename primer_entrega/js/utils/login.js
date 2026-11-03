const form = document.getElementById("formLogin");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Traemos los datos del formulario
  const formData = new FormData(form);

  // Los pasamos a objeto
  const data = Object.fromEntries(formData);

  console.log(data);
});
