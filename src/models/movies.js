const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig').default;

const movieSchema = sequelize.define('user', {
  'id': {
    'primaryKey': true,
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
  'title': {
    'type': Sequelize.STRING(50)
  },
  'description': {
    'type': Sequelize.STRING(512)
  },
  'duration': {
    'type': Sequelize.STRING(50)
  },
  'language': {
    'type': Sequelize.STRING
  },
  'release_date': {
    'type': Sequelize.STRING(20)
  },
  'country': {
    'type': Sequelize.STRING(255)
  },
  'genre': {
    'type': Sequelize.STRING(100)
  },
}, {
  'indexes': [
    {
      'fields': ['id', 'title','duration', 'release_date']
    },
  ]
});

exports.default = movieSchema;
