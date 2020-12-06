const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig').default;

const citiesSchema = sequelize.define('city', {
  'id': {
    'primaryKey': true,
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
  'name': {
    'type': Sequelize.STRING(50)
  },
  'state': {
    'type': Sequelize.STRING(512)
  }
}, {
  'indexes': [
    {
      'fields': ['id', 'name', 'state']
    },
  ]
});

exports.default = citiesSchema;
