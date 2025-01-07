// src/functions/auth/register.js
const UserModel = require('../../models/user');

module.exports.handler = async (event) => {
  try {
    const userData = JSON.parse(event.body);

    // Validación básica
    if (!userData.email || !userData.password || !userData.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Please provide email, password and name'
        })
      };
    }

    const user = await UserModel.create(userData);

    return {
      statusCode: 201,
      body: JSON.stringify(user)
    };
  } catch (error) {
    if (error.message === 'User already exists') {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'User already exists' })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not register user' })
    };
  }
};