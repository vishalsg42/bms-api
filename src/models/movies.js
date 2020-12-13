module.exports = (sequelize, DataTypes) => {
  const movieSchema = sequelize.define('movie', {
    'id': {
      'primaryKey': true,
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'title': {
      'type': DataTypes.STRING(50)
    },
    'description': {
      'type': DataTypes.TEXT
    },
    'duration': {
      'type': DataTypes.STRING(50)
    },
    'language': {
      'type': DataTypes.STRING
    },
    'release_date': {
      'type': DataTypes.STRING(20)
    },
    'country': {
      'type': DataTypes.STRING(255)
    },
    'genre': {
      'type': DataTypes.STRING(100)
    },
  }, {
    'indexes': [
      {
        'fields': ['id', 'title', 'duration', 'release_date']
      },
    ]
  });

  return movieSchema;
};
