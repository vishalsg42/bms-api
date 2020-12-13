module.exports = (sequelize, DataTypes) => {
  const cinemaHallSeatSchema = sequelize.define('cinema_seat', {
    'id': {
      'primaryKey': true,
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'seat_number': {
      'type': DataTypes.SMALLINT
    },
    'cinema_hall_id': {
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
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
  return cinemaHallSeatSchema;
};
