module.exports = (sequelize, DataTypes) => {
  const citySchema = sequelize.define('city', {
    'id': {
      'primaryKey': true,
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'name': {
      'type': DataTypes.STRING(50)
    },
    'state': {
      'type': DataTypes.STRING(512)
    }
  }, {
    'indexes': [
      {
        'fields': ['id', 'name', 'state']
      },
    ]
  });

  return citySchema;
};
