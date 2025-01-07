// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

// Función principal del Custom Authorizer
const verifyToken = async (event) => {
  if (!event.headers) {
    throw new Error('No headers in event');
  }

  try {
    // Extraer el token del header de autorización
    const token = event.headers.Authorization?.replace('Bearer ', '') || 
                 event.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return generatePolicy('user', 'Deny', event.routeArn || event.methodArn);
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar la información del usuario al contexto
    const context = {
      user: {
        email: decoded.email,
        role: decoded.role
      }
    };

    return generatePolicy(decoded.email, 'Allow', event.routeArn || event.methodArn, context);
  } catch (error) {
    console.error('Auth Error:', error);
    return generatePolicy('user', 'Deny', event.routeArn || event.methodArn);
  }
};

// Función auxiliar para generar la política de IAM
const generatePolicy = (principalId, effect, resource, context = {}) => {
  const authResponse = {
    principalId,
    context,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }]
    }
  };

  return authResponse;
};

// Middleware para usar en funciones individuales
const withAuth = (handler) => {
  return async (event, context) => {
    try {
      // Verificar el token aquí si necesitas validación adicional
      // o acceder a la información del usuario
      const token = event.headers.Authorization?.replace('Bearer ', '') || 
                   event.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'No token provided' })
        };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Adjuntar la información del usuario al evento
      event.user = decoded;

      // Ejecutar el handler original
      return await handler(event, context);
    } catch (error) {
      console.error('Auth Error:', error);
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }
  };
};

module.exports = {
  verifyToken,
  withAuth
};