// User define DB Creadentials
const dbCredentials = require('./config').db;
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const Op = Sequelize.Op;
const operatorsAliases = {
  '$eq': Op.eq,
  '$ne': Op.ne,
  '$gte': Op.gte,
  '$gt': Op.gt,
  '$lte': Op.lte,
  '$lt': Op.lt,
  '$not': Op.not,
  '$in': Op.in,
  '$notIn': Op.notIn,
  '$is': Op.is,
  '$like': Op.like,
  '$notLike': Op.notLike,
  '$iLike': Op.iLike,
  '$notILike': Op.notILike,
  '$regexp': Op.regexp,
  '$notRegexp': Op.notRegexp,
  '$iRegexp': Op.iRegexp,
  '$notIRegexp': Op.notIRegexp,
  '$between': Op.between,
  '$notBetween': Op.notBetween,
  '$overlap': Op.overlap,
  '$contains': Op.contains,
  '$contained': Op.contained,
  '$adjacent': Op.adjacent,
  '$strictLeft': Op.strictLeft,
  '$strictRight': Op.strictRight,
  '$noExtendRight': Op.noExtendRight,
  '$noExtendLeft': Op.noExtendLeft,
  '$and': Op.and,
  '$or': Op.or,
  '$any': Op.any,
  '$all': Op.all,
  '$values': Op.values,
  '$col': Op.col
};

//Bring in the sequelize module
const {
  name,
  username,
  password,
  host,
  port,
  dialect,
} = dbCredentials.sqlDbConfig;

//logging: false because sequelize by default log all DB activities in console which will unneccessarily flood the console.
const sequelize = new Sequelize(name, username, password, {
  host,
  port,
  dialect,
  logging: false,
  operatorsAliases: operatorsAliases,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    //'timestamps': false // globally defined timestamps fields false for all model.
    underscored: true // globally defined column name as snake_case.
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.cinemaHall = require('../models/cinemaHall')(sequelize, Sequelize);
db.cinemas = require('../models/cinemas')(sequelize, Sequelize);
db.cinemaSeat = require('../models/cinemaSeats')(sequelize, Sequelize);
db.city = require('../models/cities')(sequelize, Sequelize);
db.show = require('../models/show')(sequelize, Sequelize);
db.movies = require('../models/movies')(sequelize, Sequelize);
db.user = require('../models/users')(sequelize, Sequelize, bcrypt);
db.showSeat = require('../models/showSeat')(sequelize, Sequelize);
db.booking = require('../models/bookings')(sequelize, Sequelize);

/**Relationship cinema & city*/
db.city.hasMany(sequelize.model('cinema'));
db.cinemas.belongsTo(sequelize.model('city'));

/**Relationship between cinema & cinema hall*/
db.cinemas.hasMany(sequelize.model('cinema_hall'));
db.cinemaHall.belongsTo(sequelize.model('cinema'));

/**Relationship between cinema hall & show*/
db.show.belongsTo(sequelize.model('cinema_hall'));

/**Relationship between cinema hall & cinema seat*/
// db.cinemaSeat.hasMany(sequelize.model('cinema_hall'));
// db.cinemaHall.belongsTo(sequelize.model('cinema_seat'));

/**Relationship between cinema seat, show, booking*/
// db.showSeat.hasMany(sequelize.model('cinema_seat'));
db.showSeat.hasMany(sequelize.model('show'));
db.showSeat.hasMany(sequelize.model('booking'));
db.booking.belongsTo(sequelize.model('show_seat'));
db.show.belongsTo(sequelize.model('show_seat'));
// db.cinemaSeat.belongsTo(sequelize.model('show_seat'));

// /**Relationship between show, booking & user*/
db.booking.hasMany(sequelize.model('show'));
db.booking.hasMany(sequelize.model('user'));
db.user.belongsTo(sequelize.model('booking'));
db.show.belongsTo(sequelize.model('booking'));


sequelize
  .authenticate()
  .then(() =>
    console.log(
      `Sequelize connection started on database "${name}" from "${dialect}"`
    )
  )
  .catch((err) => console.error(`Sequelize connection error: ${err}`));

process.on('SIGINT', function () {
  console.log('Sequelize disconnected through app termination');
  process.exit(0);
});

//Exported the database connection to be imported at the server
exports.default = db;

