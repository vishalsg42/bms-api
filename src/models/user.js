const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig').default;
const bcrypt = require('bcryptjs');

const userSchema = sequelize.define('user', {
  'id': {
    'primaryKey': true,
    'type': Sequelize.UUID,
    'defaultValue': Sequelize.UUIDV4
  },
  'first_name': {
    'type': Sequelize.STRING(50)
  },
  'last_name': {
    'type': Sequelize.STRING(50)
  },
  'email': {
    'type': Sequelize.STRING(50)
  },
  'password': {
    'type': Sequelize.STRING
  },
  'ph_number': {
    'type': Sequelize.STRING(20)
  },
  'primary_address': {
    'type': Sequelize.STRING(255)
  },
  'state': {
    'type': Sequelize.STRING(100)
  },
  'city': {
    'type': Sequelize.STRING(100)
  },
  'zipcode': {
    'type': Sequelize.STRING(10)
  },
  'country': {
    'type': Sequelize.STRING(30)
  }
}, {
  'indexes': [{
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

exports.default = userSchema;
