module.exports = (sequelize, DataTypes) => {
  const cinemaSchema = sequelize.define('cinema', {
    'id': {
      'primaryKey': true,
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'name': {
      'type': DataTypes.STRING(50)
    },
    'total_cinema_halls': {
      'type': DataTypes.SMALLINT,
    },
    'zipcode': {
      'type': DataTypes.STRING(16)
    },
    'city_id': {
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
  }, {
    'indexes': [
      {
        'fields': ['id', 'name', 'zipcode', 'city_id']
      },
    ]
  });

  cinemaSchema.associate = function (models) {
    cinemaSchema.belongsTo(models.city, { foreignKey: 'city_id', as: 'city' });
  };

  return cinemaSchema;
};
