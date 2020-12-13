
module.exports = (sequelize, DataTypes, bcrypt) => {
  const userSchema = sequelize.define('user', {
    'id': {
      'primaryKey': true,
      'type': DataTypes.UUID,
      'defaultValue': DataTypes.UUIDV4
    },
    'first_name': {
      'type': DataTypes.STRING(50)
    },
    'last_name': {
      'type': DataTypes.STRING(50)
    },
    'email': {
      'type': DataTypes.STRING(50)
    },
    'password': {
      'type': DataTypes.STRING
    },
    'ph_number': {
      'type': DataTypes.STRING(20)
    },
    'primary_address': {
      'type': DataTypes.STRING(255)
    },
    'state': {
      'type': DataTypes.STRING(100)
    },
    'city': {
      'type': DataTypes.STRING(100)
    },
    'zipcode': {
      'type': DataTypes.STRING(10)
    },
    'country': {
      'type': DataTypes.STRING(30)
    }
  }, {
    'indexes': [
      {
        'fields': ['id']
      },
      {
        'unique': true,
        'fields': ['email']
      },
      {
        'fields': ['password']
      }
    ]
  });

  userSchema.beforeCreate((user) => {
    let salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
  });
  return userSchema;
};
