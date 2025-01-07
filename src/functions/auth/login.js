const UserModel = require('../../models/user');

module.exports.handler = async (event) => {
    try {
      const { email, password } = JSON.parse(event.body);
      if (!email || !password) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Please provide email and password'
          })
        };
      }
  
      const auth = await UserModel.authenticate(email, password);
      return {
        statusCode: 200,
        body: JSON.stringify(auth)
      };
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Invalid credentials'
        })
      };
    }
  };