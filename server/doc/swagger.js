const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Мессенджер для владельцев домашних животных',
      version: '1.5.1',
      description: 'API для управления мессенджером для собачников, если будешь переделывать то удачи тебе друг',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./routes/auth.router.js'], 
};

module.exports = swaggerJsdoc(options);