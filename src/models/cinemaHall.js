const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig').default;

const cinemaHallSchema = sequelize.define('cinema_hall', {
  'id': {
    'primaryKey': true,
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
  'name': {
    'type': Sequelize.STRING(50)
  },
  'total_seats': {
    'type': Sequelize.SMALLINT(10)
  },
  'cinema_id': {
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
}, {
  'indexes': [
    {
      'fields': ['id', 'name', 'cinema_id']
    },
  ]
});

cinemaHallSchema.associate = function (models) {
  cinemaHallSchema.belongsTo(models.cinemaHall, { foreignKey: 'cinema_id', as: 'cinema' });
};

exports.default = cinemaHallSchema;
