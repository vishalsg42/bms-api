module.exports = (sequelize, DataTypes) => {
  const show = sequelize.define('show', {
    'id': {
      'primaryKey': true,
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'date': {
      'type': DataTypes.DATE
    },
    'start_time': {
      'type': DataTypes.DATE
    },
    'end_time': {
      'type': DataTypes.DATE
    },
    'cinema_hall_id': {
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'movie_id': {
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
  }, {
    'indexes': [
      {
        'fields': ['id', 'date', 'cinema_hall_id', 'movie_id']
      },
    ]
  });

  return show;

};

// show.associate = function (models) {
//   show.belongsTo(models.cinema_hall, { foreignKey: 'cinema_hall_id', as: 'cinema_hall' });
//   show.belongsTo(models.movie, { foreignKey: 'movie_id', as: 'movie' });
// };
