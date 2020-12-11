const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig').default;

const cinemaHallSeatSchema = sequelize.define('show', {
  'id': {
    'primaryKey': true,
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
  'date': {
    'type': Sequelize.DATE
  },
  'start_time': {
    'type': Sequelize.DATE
  },
  'end_time': {
    'type': Sequelize.DATE
  },
  'cinema_hall_id': {
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
  'movie_id': {
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
}, {
  'indexes': [
    {
      'fields': ['id', 'date', 'cinema_hall_id', 'movie_id']
    },
  ]
});

cinemaHallSeatSchema.associate = function (models) {
  cinemaHallSeatSchema.belongsTo(models.cinema_hall, { foreignKey: 'cinema_hall_id', as: 'cinema_hall' });
  cinemaHallSeatSchema.belongsTo(models.movie, { foreignKey: 'movie_id', as: 'movie' });
};

exports.default = cinemaHallSeatSchema;
