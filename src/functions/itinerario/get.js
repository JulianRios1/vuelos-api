const { withAuth } = require('../../middlewares/auth');
const { DynamoDB } = require('aws-sdk');
const dynamoDb = new DynamoDB.DocumentClient();

const getItinerario = async (event) => {
  try {
    const { idVuelo } = event.pathParameters;

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        idVuelo: idVuelo
      }
    };

    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Itinerario no encontrado' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Error getting itinerario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not get the itinerario' })
    };
  }
};

module.exports.handler = withAuth(getItinerario);