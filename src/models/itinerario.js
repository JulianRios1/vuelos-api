
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'Itinerarios';

class ItinerarioModel {
  static async create(itinerarioData) {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        idVuelo: itinerarioData.idVuelo,
        tipoVuelo: itinerarioData.tipoVuelo,
        observaciones: itinerarioData.observaciones,
        estadoVuelo: itinerarioData.estadoVuelo,
        cantidadTripulantes: itinerarioData.cantidadTripulantes,
        pesoCarga: itinerarioData.pesoCarga,
        cantidadPasajeros: itinerarioData.cantidadPasajeros,
        fechaSalida: itinerarioData.fechaSalida,
        rutaVouchers: itinerarioData.rutaVouchers,
        rutaAprobacionAerocivil: itinerarioData.rutaAprobacionAerocivil,
        destino: itinerarioData.destino,
        createdAt: new Date().toISOString()
      }
    };

    try {
      await dynamodb.put(params).promise();
      return params.Item;
    } catch (error) {
      throw new Error(`Error creating itinerario: ${error.message}`);
    }
  }
}

module.exports = ItinerarioModel;