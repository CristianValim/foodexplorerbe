const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Explorer API',
      version: '1.0.0',
      description: 'O backend do Food Explorer fornece a API que suporta o sistema de gerenciamento de pratos e usuários para um restaurante. Ele permite operações como criação, atualização, exclusão e recuperação de pratos, bem como gerenciamento de usuários e sessões.',
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
