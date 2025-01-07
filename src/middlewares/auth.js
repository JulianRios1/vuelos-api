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

    // Aplanar el contexto para solo usar tipos primitivos
    const context = {
      userEmail: decoded.email,        // string
      userRole: decoded.role,          // string
      tokenIssueTime: decoded.iat?.toString(),    // convertido a string
      tokenExpiration: decoded.exp?.toString()     // convertido a string
    };

    return generatePolicy(decoded.email, 'Allow', event.routeArn || event.methodArn, context);
  } catch (error) {
    console.trace('Auth Error:', error);
    return generatePolicy('user', 'Deny', event.routeArn || event.methodArn);
  }
};

// Función auxiliar para generar la política de IAM
const generatePolicy = (principalId, effect, resource, context = {}) => {
  // Validar que todos los valores del contexto sean primitivos
  const sanitizedContext = Object.entries(context).reduce((acc, [key, value]) => {
    // Solo permitir string, number, o boolean
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      acc[key] = value;
    } else if (value != null) {
      // Convertir otros valores a string si no son null/undefined
      acc[key] = String(value);
    }
    return acc;
  }, {});

  const authResponse = {
    principalId,
    context: sanitizedContext,
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
      // Aplanar la información del usuario antes de adjuntarla al evento
      event.user = {
        email: decoded.email,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp
      };

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