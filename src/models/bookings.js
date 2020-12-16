module.exports = (sequelize, DataTypes) => {
  const booking = sequelize.define('booking', {
    'id': {
      'primaryKey': true,
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'number_of_seats': {
      'type': DataTypes.INTEGER.UNSIGNED
    },
    'status': {
      'type': DataTypes.ENUM('SUCCESS','FAILED')
    },
    'user_id': {
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'show_id': {
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
  }, {
    'indexes': [
      {
        'fields': ['id', 'status', 'user_id', 'show_id']
      }
    ]
  });

  return booking;

};
