const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JVT API',
      version: '1.0.0',
      description: 'API для управления [описание проекта]',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./routes/auth.router.js'], // Путь к файлам с роутерами
};

module.exports = swaggerJsdoc(options);