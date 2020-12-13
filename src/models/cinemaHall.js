module.exports = (sequelize, DataTypes) => {
  const cinemaHallSchema = sequelize.define('cinema_hall', {
    'id': {
      'primaryKey': true,
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'name': {
      'type': DataTypes.STRING(50)
    },
    'total_seats': {
      'type': DataTypes.SMALLINT(10)
    },
    'cinema_id': {
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
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
  return cinemaHallSchema;
};
