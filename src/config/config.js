let config = {};

/* mongodb connection configuration */
let noSqlDbConfig = {
  url: process.env.DB_URL || 'mongodb://localhost:27017/',
  name: process.env.DB_NAME || 'prdxn',
};

/* sql connection configuration */
let sqlDbConfig = {
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  dialect: process.env.DB_DIALECT || 'mariadb',
  name: process.env.DB_NAME || 'bms-api',
  timezone: process.env.TIMEZONE || '+05:30',
};

config.db = {
  noSqlDbConfig,
  sqlDbConfig,
};

/* JWT Authentication Credentials  */
config.jwt = {
  secret: process.env.JWT_SECRET || 'qweqweUQKJNqweaw!weqedwq',
  expireIn: process.env.JWT_EXPIRE_IN || '1d',
  algorithm: process.env.JWT_ALGORITHM || 'HS256',
};

config.client = process.env.CLIENT_URL || '*';

/* Swagger Definition */
config.swaggerDefinition = {
  info: {
    title: 'Movie API',
    version: '1.0.0',
    description: 'Demonstrating RESTful APIs.',
  },
  host: process.env.HOST || 'localhost:8000',
  basePath: '/api',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};
config.swaggerOptions = {
  customSiteTitle: 'Movie Api Documents',
  customCss: '.swagger-ui .topbar { display: none }',
  customfavIcon: '',
};

module.exports = config;
