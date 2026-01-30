const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Farmasi Queue API',
      version: '1.0.0',
      description: 'API documentation for Antrian Farmasi system',
    },
    servers: [
      {
        url: 'http://192.168.6.106:5000',
        description: 'Development server',
      },
      {
        url: 'http://172.16.158.22:5000',
        description: 'Local server',
      }
    ],
  },
  // Path to API docs (where you'll add JSDoc comments)
  apis: ['./src/routes/*.js', './src/controllers/*.js', './src/services/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };