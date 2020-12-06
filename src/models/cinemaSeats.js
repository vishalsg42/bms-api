const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig').default;

const cinemaHallSeatSchema = sequelize.define('cinema_seat', {
  'id': {
    'primaryKey': true,
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
  'seat_number': {
    'type': Sequelize.SMALLINT(10)
  },
  'cinema_hall_id': {
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
}, {
  'indexes': [
    {
      'fields': ['id', 'name', 'cinema_hall_id']
    },
  ]
});

cinemaHallSeatSchema.associate = function (models) {
  cinemaHallSeatSchema.belongsTo(models.cinema_hall, { foreignKey: 'cinema_hall_id', as: 'cinema_hall' });
};

exports.default = cinemaHallSeatSchema;
