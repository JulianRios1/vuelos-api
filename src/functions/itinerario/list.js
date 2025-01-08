const { withAuth } = require('../../middlewares/auth');
const { DynamoDB } = require('aws-sdk');
const dynamoDb = new DynamoDB.DocumentClient();

const listItinerarios = async (event) => {
  try {
    // Obtener parámetros de paginación del querystring
    const { limit = 50, lastEvaluatedKey } = event.queryStringParameters || {};

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Limit: parseInt(limit)
    };

    // Si hay un lastEvaluatedKey, lo añadimos para la paginación
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(Buffer.from(lastEvaluatedKey, 'base64').toString());
    }

    const result = await dynamoDb.scan(params).promise();

    // Preparar la respuesta con paginación
    const response = {
      items: result.Items,
      count: result.Count,
      scannedCount: result.ScannedCount
    };

    // Si hay más resultados, incluir el token de paginación
    if (result.LastEvaluatedKey) {
      response.lastEvaluatedKey = Buffer.from(
        JSON.stringify(result.LastEvaluatedKey)
      ).toString('base64');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Error listing itinerarios:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not list the itinerarios' })
    };
  }
};

module.exports.handler = withAuth(listItinerarios);