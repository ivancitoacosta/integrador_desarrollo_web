/**
 * Función para generar un ID único
 */
export function generarId() {
  return crypto.randomUUID()
}

/**
 * Función para formatear moneda a formato ARS
 */
export function formateoMoneda() {
  const moneda = new Intl.NumberFormat("es-AR", {
    style: 'currency',
    currency: "ARS"
  });
  return moneda
}
