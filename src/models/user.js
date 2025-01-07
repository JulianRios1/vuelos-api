const { DynamoDB } = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dynamoDb = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.USERS_TABLE;
const JWT_SECRET = process.env.JWT_SECRET;

class UserModel {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const params = {
      TableName: TABLE_NAME,
      Item: {
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        name: userData.name,
        role: userData.role || 'user',
        createdAt: new Date().toISOString()
      },
      // Asegurarse de que el email sea único
      ConditionExpression: 'attribute_not_exists(email)'
    };

    try {
      await dynamoDb.put(params).promise();
      const { password, ...userWithoutPassword } = params.Item;
      return userWithoutPassword;
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        throw new Error('User already exists');
      }
      throw error;
    }
  }

  static async authenticate(email, password) {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        email: email.toLowerCase()
      }
    };

    const { Item: user } = await dynamoDb.get(params).promise();
    
    if (!user) {
      throw new Error('User not found');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    
    if (!passwordIsValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { 
        email: user.email,
        role: user.role,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token
    };
  }
}

module.exports = UserModel;