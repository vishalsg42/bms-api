const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig').default;

const cinemaSchema = sequelize.define('cinema', {
  'id': {
    'primaryKey': true,
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
  'name': {
    'type': Sequelize.STRING(50)
  },
  'totalCinemaHalls': {
    'type': Sequelize.SMALLINT(10)
  },
  'zippcode': {
    'type': Sequelize.STRING(16)
  },
  'city_id': {
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
}, {
  'indexes': [
    {
      'fields': ['id', 'name', 'zippcode', 'city_id']
    },
  ]
});

cinemaSchema.associate = function (models) {
  cinemaSchema.belongsTo(models.city, { foreignKey: 'city_id', as: 'city' });
};

exports.default = cinemaSchema;
