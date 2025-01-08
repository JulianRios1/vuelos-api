// src/middlewares/validator.js

const validateItinerario = (data) => {
  const errors = [];

  // Validar ID de vuelo
  if (!data.idVuelo) {
    errors.push('ID de vuelo es requerido');
  }

  // Validar tipo de vuelo
  if (!['Charter', 'Cargo'].includes(data.tipoVuelo)) {
    errors.push('Tipo de vuelo debe ser Charter o Cargo');
  }

  // Validar estado de vuelo
  if (!data.estadoVuelo) {
    errors.push('Estado de vuelo es requerido');
  }

  // Validar cantidad de tripulantes
  if (!Number.isInteger(data.cantidadTripulantes) || data.cantidadTripulantes < 1) {
    errors.push('Cantidad de tripulantes debe ser mayor a 0');
  }

  // Validar peso de carga
  if (data.pesoCarga && (isNaN(data.pesoCarga) || data.pesoCarga < 0)) {
    errors.push('Peso de carga debe ser un número positivo');
  }

  // Validar cantidad de pasajeros
  if (!Number.isInteger(data.cantidadPasajeros) || data.cantidadPasajeros < 0) {
    errors.push('Cantidad de pasajeros debe ser un número positivo');
  }

  // Validar fecha de salida
  const fechaSalida = new Date(data.fechaSalida);
  if (isNaN(fechaSalida.getTime())) {
    errors.push('Fecha de salida debe ser una fecha válida');
  }

  // Validar destino
  if (!data.destino) {
    errors.push('Destino es requerido');
  }

  // Si hay errores, retornar el primer error
  // Puedes modificar esto para retornar todos los errores si lo prefieres
  return errors.length > 0 ? errors[0] : null;
};

module.exports = {
  validateItinerario
};