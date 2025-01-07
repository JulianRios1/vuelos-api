
const { body, validationResult } = require('express-validator');

const itinerarioValidationRules = () => {
  return [
    body('idVuelo').notEmpty().withMessage('ID de vuelo es requerido'),
    body('tipoVuelo')
      .isIn(['Charter', 'Cargo'])
      .withMessage('Tipo de vuelo debe ser Charter o Cargo'),
    body('estadoVuelo').notEmpty().withMessage('Estado de vuelo es requerido'),
    body('cantidadTripulantes')
      .isInt({ min: 1 })
      .withMessage('Cantidad de tripulantes debe ser mayor a 0'),
    body('pesoCarga')
      .isFloat({ min: 0 })
      .withMessage('Peso de carga debe ser un número positivo'),
    body('cantidadPasajeros')
      .isInt({ min: 0 })
      .withMessage('Cantidad de pasajeros debe ser un número positivo'),
    body('fechaSalida')
      .isISO8601()
      .withMessage('Fecha de salida debe ser una fecha válida'),
    body('destino').notEmpty().withMessage('Destino es requerido')
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  itinerarioValidationRules,
  validate
};