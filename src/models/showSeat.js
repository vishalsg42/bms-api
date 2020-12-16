module.exports = (sequelize, DataTypes) => {
  const showSeat = sequelize.define('show_seat', {
    'id': {
      'primaryKey': true,
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'price': {
      'type': DataTypes.INTEGER.UNSIGNED
    },
    'status': {
      'type': DataTypes.ENUM('0', '1')
    },
    'cinema_seat_id': {
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'booking_id': {
      'type': DataTypes.UUID,
    },
    'show_id': {
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
  }, {
    'indexes': [
      {
        'fields': ['id', 'price', 'cinema_seat_id', 'booking_id', 'show_id']
      }
    ]
  });

  return showSeat;

};
