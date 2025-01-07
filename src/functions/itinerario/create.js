const { withAuth } = require('../../middlewares/auth');
const { DynamoDB } = require('aws-sdk');
const dynamoDb = new DynamoDB.DocumentClient();
const { validateItinerario } = require('../../middlewares/validator');

// Primero definimos la función createItinerario
const createItinerario = async (event) => {
  try {
    const data = JSON.parse(event.body);
    
    // Validar datos
    const validationError = validateItinerario(data);
    if (validationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validationError })
      };
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        idVuelo: data.idVuelo,
        tipoVuelo: data.tipoVuelo,
        observaciones: data.observaciones,
        estadoVuelo: data.estadoVuelo,
        cantidadTripulantes: data.cantidadTripulantes,
        pesoCarga: data.pesoCarga,
        cantidadPasajeros: data.cantidadPasajeros,
        fechaSalida: data.fechaSalida,
        rutaVouchers: data.rutaVouchers,
        rutaAprobacionAerocivil: data.rutaAprobacionAerocivil,
        destino: data.destino,
        createdAt: new Date().toISOString()
      }
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(params.Item)
    };
  } catch (error) {
    console.error('Error creating itinerario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create the itinerario' })
    };
  }
};

// Luego exportamos la función envuelta en el middleware
module.exports.handler = withAuth(createItinerario);